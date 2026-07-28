import Link from 'next/link';
import { requireUser, getMyClipper } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const money = (cents: number, currency = 'usd') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(
    cents / 100,
  );

type Earning = { type: string; amount_cents: number; status: string; currency: string };

export default async function DashboardPage() {
  const user = await requireUser();
  const clipper = await getMyClipper(user.id);

  if (!clipper) {
    return (
      <Shell>
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-neutral-400 text-sm mb-6">
          You&apos;re signed in as {user.email}, but you don&apos;t have a clipper profile yet.
        </p>
        <Link
          href="/clippers/apply"
          className="inline-block rounded-lg bg-white text-black font-semibold px-4 py-2 text-sm"
        >
          Apply to become a clipper
        </Link>
      </Shell>
    );
  }

  const supabase = await createServerSupabase();
  const { data: earningsRows } = await supabase
    .from('earnings')
    .select('type,amount_cents,status,currency')
    .eq('clipper_id', clipper.id);

  const earnings = (earningsRows ?? []) as Earning[];
  const totalEarned = earnings.reduce((s, e) => s + e.amount_cents, 0);
  const available = earnings
    .filter((e) => e.status === 'available')
    .reduce((s, e) => s + e.amount_cents, 0);

  return (
    <Shell>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-bold">{clipper.name}</h1>
        <span className="text-xs uppercase tracking-wide text-neutral-500">{clipper.tier}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <Kpi label="Wallet" value={money(clipper.wallet_cents)} />
        <Kpi label="Available now" value={money(available)} />
        <Kpi label="Total earned" value={money(totalEarned)} />
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <div className="text-xs text-neutral-500 mb-2">Your referral code &amp; link</div>
        <div className="font-mono text-lg">{clipper.code ?? '—'}</div>
        <div className="text-sm text-neutral-400 mt-1">
          {process.env.SHORTLINK_DOMAIN}/{clipper.link_slug ?? '—'}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-3xl mx-auto">{children}</div>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-neutral-500 mt-1">{label}</div>
    </div>
  );
}
