// Kick off the YouTube connect flow for the signed-in creator.
// The random `state` is echoed back by Google and checked in the callback, so
// a third party cannot trick someone into attaching their channel.

import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { requireUser, getMyClipper } from '@/lib/auth';
import { isYoutubeConfigured, youtubeAuthUrl } from '@/lib/platforms/youtube';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireUser();
  const clipper = await getMyClipper(user.id);
  if (!clipper) {
    return NextResponse.redirect(new URL('/clippers/apply', process.env.NEXT_PUBLIC_ENGINE_URL));
  }
  if (!isYoutubeConfigured()) {
    return NextResponse.json(
      { error: 'YouTube is not configured yet — YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET are missing.' },
      { status: 503 },
    );
  }

  const state = randomBytes(24).toString('hex');
  const jar = await cookies();
  jar.set('yt_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600, // ten minutes to finish the flow
  });

  return NextResponse.redirect(youtubeAuthUrl(state));
}
