// The clipping payout engine.
//
// Rules, in the order they apply to a clip:
//   1. Only views inside the clip's counting window count at all.
//   2. Below the campaign's minimum, the clip earns nothing.
//   3. Above it, every 1,000 payable views is worth the campaign's CPM.
//   4. Milestone bonuses stack on top.
//   5. Nothing may push a campaign past its budget.
//
// Earnings are written to an append-only ledger, so this never edits an amount.
// It works out what the clip *should* have earned by now, compares that with
// what has already been credited, and writes only the difference. Running the
// worker twice therefore pays nothing extra.

import { supabaseAdmin } from '@/lib/supabase';
import { CLIPPING_CONFIG, viewsToCents, bonusForViews, type BonusTier } from '@/config/clipping';
import { addEarning } from '@/lib/earnings';

export interface CampaignRules {
  id: string;
  cpm_cents: number;
  min_views: number;
  window_days: number;
  bonus_tiers: BonusTier[] | null;
  budget_cents: number;
  spent_cents: number;
  currency: string;
}

/** Campaign settings, falling back to the global defaults where unset. */
export function rulesFor(campaign: Partial<CampaignRules> | null): {
  cpmCents: number;
  minViews: number;
  windowDays: number;
  bonusTiers: BonusTier[];
} {
  return {
    cpmCents: campaign?.cpm_cents ?? CLIPPING_CONFIG.defaultCpmCents,
    minViews: campaign?.min_views ?? CLIPPING_CONFIG.minPayableViews,
    windowDays: campaign?.window_days ?? CLIPPING_CONFIG.countingWindowDays,
    bonusTiers:
      campaign?.bonus_tiers && campaign.bonus_tiers.length
        ? campaign.bonus_tiers
        : CLIPPING_CONFIG.bonusTiers,
  };
}

export function windowClosesAt(firstSeenAt: string | Date, windowDays: number): Date {
  const start = new Date(firstSeenAt);
  const end = new Date(start);
  end.setDate(end.getDate() + windowDays);
  return end;
}

export function isWindowOpen(firstSeenAt: string | Date | null, windowDays: number, now = new Date()) {
  if (!firstSeenAt) return true; // not yet anchored; the first poll sets it
  return now < windowClosesAt(firstSeenAt, windowDays);
}

/**
 * Views that count toward pay: what the clip has gained since we started
 * watching it, which is the current count minus the count at the first
 * snapshot. A clip that was already at 40k when submitted does not get paid
 * for those 40k.
 */
export function payableViews(currentViews: number, baselineViews: number): number {
  return Math.max(0, currentViews - baselineViews);
}

export interface ClipPayout {
  payable: number;
  qualifies: boolean;
  baseCents: number;
  bonusCents: number;
  grossCents: number;
  /** How far the clip is toward qualifying, 0..1 — drives the UI meter. */
  progressToMin: number;
}

/** What a clip is worth right now, before the campaign budget is considered. */
export function computeClipPayout(
  currentViews: number,
  baselineViews: number,
  rules: { cpmCents: number; minViews: number; bonusTiers: BonusTier[] },
): ClipPayout {
  const payable = payableViews(currentViews, baselineViews);
  const qualifies = payable >= rules.minViews;

  if (!qualifies) {
    return {
      payable,
      qualifies: false,
      baseCents: 0,
      bonusCents: 0,
      grossCents: 0,
      progressToMin: rules.minViews > 0 ? Math.min(1, payable / rules.minViews) : 1,
    };
  }

  const baseCents = viewsToCents(payable, rules.cpmCents);
  const bonusCents = bonusForViews(payable, rules.bonusTiers);
  let grossCents = baseCents + bonusCents;

  if (CLIPPING_CONFIG.perClipCapCents != null) {
    grossCents = Math.min(grossCents, CLIPPING_CONFIG.perClipCapCents);
  }

  return { payable, qualifies: true, baseCents, bonusCents, grossCents, progressToMin: 1 };
}

