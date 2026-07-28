-- =============================================================================
-- Vandy Creator Engine — Database schema (Supabase / Postgres)
-- Two subsystems in one ledger: CLIPPING (pay-per-views) + REFERRAL (pay-per-conversion)
--
-- Apply in: Supabase Dashboard -> SQL Editor  (project "VANDY Website").
-- After applying, expose the `creator` schema:
--   Settings -> API -> Exposed schemas -> add `creator`.
--
-- Money is ALWAYS integer minor units (cents). Never floats.
-- `earnings` is APPEND-ONLY: never update amounts; add reversing rows (clawback/adjustment).
-- Webhook/worker writes use the SERVICE ROLE (bypasses RLS). Clients are read-own only.
-- =============================================================================

create schema if not exists creator;
create extension if not exists pgcrypto;   -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- Roles & helpers
-- -----------------------------------------------------------------------------

-- Admin allowlist (map a Supabase auth user to admin rights).
create table if not exists creator.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- True when the current request's user is an admin.
create or replace function creator.is_admin()
  returns boolean
  language sql stable security definer set search_path = creator, public
as $$
  select exists (select 1 from creator.admins a where a.user_id = auth.uid());
$$;

-- The clipper id owned by the current request's user (null if none).
create or replace function creator.current_clipper_id()
  returns uuid
  language sql stable security definer set search_path = creator, public
as $$
  select c.id from creator.clippers c where c.user_id = auth.uid();
$$;

-- -----------------------------------------------------------------------------
-- CLIPPERS
-- -----------------------------------------------------------------------------
create table if not exists creator.clippers (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid unique references auth.users(id) on delete set null,
  name               text not null,
  email              text unique not null,
  code               text unique,                 -- e.g. ALEX20 (null until approved)
  link_slug          text unique,                 -- e.g. alex  -> vndy.co/alex
  tier               text not null default 'rookie' check (tier in ('rookie','pro','elite')),
  status             text not null default 'pending' check (status in ('pending','approved','banned')),
  wallet_cents       bigint not null default 0,   -- cached available balance
  connect_account_id text,                         -- Stripe Connect (Express) account id
  connect_status     text default 'none' check (connect_status in ('none','onboarding','active','restricted')),
  payout_method      jsonb,                        -- fallback rail (crypto address, etc.)
  created_at         timestamptz not null default now(),
  approved_at        timestamptz
);

-- OAuth connections used to READ view counts for the clipper's OWN content.
-- access_token/refresh_token MUST be encrypted at the app layer before insert.
create table if not exists creator.social_connections (
  id                  uuid primary key default gen_random_uuid(),
  clipper_id          uuid not null references creator.clippers(id) on delete cascade,
  platform            text not null check (platform in ('tiktok','instagram','youtube','x')),
  external_account_id text,                        -- platform user/channel id
  handle              text,
  scopes              text[],
  access_token        text,                        -- ciphertext (app-encrypted)
  refresh_token       text,                        -- ciphertext (app-encrypted)
  token_expires_at    timestamptz,
  verified            boolean not null default false,
  connected_at        timestamptz not null default now(),
  unique (clipper_id, platform)
);

-- -----------------------------------------------------------------------------
-- CLIPPING: campaigns + content library + clips + view snapshots
-- -----------------------------------------------------------------------------
create table if not exists creator.campaigns (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  brand        text not null,                      -- 'nowwwa','vandy','dynasty',...
  status       text not null default 'draft' check (status in ('draft','active','paused','ended')),
  budget_cents bigint not null default 0,
  spent_cents  bigint not null default 0,
  cpm_cents    integer not null default 100,       -- payout per 1000 payable views
  min_views    bigint  not null default 10000,     -- qualification threshold per clip
  window_days  integer not null default 60,        -- views counted for N days after first seen
  bonus_tiers  jsonb   not null default '[]'::jsonb,-- [{"views":100000,"bonus_cents":2500}, ...]
  platforms    text[]  not null default '{tiktok,instagram,youtube,x}',
  currency     text    not null default 'usd',
  created_at   timestamptz not null default now()
);

-- Content library = index of EXTERNAL links (Drive/Dropbox). Access gated to approved clippers.
create table if not exists creator.content_assets (
  id           uuid primary key default gen_random_uuid(),
  campaign_id  uuid references creator.campaigns(id) on delete cascade,
  brand        text,
  title        text not null,
  description  text,
  external_url text not null,                       -- Drive/Dropbox link
  kind         text,                                -- raw|broll|demo|highlight
  tags         text[],
  created_at   timestamptz not null default now()
);

