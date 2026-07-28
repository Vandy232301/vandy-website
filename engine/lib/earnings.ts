// Earnings ledger helpers (append-only). Shared by clipping + referral.
// Amounts are integer cents. Never mutate an earning's amount — add reversing rows.

import { supabaseAdmin } from '@/lib/supabase';
import { REFERRAL_CONFIG } from '@/config/referral';

export type EarningType = 'clip' | 'spark' | 'cpa' | 'revshare' | 'clawback' | 'adjustment';

/** ISO timestamp for `now + days`. */
export function holdUntil(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export interface AddEarningInput {
  clipperId: string;
  type: EarningType;
  amountCents: number; // negative for clawback/adjustment
  currency?: string;
  holdDays?: number;
  status?: 'pending' | 'available';
  clipId?: string;
  campaignId?: string;
  subscriptionId?: string;
  invoiceId?: string;
  stripeAccountId?: string;
  meta?: Record<string, unknown>;
}

/** Insert a ledger row. `available_at = now + holdDays`. */
export async function addEarning(input: AddEarningInput) {
  const db = supabaseAdmin();
  const holdDays = input.holdDays ?? REFERRAL_CONFIG.holdDays;
  const { data, error } = await db
    .from('earnings')
    .insert({
      clipper_id: input.clipperId,
      type: input.type,
      amount_cents: input.amountCents,
      currency: input.currency ?? 'usd',
      status: input.status ?? 'pending',
      clip_id: input.clipId ?? null,
      campaign_id: input.campaignId ?? null,
      subscription_id: input.subscriptionId ?? null,
      invoice_id: input.invoiceId ?? null,
      stripe_account_id: input.stripeAccountId ?? null,
      available_at: holdUntil(holdDays),
      meta: input.meta ?? null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data;
}

// ---- Implemented in Phase 2 (webhook + payout core) ----
// Flip pending -> available where now >= available_at and parent not refunded.
export async function releaseAvailableEarnings(): Promise<number> {
  throw new Error('TODO(phase 2): releaseAvailableEarnings');
}
// Recompute + cache clippers.wallet_cents from available (unpaid) earnings.
export async function recomputeWallet(_clipperId: string): Promise<number> {
  throw new Error('TODO(phase 2): recomputeWallet');
}
// Add negative clawback rows for a refunded invoice/charge; mark originals reversed.
export async function reverseEarningsForInvoice(_invoiceId: string): Promise<void> {
  throw new Error('TODO(phase 2): reverseEarningsForInvoice');
}
