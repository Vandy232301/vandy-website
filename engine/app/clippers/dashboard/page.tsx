import Link from 'next/link';
import { requireUser, getMyClipper } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase';
import { money, views, viewsShort, whenShort, PLATFORM_COLOR } from '@/lib/format';
import { PLATFORMS } from '@/lib/platforms';
import { computeClipPayout, nextBonus, rulesFor } from '@/lib/clipping';
import { SubmitClip } from './SubmitClip';

export const dynamic = 'force-dynamic';

type Earning = { amount_cents: number; status: string; currency: string; type: string };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  const clipper = await getMyClipper(user.id);

  if (!clipper) {
    return (
      <Shell>
        <h1 className="mb-2 text-2xl font-bold">Welcome</h1>
        <p className="mb-6 text-sm text-neutral-400">
          You&apos;re signed in as {user.email}, but you don&apos;t have a creator profile yet.
        </p>
        <Link href="/clippers/apply" className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">
          Apply to become a clipper
        </Link>
      </Shell>
    );
  }

  const supabase = await createServerSupabase();

  const [{ data: earningRows }, { data: clipRows }, { data: campaignRows }, { data: connRows }] =
    await Promise.all([
      supabase.from('earnings').select('amount_cents,status,currency,type').eq('clipper_id', clipper.id),
      supabase
        .from('clips')
        .select('id,platform,url,campaign_id,current_views,payable_views,status,first_seen_at,rejected_reason')
        .eq('clipper_id', clipper.id)
        .order('submitted_at', { ascending: false }),
      supabase.from('campaigns').select('id,name,brand,cpm_cents,min_views,window_days,bonus_tiers,budget_cents,spent_cents,currency,status,platforms').eq('status', 'active'),
      supabase.from('social_connections').select('platform,handle,verified').eq('clipper_id', clipper.id),
    ]);

  const earnings = (earningRows ?? []) as Earning[];
  const available = earnings.filter((e) => e.status === 'available').reduce((s, e) => s + e.amount_cents, 0);
  const pending = earnings.filter((e) => e.status === 'pending').reduce((s, e) => s + e.amount_cents, 0);
  const lifetime = earnings.filter((e) => e.status !== 'reversed').reduce((s, e) => s + e.amount_cents, 0);

  const clips = clipRows ?? [];
  const campaigns = campaignRows ?? [];
  const campaignById = new Map(campaigns.map((c) => [c.id, c]));
  const connected = new Set((connRows ?? []).map((c) => c.platform));
  const totalPayable = clips.reduce((s, c) => s + (c.payable_views ?? 0), 0);

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{clipper.name}</h1>
          <p className="text-xs text-neutral-500">
            {clipper.status === 'approved' ? 'Approved creator' : `Status: ${clipper.status}`}
            {clipper.code ? ` · code ${clipper.code}` : ''}
          </p>
        </div>
        <span className="text-xs uppercase tracking-wide text-neutral-500">{clipper.tier}</span>
      </div>

      <Banner params={params} />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Ready to withdraw" value={money(available)} accent foot="Cleared the hold window" />
        <Kpi label="Still on hold" value={money(pending)} foot="Releases as clips age out" />
        <Kpi label="Earned all time" value={money(lifetime)} foot={`${clips.length} clips`} />
        <Kpi label="Views counted" value={views(totalPayable)} foot="Inside each clip's window" />
      </div>

      <Panel title="Submit a clip" note="paste the link after you post it">
        <div className="p-4">
          {clipper.status === 'approved' ? (
            <SubmitClip campaigns={campaigns.map((c) => ({ id: c.id, name: c.name, brand: c.brand, cpm_cents: c.cpm_cents }))} />
          ) : (
            <p className="text-sm text-neutral-400">Your account needs to be approved before you can submit clips.</p>
          )}
        </div>
      </Panel>

      <div className="h-4" />

      <Panel title="Your clips" note="paid per 1,000 views, once past the target">
        {clips.length === 0 ? (
          <p className="p-5 text-sm text-neutral-500">No clips yet. Post one and paste the link above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-neutral-500">
                  <th className="px-4 py-2 font-medium">Clip</th>
                  <th className="px-4 py-2 font-medium">Campaign</th>
                  <th className="px-4 py-2 text-right font-medium">Views</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 text-right font-medium">Earned</th>
                </tr>
              </thead>
              <tbody>
                {clips.map((clip) => {
                  const campaign = clip.campaign_id ? campaignById.get(clip.campaign_id) : null;
                  const rules = rulesFor(campaign ?? null);
                  const payable = clip.payable_views ?? 0;
                  const payout = computeClipPayout(payable, 0, rules);
                  const upcoming = nextBonus(payable, rules.bonusTiers);
                  return (
                    <tr key={clip.id} className="border-t border-neutral-900">
                      <td className="px-4 py-3">
                        <a href={clip.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                          <span className="h-2 w-2 rounded-sm" style={{ background: PLATFORM_COLOR[clip.platform] }} />
                          {PLATFORMS[clip.platform as keyof typeof PLATFORMS]?.label ?? clip.platform}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-neutral-400">{campaign?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {views(clip.current_views ?? 0)}
                        <Meter
                          pct={payout.qualifies ? 100 : Math.round(payout.progressToMin * 100)}
                          dim={!payout.qualifies}
                        />
                        <div className="mt-1 text-[10px] text-neutral-600">
                          {payout.qualifies
                            ? upcoming
                              ? `${views(upcoming.viewsAway)} to +${money(upcoming.bonusCents)}`
                              : 'all bonuses reached'
                            : `${views(Math.max(0, rules.minViews - payable))} short of payout`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Status clip={clip} />
                      </td>
                      <td className={`px-4 py-3 text-right tabular-nums font-semibold ${payout.grossCents ? 'text-amber-300' : 'text-neutral-600'}`}>
                        {money(payout.grossCents)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Open campaigns" note="what you can clip right now">
          {campaigns.length === 0 ? (
            <p className="p-5 text-sm text-neutral-500">No campaigns are running yet.</p>
          ) : (
            <div className="flex flex-col gap-2 p-3">
              {campaigns.map((c) => {
                const left = Math.max(0, c.budget_cents - c.spent_cents);
                return (
                  <div key={c.id} className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{c.name}</span>
                      <span className="tabular-nums text-xs text-amber-300">
                        {money(c.cpm_cents)} / 1k
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-wide text-neutral-500">
                      <span>{money(left)} budget left</span>
                      <span>min {viewsShort(c.min_views)} views</span>
                      <span>{c.window_days}-day window</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel title="Connected accounts" note="proves a clip is yours">
          <div className="flex flex-col gap-2 p-3">
            {Object.values(PLATFORMS).map((p) => {
              const on = connected.has(p.platform);
              return (
                <div key={p.platform} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: on ? '#3FBF7F' : '#3f3f46' }} />
                    <span className="text-sm">{p.label}</span>
                    {!p.autoTracked && (
                      <span className="rounded border border-neutral-800 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-neutral-500">
                        manual for now
                      </span>
                    )}
                  </div>
                  {p.platform === 'youtube' && !on ? (
                    <a href="/api/oauth/youtube/start" className="rounded-md bg-white px-3 py-1 text-xs font-semibold text-black">
                      Connect
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-500">{on ? 'connected' : 'coming soon'}</span>
                  )}
                </div>
              );
            })}
            <p className="px-1 pt-1 text-[11px] leading-relaxed text-neutral-500">
              View counts are read from your own account through each platform&apos;s API. Nothing is
              self-reported, so nobody can claim someone else&apos;s clip.
            </p>
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

function Banner({ params }: { params: Record<string, string | undefined> }) {
  const errors: Record<string, string> = {
    youtube_declined: 'YouTube access was declined.',
    youtube_bad_state: 'That connect link expired. Try again.',
    youtube_channel_taken: 'That YouTube channel is already linked to another creator.',
    youtube_no_channel: 'No YouTube channel found on that Google account.',
    youtube_missing_code: 'YouTube did not return an authorisation code.',
    youtube_failed: 'Could not finish connecting YouTube.',
  };
  if (params.connected) {
    return (
      <p className="mb-4 rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300">
        {params.connected === 'youtube' ? 'YouTube connected. You can submit clips from that channel now.' : 'Connected.'}
      </p>
    );
  }
  if (params.error && errors[params.error]) {
    return (
      <p className="mb-4 rounded-lg border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-xs text-rose-300">
        {errors[params.error]}
      </p>
    );
  }
  return null;
}

function Status({ clip }: { clip: { status: string; rejected_reason?: string | null } }) {
  const map: Record<string, { text: string; cls: string }> = {
    tracking: { text: 'Tracking', cls: 'border-emerald-800 bg-emerald-950/50 text-emerald-400' },
    pending: { text: 'Awaiting review', cls: 'border-amber-800 bg-amber-950/40 text-amber-400' },
    approved: { text: 'Approved', cls: 'border-emerald-800 bg-emerald-950/50 text-emerald-400' },
    closed: { text: 'Window closed', cls: 'border-neutral-800 text-neutral-500' },
    rejected: { text: 'Rejected', cls: 'border-rose-900 bg-rose-950/40 text-rose-400' },
  };
  const s = map[clip.status] ?? { text: clip.status, cls: 'border-neutral-800 text-neutral-500' };
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-[10px] uppercase tracking-wide ${s.cls}`} title={clip.rejected_reason ?? undefined}>
      {s.text}
    </span>
  );
}

function Meter({ pct, dim }: { pct: number; dim?: boolean }) {
  return (
    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-800">
      <div className={`h-full rounded-full ${dim ? 'bg-neutral-600' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-neutral-100 md:p-8">
      <div className="mx-auto max-w-5xl">{children}</div>
    </main>
  );
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
