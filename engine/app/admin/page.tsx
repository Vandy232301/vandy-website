import { requireAdmin } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase';
import { money, views, viewsShort, whenShort } from '@/lib/format';
import { PLATFORMS } from '@/lib/platforms';
import { REFERRAL_CONFIG } from '@/config/referral';
import { ConfirmViews, ClipperDecision, ResolveFlag, RunTracker } from './ReviewActions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createServerSupabase();

  const [
    { data: campaigns },
    { data: pendingClips },
    { data: flags },
    { data: pendingClippers },
    { data: earnings },
    { data: topClippers },
  ] = await Promise.all([
    supabase.from('campaigns').select('id,name,brand,budget_cents,spent_cents,cpm_cents,status,currency').order('created_at', { ascending: false }),
    supabase.from('clips').select('id,platform,url,current_views,clipper_id,campaign_id,submitted_at').eq('status', 'pending').order('submitted_at', { ascending: true }).limit(25),
    supabase.from('fraud_flags').select('id,clip_id,clipper_id,kind,score,detail,created_at').eq('resolved', false).order('created_at', { ascending: false }).limit(25),
    supabase.from('clippers').select('id,name,email,created_at').eq('status', 'pending').order('created_at', { ascending: true }).limit(25),
    supabase.from('earnings').select('amount_cents,status'),
    supabase.from('clippers').select('id,name,code,wallet_cents,status').eq('status', 'approved').order('wallet_cents', { ascending: false }).limit(8),
  ]);

  const all = earnings ?? [];
  const owed = all.filter((e) => e.status === 'available').reduce((s, e) => s + e.amount_cents, 0);
  const held = all.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount_cents, 0);
  const paid = all.filter((e) => e.status === 'paid').reduce((s, e) => s + e.amount_cents, 0);

  const cs = campaigns ?? [];
  const budget = cs.reduce((s, c) => s + c.budget_cents, 0);
  const spent = cs.reduce((s, c) => s + c.spent_cents, 0);

  const queueCount = (pendingClips?.length ?? 0) + (flags?.length ?? 0) + (pendingClippers?.length ?? 0);
  const payable = (topClippers ?? []).filter((c) => c.wallet_cents >= REFERRAL_CONFIG.payoutMinUSD * 100);

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="text-xs text-neutral-500">Clipping campaigns, review queue and payouts</p>
          </div>
          <RunTracker />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Owed to creators" value={money(owed)} accent foot={`${payable.length} over the ${money(REFERRAL_CONFIG.payoutMinUSD * 100)} minimum`} />
          <Kpi label="On hold" value={money(held)} foot="Inside the refund window" />
          <Kpi label="Budget committed" value={money(spent)} foot={`of ${money(budget)} across ${cs.length} campaigns`} />
          <Kpi label="Needs your review" value={String(queueCount)} foot={`${pendingClips?.length ?? 0} counts · ${flags?.length ?? 0} flagged`} />
        </div>

        <Panel title="Waiting on you" note="nothing pays out until this clears">
          {queueCount === 0 ? (
            <p className="p-5 text-sm text-neutral-500">Queue is empty.</p>
          ) : (
            <div className="flex flex-col">
              {(flags ?? []).map((f) => (
                <Row key={f.id}>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">
                      <span className="mr-2 rounded border border-rose-900 bg-rose-950/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-rose-400">
                        {String(f.kind).replace('_', ' ')}
                      </span>
                      Clip flagged automatically
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500">
                      {f.kind === 'view_spike'
                        ? `${views(Number((f.detail as Record<string, unknown>)?.from ?? 0))} → ${views(Number((f.detail as Record<string, unknown>)?.to ?? 0))} in ${String((f.detail as Record<string, unknown>)?.hours ?? '?')}h`
                        : JSON.stringify(f.detail).slice(0, 120)}
                    </div>
                  </div>
                  <ResolveFlag flagId={f.id} clipId={f.clip_id} />
                </Row>
              ))}

              {(pendingClips ?? []).map((c) => (
                <Row key={c.id}>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {PLATFORMS[c.platform as keyof typeof PLATFORMS]?.label ?? c.platform} clip
                      </a>
                    </div>
                    <div className="mt-1 text-[11px] text-neutral-500">
                      Manual count — {PLATFORMS[c.platform as keyof typeof PLATFORMS]?.note ?? 'API not available'} · submitted {whenShort(c.submitted_at)}
                    </div>
                  </div>
                  <ConfirmViews clipId={c.id} current={c.current_views ?? 0} />
                </Row>
              ))}

              {(pendingClippers ?? []).map((p) => (
                <Row key={p.id}>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{p.name} — new creator application</div>
                    <div className="mt-1 text-[11px] text-neutral-500">{p.email} · applied {whenShort(p.created_at)}</div>
                  </div>
                  <ClipperDecision clipperId={p.id} />
                </Row>
              ))}
            </div>
          )}
        </Panel>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Panel title="Campaign spend" note="a campaign stops paying at its cap">
            {cs.length === 0 ? (
              <p className="p-5 text-sm text-neutral-500">
                No campaigns yet. Insert one in <code className="text-neutral-400">creator.campaigns</code> to start.
              </p>
            ) : (
              <div className="flex flex-col gap-2 p-3">
                {cs.map((c) => {
                  const pct = c.budget_cents ? Math.round((c.spent_cents / c.budget_cents) * 100) : 0;
                  return (
                    <div key={c.id} className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{c.name}</span>
                        <span className="tabular-nums text-xs text-amber-300">
                          {money(c.spent_cents)} / {money(c.budget_cents)}
                        </span>
                      </div>
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-800">
                        <div className={`h-full rounded-full ${pct >= 90 ? 'bg-rose-400' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-wide text-neutral-500">
                        <span>{money(c.cpm_cents)} / 1k</span>
                        <span>{c.status}</span>
                        <span>{pct}% spent</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel title="Top creators" note="by balance owed">
            {(topClippers ?? []).length === 0 ? (
              <p className="p-5 text-sm text-neutral-500">No approved creators yet.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wider text-neutral-500">
                        <th className="px-4 py-2 font-medium">Creator</th>
                        <th className="px-4 py-2 font-medium">Code</th>
                        <th className="px-4 py-2 text-right font-medium">Owed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(topClippers ?? []).map((c) => (
                        <tr key={c.id} className="border-t border-neutral-900">
                          <td className="px-4 py-2.5">{c.name}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-neutral-500">{c.code ?? '—'}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-amber-300">{money(c.wallet_cents)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-900 px-4 py-3">
                  <span className="font-mono text-[11px] text-neutral-500">
                    {payable.length} over minimum · {money(payable.reduce((s, c) => s + c.wallet_cents, 0))}
                  </span>
                  <span className="text-[11px] text-neutral-600">Payouts land in Phase 4</span>
                </div>
              </>
            )}
          </Panel>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-neutral-600">
          Paid {money(paid)} to date. YouTube counts refresh automatically; {Object.values(PLATFORMS).filter((p) => !p.autoTracked).map((p) => p.label).join(', ')} are confirmed by hand above until their API access is approved.
        </p>
      </div>
    </main>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 border-b border-neutral-900 px-4 py-3 last:border-b-0">{children}</div>;
}

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-900/40">
      <div className="flex items-baseline justify-between gap-3 border-b border-neutral-900 px-4 py-3">
        <h2 className="text-[13px] font-bold">{title}</h2>
        {note && <span className="text-[10px] uppercase tracking-wide text-neutral-600">{note}</span>}
      </div>
      {children}
    </section>
  );
}

function Kpi({ label, value, foot, accent }: { label: string; value: string; foot?: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="text-[10px] uppercase tracking-wider text-neutral-500">{label}</div>
      <div className={`mt-1.5 text-2xl font-semibold tabular-nums ${accent ? 'text-amber-300' : ''}`}>{value}</div>
      {foot && <div className="mt-1 text-[11px] text-neutral-500">{foot}</div>}
    </div>
  );
}
