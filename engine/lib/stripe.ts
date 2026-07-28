// Stripe SDK factory. Server-only. Money is always integer cents.
// Multi-account ready: pass a connected/product account id to stripeFor().

import Stripe from 'stripe';

const APP_INFO = { name: 'Vandy Creator Engine' } as const;

let _platform: Stripe | null = null;

/** The platform Stripe account (default, e.g. NOWWWA). */
export function getStripe(): Stripe {
  if (!_platform) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _platform = new Stripe(key, { appInfo: APP_INFO });
  }
  return _platform;
}

/** A Stripe client scoped to a specific connected/product account (Connect, multi-account). */
export function stripeFor(stripeAccount: string): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key, { appInfo: APP_INFO, stripeAccount });
}

export function stripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  return secret;
}
