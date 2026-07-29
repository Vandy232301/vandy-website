// Where Google sends the creator back. Verifies the state, swaps the code for
// tokens, records which channel was connected, and stores the tokens encrypted.

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { requireUser, getMyClipper } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { exchangeYoutubeCode, fetchYoutubeChannel, packTokens } from '@/lib/platforms/youtube';

export const dynamic = 'force-dynamic';

function back(path: string, params: Record<string, string>) {
  const base = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:3333';
  const url = new URL(path, base);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const user = await requireUser();
  const clipper = await getMyClipper(user.id);
  if (!clipper) return back('/clippers/dashboard', { error: 'no_clipper_profile' });

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const denied = url.searchParams.get('error');

  if (denied) return back('/clippers/dashboard', { error: 'youtube_declined' });
  if (!code || !state) return back('/clippers/dashboard', { error: 'youtube_missing_code' });

  const jar = await cookies();
  const expected = jar.get('yt_oauth_state')?.value;
  jar.delete('yt_oauth_state');
  if (!expected || expected !== state) {
    return back('/clippers/dashboard', { error: 'youtube_bad_state' });
  }

  try {
    const tokens = await exchangeYoutubeCode(code);
    const channel = await fetchYoutubeChannel(tokens.accessToken);
    if (!channel) return back('/clippers/dashboard', { error: 'youtube_no_channel' });

    const db = supabaseAdmin();

    // A channel may only ever be attached to one creator, otherwise two people
    // could both claim the same clips.
    const { data: taken } = await db
      .from('social_connections')
      .select('id, clipper_id')
      .eq('platform', 'youtube')
      .eq('external_account_id', channel.channelId)
      .maybeSingle();
    if (taken && taken.clipper_id !== clipper.id) {
      return back('/clippers/dashboard', { error: 'youtube_channel_taken' });
    }

    await db.from('social_connections').upsert(
      {
        clipper_id: clipper.id,
        platform: 'youtube',
        external_account_id: channel.channelId,
        handle: channel.handle ?? channel.title,
        scopes: ['youtube.readonly'],
        verified: true,
        connected_at: new Date().toISOString(),
        ...packTokens(tokens),
      },
      { onConflict: 'clipper_id,platform' },
    );

    return back('/clippers/dashboard', { connected: 'youtube' });
  } catch (e) {
    console.error('youtube callback failed', e);
    return back('/clippers/dashboard', { error: 'youtube_failed' });
  }
}