create table if not exists creator.clips (
  id                uuid primary key default gen_random_uuid(),
  clipper_id        uuid not null references creator.clippers(id) on delete cascade,
  campaign_id       uuid references creator.campaigns(id) on delete set null,
  platform          text not null check (platform in ('tiktok','instagram','youtube','x')),
  url               text not null,
  external_video_id text,                           -- resolved platform video id
  status            text not null default 'pending'
                      check (status in ('pending','tracking','approved','rejected','closed')),
  current_views     bigint not null default 0,
  payable_views     bigint not null default 0,      -- views counted toward pay (windowed/capped)
  rejected_reason   text,
  submitted_at      timestamptz not null default now(),
  first_seen_at     timestamptz,                    -- tracking anchor (window start)
  last_polled_at    timestamptz,
  unique (platform, url)
);

-- Time series of view counts (for payable delta + velocity/anti-fraud checks).
create table if not exists creator.clip_view_snapshots (
  id          bigint generated always as identity primary key,
  clip_id     uuid not null references creator.clips(id) on delete cascade,
  views       bigint not null,
  source      text not null default 'api' check (source in ('api','manual')),
  captured_at timestamptz not null default now()
);
create index if not exists idx_clip_snapshots_clip_time
  on creator.clip_view_snapshots (clip_id, captured_at desc);

-- -----------------------------------------------------------------------------
-- REFERRAL: promo codes (per Stripe account), attribution, subscriptions mirror
-- -----------------------------------------------------------------------------
-- A clipper gets ONE promotion code per Stripe account (multi-account ready).
create table if not exists creator.promo_codes (
  id                 uuid primary key default gen_random_uuid(),
  clipper_id         uuid not null references creator.clippers(id) on delete cascade,
  stripe_account_id  text not null,
  promotion_code_id  text not null,                 -- Stripe promotion_code id
  coupon_id          text,
  code               text not null,
  created_at         timestamptz not null default now(),
  unique (stripe_account_id, promotion_code_id),
  unique (stripe_account_id, clipper_id)
);

-- Links a Stripe customer/subscription to the clipper who referred them.
create table if not exists creator.attributions (
  id                     uuid primary key default gen_random_uuid(),
  clipper_id             uuid not null references creator.clippers(id) on delete cascade,
  stripe_account_id      text not null,
  stripe_customer_id     text not null,
  stripe_subscription_id text,
  product                text,
  source                 text not null check (source in ('code','link','survey')),
  created_at             timestamptz not null default now(),
  unique (stripe_account_id, stripe_subscription_id)
);

-- Mirror of Stripe subscriptions, kept in sync from webhooks.
create table if not exists creator.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  stripe_account_id      text not null,
  stripe_subscription_id text not null,
  stripe_customer_id     text not null,
  clipper_id             uuid references creator.clippers(id) on delete set null,
  product                text,
  status                 text,                       -- trialing|active|past_due|canceled
  mrr_cents              bigint,
  currency               text not null default 'usd',
  started_at             timestamptz,
  canceled_at            timestamptz,
  unique (stripe_account_id, stripe_subscription_id)
);

-- -----------------------------------------------------------------------------
-- PAYOUTS + EARNINGS ledger (append-only) + idempotency + fraud
-- -----------------------------------------------------------------------------
create table if not exists creator.payouts (
  id                uuid primary key default gen_random_uuid(),
  clipper_id        uuid not null references creator.clippers(id) on delete cascade,
  amount_cents      bigint not null,
  currency          text not null default 'usd',
  method            text not null default 'stripe_connect'
                      check (method in ('stripe_connect','manual','crypto')),
  status            text not null default 'processing'
                      check (status in ('processing','paid','failed','canceled')),
  stripe_transfer_id text,
  batch_id          uuid,
  failure_reason    text,
  created_at        timestamptz not null default now(),
  paid_at           timestamptz
);

-- APPEND-ONLY ledger. Positive = owed to clipper; negative = clawback/adjustment.
create table if not exists creator.earnings (
  id                uuid primary key default gen_random_uuid(),
  clipper_id        uuid not null references creator.clippers(id) on delete cascade,
  type              text not null check (type in ('clip','spark','cpa','revshare','clawback','adjustment')),
  amount_cents      bigint not null,
  currency          text not null default 'usd',
  status            text not null default 'pending'
                      check (status in ('pending','available','paid','reversed')),
  -- optional references depending on type
  clip_id           uuid references creator.clips(id) on delete set null,
  campaign_id       uuid references creator.campaigns(id) on delete set null,
  subscription_id   text,                            -- stripe subscription id
  invoice_id        text,                            -- stripe invoice id
  stripe_account_id text,
  payout_id         uuid references creator.payouts(id) on delete set null,
  available_at      timestamptz,                     -- now + holdDays; flips pending->available
  meta              jsonb,
  created_at        timestamptz not null default now()
);
create index if not exists idx_earnings_clipper_status on creator.earnings (clipper_id, status);
create index if not exists idx_earnings_invoice on creator.earnings (invoice_id);
create index if not exists idx_earnings_clip on creator.earnings (clip_id);

