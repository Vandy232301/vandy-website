// Referral (pay-per-conversion) configuration. Tune these to reality.
// All money is USD dollars here; convert to integer cents at use-sites.

export type Tier = 'rookie' | 'pro' | 'elite';

export interface ProductRule {
  /** Set false to disable recurring revshare for this product. */
  revShare?: boolean;
  /** One-time purchase: pay CPA only, never revshare. */
  cpaOnly?: boolean;
  /** Override the tier-based revshare rate (0..1) for this product. */
  revShareRateOverride?: number;
  /** Exclude entirely — no bounty of any kind (e.g. high-ticket agency plans). */
  excluded?: boolean;
}

export const REFERRAL_CONFIG = {
  discountPercent: 20, // customer discount the clipper's promo code applies
  cpaBountyUSD: 25, // one-time, on first paid invoice
  sparkBountyUSD: 2, // optional, on verified trial start (0 to disable)
  sparkEnabled: true,
  revShare: { rookie: 0.2, pro: 0.25, elite: 0.3 } as Record<Tier, number>,
  tierThresholds: { pro: 25, elite: 100 }, // active referred subs to reach tier
  holdDays: 14, // refund window before earnings become payable
  payoutMinUSD: 50, // minimum wallet balance to withdraw
  revShareMonthsCap: null as number | null, // null = lifetime; or e.g. 12

  // Per-product overrides keyed by product slug. Confirm against real Stripe products.
  productRules: {
    // 'nowwwa-build':  { excluded: true },              // €4000/2wk high-ticket
    // 'nowwwa-credit': { revShare: false, cpaOnly: true } // one-time credit packs
  } as Record<string, ProductRule>,
};

export const usdToCents = (usd: number) => Math.round(usd * 100);

export function revShareRate(tier: Tier, product?: string): number {
  const rule = product ? REFERRAL_CONFIG.productRules[product] : undefined;
  if (rule?.excluded || rule?.revShare === false) return 0;
  return rule?.revShareRateOverride ?? REFERRAL_CONFIG.revShare[tier];
}
