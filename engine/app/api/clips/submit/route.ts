// A creator submits a posted clip.
//
// For an auto-tracked platform we verify on the spot that the video really
// belongs to their connected account and take the opening view count as the
// baseline, so pre-existing views are never paid for. For platforms still
// waiting on API approval the clip is accepted as `pending` and lands in the
// admin's manual queue instead.

import { NextResponse } from 'next/server';
import { requireUser, getMyClipper } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { parseClipUrl, PLATFORMS } from '@/lib/platforms';
import { ensureFreshAccessToken, fetchYoutubeVideoStats, packTokens } from '@/lib/platforms/youtube';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await requireUser();
  const clipper = await getMyClipper(user.id);
  if (!clipper) return NextResponse.json({ error: 'No clipper profile.' }, { status: 403 });
  if (clipper.status !== 'approved') {
    return NextResponse.json({ error: 'Your account is not approved yet.' }, { status: 403 });
  }

  let body: { url?: string; campaignId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a JSON body.' }, { status: 400 });
  }

  const parsed = body.url ? parseClipUrl(body.url) : null;
  if (!parsed) {
    return NextResponse.json(
      { error: "That link isn't a TikTok, YouTube, Instagram or X post." },
      { status: 400 },
    );
  }

  const db = supabaseAdmin();

  // The same post can only be claimed once, by anyone.
  const { data: existing } = await db
    .from('clips')
    .select('id, clipper_id')
    .eq('platform', parsed.platform)
    .eq('url', parsed.canonicalUrl)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      {
        error:
          existing.clipper_id === clipper.id
            ? 'You already submitted this clip.'
            : 'That clip has already been submitted by someone else.',
      },
      { status: 409 },
    );
  }

  // Campaign must be open, if one was chosen.
  let campaignId: string | null = null;
  if (body.campaignId) {
    const { data: c } = await db
      .from('campaigns')
      .select('id, status, platforms')
      .eq('id', body.campaignId)
      .maybeSingle();
    if (!c) return NextResponse.json({ error: 'That campaign no longer exists.' }, { status: 400 });
    if (c.status !== 'active') {
      return NextResponse.json({ error: 'That campaign is not accepting clips.' }, { status: 400 });
    }
    if (Array.isArray(c.platforms) && !c.platforms.includes(parsed.platform)) {
      return NextResponse.json(
        { error: `This campaign doesn't run on ${PLATFORMS[parsed.platform].label}.` },
        { status: 400 },
      );
    }
    campaignId = c.id;
  }

  const capability = PLATFORMS[parsed.platform];
  const now = new Date().toISOString();

  // --- auto-tracked path: prove ownership and set the baseline now ---
  if (capability.autoTracked && parsed.platform === 'youtube') {
    const { data: conn } = await db
      .from('social_connections')
      .select('id, external_account_id, access_token, refresh_token, token_expires_at')
      .eq('clipper_id', clipper.id)
      .eq('platform', 'youtube')
      .maybeSingle();
    if (!conn) {
      return NextResponse.json(
        { error: 'Connect your YouTube account first so we can read the view count.' },
        { status: 400 },
      );
    }
    if (!parsed.externalVideoId) {
      return NextResponse.json({ error: 'Could not read the video id from that link.' }, { status: 400 });
    }

    try {
      const { accessToken, refreshed } = await ensureFreshAccessToken(conn);
      if (refreshed) {
        await db.from('social_connections').update(packTokens(refreshed)).eq('id', conn.id);
      }

      const [stats] = await fetchYoutubeVideoStats(accessToken, [parsed.externalVideoId]);
      if (!stats) {
        return NextResponse.json({ error: 'YouTube has no public data for that video.' }, { status: 400 });
      }
      if (stats.channelId !== conn.external_account_id) {
        return NextResponse.json(
          { error: 'That video is not on your connected channel.' },
          { status: 403 },
        );
      }

      const { data: clip, error: insErr } = await db
        .from('clips')
        .insert({
          clipper_id: clipper.id,
          campaign_id: campaignId,
          platform: 'youtube',
          url: parsed.canonicalUrl,
          external_video_id: parsed.externalVideoId,
          status: 'tracking',
          current_views: stats.views,
          first_seen_at: now,
          last_polled_at: now,
        })
        .select('id')
        .single();
      if (insErr) throw insErr;

      // Baseline snapshot: views already on the clock are not paid for.
      await db.from('clip_view_snapshots').insert({
        clip_id: clip.id,
        views: stats.views,
        source: 'api',
        captured_at: now,
      });

      return NextResponse.json({
        ok: true,
        clipId: clip.id,
        status: 'tracking',
        baselineViews: stats.views,
        message: 'Tracking started. Views from here on count toward your payout.',
      });
    } catch (e) {
      console.error('youtube submit failed', e);
      return NextResponse.json(
        { error: 'Could not verify that clip with YouTube. Try reconnecting your account.' },
        { status: 502 },
      );
    }
  }

  // --- manual path: platform API not available yet ---
  const { data: clip, error: insErr } = await db
    .from('clips')
    .insert({
      clipper_id: clipper.id,
      campaign_id: campaignId,
      platform: parsed.platform,
      url: parsed.canonicalUrl,
      external_video_id: parsed.externalVideoId,
      status: 'pending',
      current_views: 0,
      submitted_at: now,
    })
    .select('id')
    .single();
  if (insErr) {
    console.error(insErr);
    return NextResponse.json({ error: 'Could not save that clip.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    clipId: clip.id,
    status: 'pending',
    message: `${capability.label} counts are confirmed by hand for now — this clip is queued for review.`,
  });
}