-- Every Stripe event id we've handled (idempotency guard for the webhook).
create table if not exists creator.processed_events (
  event_id          text primary key,
  stripe_account_id text,
  type              text,
  created_at        timestamptz not null default now()
);

create table if not exists creator.fraud_flags (
  id              uuid primary key default gen_random_uuid(),
  clipper_id      uuid references creator.clippers(id) on delete cascade,
  clip_id         uuid references creator.clips(id) on delete set null,
  subscription_id text,
  kind            text not null,   -- self_referral|view_spike|refund_rate|ownership|duplicate
  score           numeric,
  detail          jsonb,
  resolved        boolean not null default false,
  created_at      timestamptz not null default now()
);

-- =============================================================================
-- ROW LEVEL SECURITY
-- Model: clients (authenticated clippers) can READ ONLY their own rows.
--        Admins (creator.is_admin()) can do everything.
--        All writes happen server-side via the SERVICE ROLE, which bypasses RLS.
--        Anonymous role gets nothing.
-- =============================================================================
alter table creator.admins             enable row level security;
alter table creator.clippers           enable row level security;
alter table creator.social_connections enable row level security;
alter table creator.campaigns          enable row level security;
alter table creator.content_assets     enable row level security;
alter table creator.clips              enable row level security;
alter table creator.clip_view_snapshots enable row level security;
alter table creator.promo_codes        enable row level security;
alter table creator.attributions       enable row level security;
alter table creator.subscriptions      enable row level security;
alter table creator.payouts            enable row level security;
alter table creator.earnings           enable row level security;
alter table creator.processed_events   enable row level security;
alter table creator.fraud_flags        enable row level security;

-- Admin can read the admins table (needed for is_admin() introspection in UI).
create policy admins_admin_all on creator.admins
  for select using (creator.is_admin());

-- Helper: clipper reads own row (by user_id) OR admin.
create policy clippers_read on creator.clippers
  for select using (user_id = auth.uid() or creator.is_admin());
create policy clippers_admin_write on creator.clippers
  for all using (creator.is_admin()) with check (creator.is_admin());

-- Per-clipper owned tables: read own OR admin.
create policy social_read on creator.social_connections
  for select using (clipper_id = creator.current_clipper_id() or creator.is_admin());
create policy clips_read on creator.clips
  for select using (clipper_id = creator.current_clipper_id() or creator.is_admin());
create policy promo_read on creator.promo_codes
  for select using (clipper_id = creator.current_clipper_id() or creator.is_admin());
create policy attributions_read on creator.attributions
  for select using (clipper_id = creator.current_clipper_id() or creator.is_admin());
create policy subscriptions_read on creator.subscriptions
  for select using (clipper_id = creator.current_clipper_id() or creator.is_admin());
create policy payouts_read on creator.payouts
  for select using (clipper_id = creator.current_clipper_id() or creator.is_admin());
create policy earnings_read on creator.earnings
  for select using (clipper_id = creator.current_clipper_id() or creator.is_admin());

-- View snapshots: readable if the parent clip belongs to the clipper (or admin).
create policy snapshots_read on creator.clip_view_snapshots
  for select using (
    creator.is_admin() or exists (
      select 1 from creator.clips c
      where c.id = clip_view_snapshots.clip_id
        and c.clipper_id = creator.current_clipper_id()
    )
  );

-- Campaigns + content library: any approved clipper may READ (browse); admin manages.
create policy campaigns_read on creator.campaigns
  for select using (
    creator.is_admin() or creator.current_clipper_id() is not null
  );
create policy content_read on creator.content_assets
  for select using (
    creator.is_admin() or creator.current_clipper_id() is not null
  );

-- Fraud flags + processed events: admin only (no client read).
create policy fraud_admin on creator.fraud_flags
  for all using (creator.is_admin()) with check (creator.is_admin());
create policy events_admin on creator.processed_events
  for select using (creator.is_admin());

-- =============================================================================
-- NOTES
-- * Add `creator` to Exposed schemas (Settings -> API) so PostgREST can serve it.
-- * The service role key is server-only and bypasses every policy above — use it
--   exclusively in webhook/worker/API route code (never shipped to the browser).
-- * To make the first admin, insert your auth user id:
--     insert into creator.admins (user_id) values ('<your-auth-user-uuid>');
-- =============================================================================