/** The next milestone a clip is chasing — shown to keep creators pushing. */
export function nextBonus(payable: number, tiers: BonusTier[] = CLIPPING_CONFIG.bonusTiers) {
  const upcoming = [...tiers].sort((a, b) => a.views - b.views).find((t) => payable < t.views);
  if (!upcoming) return null;
  return { ...upcoming, viewsAway: upcoming.views - payable };
}

/**
 * A sudden implausible jump usually means bought views. We do not block the
 * clip automatically — we raise it for review and let the hold window do its
 * job, because a genuinely viral clip looks similar for a few hours.
 */
export function looksLikeViewSpike(
  prevViews: number,
  nextViews: number,
  hoursBetween: number,
): { spike: boolean; perHour: number } {
  const gained = nextViews - prevViews;
  const hours = Math.max(hoursBetween, 0.25);
  const perHour = gained / hours;
  // 250k views/hour sustained from a standing start is the threshold for a look.
  const spike = gained > 50_000 && perHour > 250_000 && prevViews < gained * 0.2;
  return { spike, perHour };
}

/**
 * Bring a clip's ledger up to date. Idempotent: writes only the delta between
 * what the clip has earned and what it has already been credited.
 *
 * Returns the amount newly credited, in cents (0 when nothing changed).
 */
export async function reconcileClipEarnings(clipId: string): Promise<number> {
  const db = supabaseAdmin();

  const { data: clip, error: clipErr } = await db
    .from('clips')
    .select('id, clipper_id, campaign_id, current_views, first_seen_at, status')
    .eq('id', clipId)
    .single();
  if (clipErr || !clip) throw clipErr ?? new Error('clip not found');

  // Only clips actively being tracked or already approved can accrue.
  if (!['tracking', 'approved'].includes(clip.status)) return 0;

  const { data: campaign } = clip.campaign_id
    ? await db
        .from('campaigns')
        .select('id, cpm_cents, min_views, window_days, bonus_tiers, budget_cents, spent_cents, currency, status')
        .eq('id', clip.campaign_id)
        .single()
    : { data: null };

  // A paused or ended campaign stops accruing immediately.
  if (campaign && !['active', 'draft'].includes(campaign.status)) return 0;

  const rules = rulesFor(campaign as CampaignRules | null);

  // Baseline = the view count when we first saw the clip.
  // Ordered by the sequential id, not captured_at: two snapshots can share a
  // timestamp (same transaction, or a fast retry), and picking the wrong one
  // as the baseline would mis-pay the creator.
  const { data: firstSnap } = await db
    .from('clip_view_snapshots')
    .select('views')
    .eq('clip_id', clipId)
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle();
  const baseline = firstSnap?.views ?? 0;

  const payout = computeClipPayout(clip.current_views ?? 0, baseline, rules);

  // Already-credited total for this clip (clawbacks are negative, so they net out).
  const { data: prior } = await db
    .from('earnings')
    .select('amount_cents')
    .eq('clip_id', clipId)
    .neq('status', 'reversed');
  const credited = (prior ?? []).reduce((s, r) => s + (r.amount_cents as number), 0);

  let delta = payout.grossCents - credited;
  if (delta <= 0) return 0;

  // Never spend past the campaign budget.
  if (campaign) {
    const remaining = Math.max(0, campaign.budget_cents - campaign.spent_cents);
    delta = Math.min(delta, remaining);
    if (delta <= 0) return 0;
  }

  await addEarning({
    clipperId: clip.clipper_id,
    type: 'clip',
    amountCents: delta,
    currency: campaign?.currency ?? 'usd',
    holdDays: CLIPPING_CONFIG.holdDays,
    clipId: clip.id,
    campaignId: clip.campaign_id ?? undefined,
    meta: {
      payable_views: payout.payable,
      base_cents: payout.baseCents,
      bonus_cents: payout.bonusCents,
      cpm_cents: rules.cpmCents,
      credited_before: credited,
    },
  });

  await db
    .from('clips')
    .update({ payable_views: payout.payable })
    .eq('id', clipId);

  if (campaign) {
    await db
      .from('campaigns')
      .update({ spent_cents: campaign.spent_cents + delta })
      .eq('id', campaign.id);
  }

  return delta;
}
