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

/**
 * Flip earnings whose hold window has passed from `pending` to `available`.
 * Anything belonging to a clip that got rejected, or a clipper who got banned,
 * is deliberately left behind. Returns how many rows were released.
 */
export async function releaseAvailableEarnings(): Promise<number> {
  const db = supabaseAdmin();
  const now = new Date().toISOString();

  const { data: due, error } = await db
    .from('earnings')
    .select('id, clipper_id, clip_id')
    .eq('status', 'pending')
    .lte('available_at', now);
  if (error) throw error;
  if (!due || due.length === 0) return 0;

  // Exclude anything whose clip was rejected after the fact.
  const clipIds = [...new Set(due.map((e) => e.clip_id).filter(Boolean))] as string[];
  const blocked = new Set<string>();
  if (clipIds.length) {
    const { data: bad } = await db
      .from('clips')
      .select('id')
      .in('id', clipIds)
      .in('status', ['rejected']);
    (bad ?? []).forEach((c) => blocked.add(c.id as string));
  }

  // Exclude banned clippers.
  const clipperIds = [...new Set(due.map((e) => e.clipper_id))];
  const bannedClippers = new Set<string>();
  if (clipperIds.length) {
    const { data: banned } = await db
      .from('clippers')
      .select('id')
      .in('id', clipperIds)
      .eq('status', 'banned');
    (banned ?? []).forEach((c) => bannedClippers.add(c.id as string));
  }

  const releasable = due
    .filter((e) => !(e.clip_id && blocked.has(e.clip_id as string)))
    .filter((e) => !bannedClippers.has(e.clipper_id as string))
    .map((e) => e.id as string);
  if (releasable.length === 0) return 0;

  const { error: upErr } = await db
    .from('earnings')
    .update({ status: 'available' })
    .in('id', releasable);
  if (upErr) throw upErr;

  // Keep the cached wallet balances honest.
  const touched = [...new Set(
    due.filter((e) => releasable.includes(e.id as string)).map((e) => e.clipper_id as string),
  )];
  await Promise.all(touched.map((id) => recomputeWallet(id)));

  return releasable.length;
}

/**
 * Recompute a clipper's withdrawable balance from the ledger and cache it on
 * the clipper row. Available (unpaid) rows only — clawbacks net out because
 * they are stored as negative amounts.
 */
export async function recomputeWallet(clipperId: string): Promise<number> {
  const db = supabaseAdmin();

  const { data, error } = await db
    .from('earnings')
    .select('amount_cents')
    .eq('clipper_id', clipperId)
    .eq('status', 'available');
  if (error) throw error;

  const balance = (data ?? []).reduce((s, r) => s + (r.amount_cents as number), 0);
  const clamped = Math.max(0, balance);

  await db.from('clippers').update({ wallet_cents: clamped }).eq('id', clipperId);
  return clamped;
}

/**
 * Reverse everything credited for an invoice by appending negative `clawback`
 * rows and marking the originals reversed. Amounts are never edited in place,
 * so the ledger stays auditable.
 */
export async function reverseEarningsForInvoice(invoiceId: string): Promise<void> {
  const db = supabaseAdmin();

  const { data: rows, error } = await db
    .from('earnings')
    .select('id, clipper_id, amount_cents, currency, subscription_id, stripe_account_id')
    .eq('invoice_id', invoiceId)
    .neq('status', 'reversed');
  if (error) throw error;
  if (!rows || rows.length === 0) return;

  for (const r of rows) {
    if ((r.amount_cents as number) <= 0) continue; // don't reverse a reversal
    await db.from('earnings').insert({
      clipper_id: r.clipper_id,
      type: 'clawback',
      amount_cents: -(r.amount_cents as number),
      currency: r.currency,
      status: 'available', // nets against the balance straight away
      invoice_id: invoiceId,
      subscription_id: r.subscription_id,
      stripe_account_id: r.stripe_account_id,
      available_at: new Date().toISOString(),
      meta: { reverses_earning_id: r.id },
    });
  }

  await db
    .from('earnings')
    .update({ status: 'reversed' })
    .in('id', rows.map((r) => r.id as string));

  await Promise.all(
    [...new Set(rows.map((r) => r.clipper_id as string))].map((id) => recomputeWallet(id)),
  );
}

/** Same reversal, for a clip whose views were rejected after being credited. */
export async function reverseEarningsForClip(clipId: string): Promise<void> {
  const db = supabaseAdmin();

  const { data: rows } = await db
    .from('earnings')
    .select('id, clipper_id, amount_cents, currency, campaign_id')
    .eq('clip_id', clipId)
    .neq('status', 'reversed');
  if (!rows || rows.length === 0) return;

  for (const r of rows) {
    if ((r.amount_cents as number) <= 0) continue;
    await db.from('earnings').insert({
      clipper_id: r.clipper_id,
      type: 'clawback',
      amount_cents: -(r.amount_cents as number),
      currency: r.currency,
      status: 'available',
      clip_id: clipId,
      campaign_id: r.campaign_id,
      available_at: new Date().toISOString(),
      meta: { reverses_earning_id: r.id, reason: 'clip rejected' },
    });
  }

  await db
    .from('earnings')
    .update({ status: 'reversed' })
    .in('id', rows.map((r) => r.id as string));

  await Promise.all(
    [...new Set(rows.map((r) => r.clipper_id as string))].map((id) => recomputeWallet(id)),
  );
}
