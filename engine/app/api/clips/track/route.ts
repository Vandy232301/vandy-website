// The view-tracking worker. Runs on a schedule (Vercel cron) and can also be
// triggered by an admin.
//
// For every clip still inside its counting window it re-reads the view count
// from the platform's own API, stores a snapshot, flags implausible jumps, and
// brings the earnings ledger up to date. Everything it writes is idempotent, so
// running it twice in a row credits nothing extra.

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { ensureFreshAccessToken, fetchYoutubeVideoStats, packTokens } from '@/lib/platforms/youtube';
import {
  isWindowOpen,
  looksLikeViewSpike,
  reconcileClipEarnings,
  rulesFor,
  type CampaignRules,
} from '@/lib/clipping';
import { releaseAvailableEarnings } from '@/lib/earnings';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function authorised(request: Request): Promise<boolean> {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = request.headers.get('authorization');
    if (header === `Bearer ${secret}`) return true;
  }
  // Vercel signs its own cron invocations.
  if (request.headers.get('x-vercel-cron')) return true;
  return isAdmin();
}

export async function GET(request: Request) {
  return run(request);
}
export async function POST(request: Request) {
  return run(request);
}

async function run(request: Request) {
  if (!(await authorised(request))) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
  }

  const db = supabaseAdmin();
  const startedAt = Date.now();
  const report = {
    polled: 0,
    updated: 0,
    creditedCents: 0,
    closed: 0,
    flagged: 0,
    released: 0,
    errors: [] as string[],
  };

  // Only YouTube is auto-tracked today; the rest sit in the manual queue.
  const { data: clips, error } = await db
    .from('clips')
    .select('id, clipper_id, campaign_id, platform, external_video_id, current_views, first_seen_at, last_polled_at, status')
    .eq('platform', 'youtube')
    .eq('status', 'tracking')
    .not('external_video_id', 'is', null)
    .order('last_polled_at', { ascending: true, nullsFirst: true })
    .limit(200);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Group by creator so each connected account is used for its own clips.
  const byClipper = new Map<string, typeof clips>();
  for (const c of clips ?? []) {
    const list = byClipper.get(c.clipper_id) ?? [];
    list.push(c);
    byClipper.set(c.clipper_id, list);
  }

  // Campaign rules, fetched once.
  const campaignIds = [...new Set((clips ?? []).map((c) => c.campaign_id).filter(Boolean))] as string[];
  const campaigns = new Map<string, CampaignRules>();
  if (campaignIds.length) {
    const { data: cs } = await db
      .from('campaigns')
      .select('id, cpm_cents, min_views, window_days, bonus_tiers, budget_cents, spent_cents, currency')
      .in('id', campaignIds);
    (cs ?? []).forEach((c) => campaigns.set(c.id as string, c as CampaignRules));
  }

  for (const [clipperId, list] of byClipper) {
    const { data: conn } = await db
      .from('social_connections')
      .select('id, external_account_id, access_token, refresh_token, token_expires_at')
      .eq('clipper_id', clipperId)
      .eq('platform', 'youtube')
      .maybeSingle();
    if (!conn) {
      report.errors.push(`clipper ${clipperId}: YouTube account disconnected`);
      continue;
    }

    let accessToken: string;
    try {
      const fresh = await ensureFreshAccessToken(conn);
      accessToken = fresh.accessToken;
      if (fresh.refreshed) {
        await db.from('social_connections').update(packTokens(fresh.refreshed)).eq('id', conn.id);
      }
    } catch (e) {
      report.errors.push(`clipper ${clipperId}: ${(e as Error).message}`);
      continue;
    }

    const ids = list!.map((c) => c.external_video_id as string);
    let stats;
    try {
      stats = await fetchYoutubeVideoStats(accessToken, ids);
    } catch (e) {
      report.errors.push(`clipper ${clipperId}: ${(e as Error).message}`);
      continue;
    }
    const statsById = new Map(stats.map((s) => [s.videoId, s]));
    const now = new Date();

    for (const clip of list!) {
      report.polled++;
      const s = statsById.get(clip.external_video_id as string);

      // Gone from YouTube — deleted or made private. Stop tracking; earnings
      // already credited stay, the hold window is what protects us.
      if (!s) {
        await db
          .from('clips')
          .update({ status: 'closed', last_polled_at: now.toISOString(), rejected_reason: 'video unavailable' })
          .eq('id', clip.id);
        report.closed++;
        continue;
      }

      // Still their channel? Someone could have re-pointed the connection.
      if (s.channelId !== conn.external_account_id) {
        await db.from('fraud_flags').insert({
          clipper_id: clipperId,
          clip_id: clip.id,
          kind: 'ownership',
          score: 1,
          detail: { expected: conn.external_account_id, actual: s.channelId },
        });
        await db.from('clips').update({ status: 'rejected', rejected_reason: 'not on the connected channel' }).eq('id', clip.id);
        report.flagged++;
        continue;
      }

      const rules = rulesFor(clip.campaign_id ? campaigns.get(clip.campaign_id) ?? null : null);
      const prevViews = clip.current_views ?? 0;

      // Velocity check: compare this window against the clip's own past pace,
      // which is what catches drip-fed bought views.
      if (s.views > prevViews) {
        const hours = clip.last_polled_at
          ? (now.getTime() - new Date(clip.last_polled_at).getTime()) / 3_600_000
          : 6;

        const { data: history } = await db
          .from('clip_view_snapshots')
          .select('views, captured_at')
          .eq('clip_id', clip.id)
          .order('id', { ascending: false })
          .limit(4);

        let trailing: number | undefined;
        if (history && history.length >= 2) {
          const newest = history[0];
          const oldest = history[history.length - 1];
          trailing = ratePerHour(
            oldest.views as number,
            newest.views as number,
            oldest.captured_at as string,
            newest.captured_at as string,
          );
        }

        const { spike, perHour, reason } = looksLikeViewSpike(prevViews, s.views, hours, trailing);
        if (spike) {
          await db.from('fraud_flags').insert({
            clipper_id: clipperId,
            clip_id: clip.id,
            kind: 'view_spike',
            score: Math.round(perHour),
            detail: {
              from: prevViews,
              to: s.views,
              hours: Number(hours.toFixed(2)),
              per_hour: Math.round(perHour),
              trailing_per_hour: trailing != null ? Math.round(trailing) : null,
              reason,
            },
          });
          report.flagged++;
        }
      }

      await db.from('clip_view_snapshots').insert({
        clip_id: clip.id,
        views: s.views,
        source: 'api',
        captured_at: now.toISOString(),
      });

      const windowOpen = isWindowOpen(clip.first_seen_at, rules.windowDays, now);
      await db
        .from('clips')
        .update({
          current_views: s.views,
          last_polled_at: now.toISOString(),
          ...(windowOpen ? {} : { status: 'closed' }),
        })
        .eq('id', clip.id);
      if (!windowOpen) report.closed++;
      report.updated++;

      try {
        const credited = await reconcileClipEarnings(clip.id as string);
        report.creditedCents += credited;
      } catch (e) {
        report.errors.push(`clip ${clip.id}: ${(e as Error).message}`);
      }
    }
  }

  // Same pass releases anything whose hold window has elapsed.
  try {
    report.released = await releaseAvailableEarnings();
  } catch (e) {
    report.errors.push(`release: ${(e as Error).message}`);
  }

  return NextResponse.json({
    ok: true,
    ...report,
    creditedUSD: (report.creditedCents / 100).toFixed(2),
    tookMs: Date.now() - startedAt,
  });
}
