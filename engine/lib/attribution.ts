// Referral attribution helpers.
// Resolution priority at webhook time: promotion code -> subscription metadata `ref` -> survey.

import { supabaseAdmin } from '@/lib/supabase';

/** Look up the Stripe promotion_code id for a clipper's link slug, in a given account. */
export async function promoCodeIdForSlug(
  slug: string,
  stripeAccountId: string,
): Promise<string | null> {
  const db = supabaseAdmin();
  const { data } = await db
    .from('clippers')
    .select('id, promo_codes:promo_codes(promotion_code_id, stripe_account_id)')
    .eq('link_slug', slug)
    .maybeSingle();
  const match = (data?.promo_codes as { promotion_code_id: string; stripe_account_id: string }[] | undefined)?.find(
    (p) => p.stripe_account_id === stripeAccountId,
  );
  return match?.promotion_code_id ?? null;
}

/** Resolve which clipper (if any) a Stripe event should be attributed to. */
export async function resolveClipperId(_params: {
  promotionCodeId?: string | null;
  refSlug?: string | null;
  stripeAccountId: string;
}): Promise<string | null> {
  // TODO(phase 2): promo code metadata.clipper_id > ref slug -> clipper > survey backstop.
  return null;
}
