// Clipping (pay-per-views) configuration. Campaigns override these per-brand.

export interface BonusTier {
  views: number;
  bonusCents: number;
}

export const CLIPPING_CONFIG = {
  defaultCpmCents: 100, // $1.00 per 1000 payable views
  minPayableViews: 10_000, // a clip must reach this to qualify for any payout
  countingWindowDays: 60, // views counted for N days after the clip is first seen
  bonusTiers: [
    { views: 100_000, bonusCents: 2_500 }, // +$25 at 100k
    { views: 500_000, bonusCents: 15_000 }, // +$150 at 500k
    { views: 1_000_000, bonusCents: 40_000 }, // +$400 at 1M
  ] as BonusTier[],
  // Optional absolute ceiling per clip. Left off by default because a flat cap
  // punishes genuine hits as hard as it punishes fraud.
  perClipCapCents: null as number | null,

  // The real guard: no single clip may take more than this share of a
  // campaign's budget. It scales with the campaign, so a real breakout on a
  // large budget still gets paid properly, while one actor can never drain the
  // whole pot in a single submission.
  maxClipShareOfBudget: 0.25,
  holdDays: 14, // hold before clip earnings become payable
  pollIntervalHours: 6, // how often the worker refreshes view counts
  platforms: ['tiktok', 'instagram', 'youtube', 'x'] as const,
};

export type Platform = (typeof CLIPPING_CONFIG.platforms)[number];

/** Convert payable views to cents given a CPM (cents per 1000 views). */
export const viewsToCents = (views: number, cpmCents: number) =>
  Math.floor((views / 1000) * cpmCents);

/** Cumulative bonus earned at a given view count (highest tier reached). */
export function bonusForViews(views: number, tiers: BonusTier[] = CLIPPING_CONFIG.bonusTiers): number {
  return tiers
    .filter((t) => views >= t.views)
    .reduce((sum, t) => sum + t.bonusCents, 0);
}
