# Vandy Creator Engine

Performance-based engine for creators ("clippers") that powers **two subsystems** on top of
Vandy's brands and products:

1. **Clipping (pay-per-views)** — a content library (external links) + clip submission +
   view tracking via connected social accounts (YouTube/TikTok/Instagram/X), paid **per 1000
   views** gated by **targets** with **performance bonuses** at higher thresholds.
2. **Referral (pay-per-conversion)** — a universal promo-code / link template across all
   products; the clipper earns **CPA + revenue share** when a referred user becomes a paying
   subscriber (driven by Stripe billing webhooks).

Both feed one append-only earnings ledger → one wallet → **Stripe Connect** payouts.

Standalone Next.js app (App Router) in `vandy_website/engine`. It reuses the existing Supabase
project and **does not touch** the `vandy.ro` marketing site.

> **Next.js 16 note:** this scaffold pins Next 16, which has breaking changes vs older docs.
> See `AGENTS.md` — check `node_modules/next/dist/docs/` before writing framework code.

## Stack
Next.js 16 · React 19 · TypeScript · Tailwind 4 · Supabase (Postgres + Auth + RLS) · Stripe.
Money is always **integer cents**. The webhook is **idempotent**. The `earnings` table is
**append-only** (reverse with clawback rows, never mutate amounts).

## Setup

1. **Install**
   ```bash
   cd engine && npm install
   ```
2. **Database** — open Supabase → SQL Editor → run `db/schema.sql`.
   Then **expose the schema**: Settings → API → Exposed schemas → add `creator`.
   Create the first admin:
   ```sql
   insert into creator.admins (user_id) values ('<your-auth-user-uuid>');
   ```
3. **Environment** — `cp .env.example .env.local` and fill values (see below).
4. **Run**
   ```bash
   npm run dev   # http://localhost:3000
   ```

## Environment variables
See `.env.example`. Key ones:
- `SUPABASE_SERVICE_KEY` — server-only; bypasses RLS. Used by webhooks/workers.
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — **test mode** until all scenarios pass.
- `TOKEN_ENCRYPTION_KEY` — encrypts OAuth tokens at rest (`openssl rand -base64 32`).
- Platform OAuth app credentials (YouTube/TikTok/Instagram/X) — needed for view tracking.

## Stripe webhook (registered in Phase 2)
One endpoint `POST /api/webhooks/stripe`, subscribed to:
`checkout.session.completed`, `customer.subscription.created|updated|deleted`,
`invoice.payment_succeeded`, `invoice.payment_failed`, `charge.refunded`.

Local testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded
stripe trigger charge.refunded
```

## Platform view-tracking apps (register early — approvals take time)
- **YouTube** — Google Cloud project + YouTube Data API v3 (fast).
- **TikTok** — TikTok for Developers app, Login Kit + Display API (`video.list`); app review required.
- **Instagram** — Meta app, Instagram Graph API (Business/Creator media insights); app review required.
- **X** — X API v2 (paid tier) for tweet `view_count`.
Until a platform is approved, its clips fall back to the **manual view-approval** queue.

## Structure (target)
```
app/(marketing)/clippers   recruiting landing
app/(auth)/clippers/*       apply, dashboard (portal)
app/(auth)/admin            admin dashboard
app/r/[slug]/route.ts       short-link redirect + ref cookie
app/api/webhooks/stripe     THE referral webhook (core)
app/api/clips/track         view-polling worker (cron)
app/api/oauth/*             social account connect callbacks
config/referral.ts          referral config + productRules
config/clipping.ts          clipping config (CPM, thresholds, bonuses)
lib/{supabase,stripe,attribution,earnings,crypto}.ts
db/schema.sql               Supabase schema + RLS
```

## Build status
- **Phase 0 (Foundation)** — scaffold, `db/schema.sql` + RLS, config + lib foundation, env + README. ← current
- Phase 1 — attribution + library + promo codes + OAuth connect (YouTube first).
- Phase 2 — clipping tracking core + Stripe webhook core (idempotent ledger, hold, clawback).
- Phase 3 — clipper portal. Phase 4 — admin + Connect payouts. Phase 5 — growth loops.
