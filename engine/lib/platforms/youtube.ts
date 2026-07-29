// YouTube integration — the first platform to go live, because the Data API
// needs only a Google Cloud project rather than a multi-week app review.
//
// Two jobs:
//   1. OAuth, so a creator proves the channel is theirs.
//   2. Reading view counts for videos on that channel.
//
// Ownership matters: we only ever count views for a video that belongs to the
// connected channel, so nobody can paste someone else's viral clip.

import { decryptToken, encryptToken } from '@/lib/crypto';

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/youtube/v3';

// Read-only: we never need to modify anything on the creator's channel.
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'openid',
  'email',
];

function clientId() {
  const v = process.env.YOUTUBE_CLIENT_ID;
  if (!v) throw new Error('YOUTUBE_CLIENT_ID is not set');
  return v;
}
function clientSecret() {
  const v = process.env.YOUTUBE_CLIENT_SECRET;
  if (!v) throw new Error('YOUTUBE_CLIENT_SECRET is not set');
  return v;
}
export function youtubeRedirectUri() {
  const base = process.env.NEXT_PUBLIC_ENGINE_URL || 'http://localhost:3333';
  return `${base.replace(/\/$/, '')}/api/oauth/youtube/callback`;
}

export function isYoutubeConfigured() {
  return Boolean(process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET);
}

/** Where we send the creator to approve access. `state` guards against CSRF. */
export function youtubeAuthUrl(state: string) {
  const p = new URLSearchParams({
    client_id: clientId(),
    redirect_uri: youtubeRedirectUri(),
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline', // we need a refresh token for the polling worker
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  });
  return `${AUTH_URL}?${p.toString()}`;
}

export interface YoutubeTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date;
}

export async function exchangeYoutubeCode(code: string): Promise<YoutubeTokens> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId(),
      client_secret: clientSecret(),
      redirect_uri: youtubeRedirectUri(),
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error(`YouTube token exchange failed: ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; refresh_token?: string; expires_in: number };
  return {
    accessToken: j.access_token,
    refreshToken: j.refresh_token ?? null,
    expiresAt: new Date(Date.now() + j.expires_in * 1000),
  };
}

export async function refreshYoutubeToken(refreshToken: string): Promise<YoutubeTokens> {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId(),
      client_secret: clientSecret(),
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`YouTube token refresh failed: ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  return {
    accessToken: j.access_token,
    refreshToken, // Google does not reissue the refresh token on refresh
    expiresAt: new Date(Date.now() + j.expires_in * 1000),
  };
}

/** The connected channel, used as the ownership anchor. */
export async function fetchYoutubeChannel(accessToken: string) {
  const res = await fetch(`${API}/channels?part=snippet&mine=true`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`YouTube channel lookup failed: ${await res.text()}`);
  const j = (await res.json()) as {
    items?: { id: string; snippet: { title: string; customUrl?: string } }[];
  };
  const c = j.items?.[0];
  if (!c) return null;
  return { channelId: c.id, title: c.snippet.title, handle: c.snippet.customUrl ?? null };
}

export interface YoutubeVideoStats {
  videoId: string;
  channelId: string;
  title: string;
  views: number;
  publishedAt: string;
}

/**
 * Stats for up to 50 videos in one call. Returns only what YouTube knows about;
 * missing ids simply don't come back (deleted or private clips).
 */
export async function fetchYoutubeVideoStats(
  accessToken: string,
  videoIds: string[],
): Promise<YoutubeVideoStats[]> {
  if (videoIds.length === 0) return [];
  const out: YoutubeVideoStats[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const res = await fetch(
      `${API}/videos?part=statistics,snippet&id=${batch.join(',')}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!res.ok) throw new Error(`YouTube stats failed: ${await res.text()}`);
    const j = (await res.json()) as {
      items?: {
        id: string;
        snippet: { channelId: string; title: string; publishedAt: string };
        statistics: { viewCount?: string };
      }[];
    };
    for (const v of j.items ?? []) {
      out.push({
        videoId: v.id,
        channelId: v.snippet.channelId,
        title: v.snippet.title,
        views: Number(v.statistics.viewCount ?? 0),
        publishedAt: v.snippet.publishedAt,
      });
    }
  }
  return out;
}

// --- token storage helpers -------------------------------------------------
// Tokens are encrypted at rest; these keep that detail in one place.

export function packTokens(t: YoutubeTokens) {
  return {
    access_token: encryptToken(t.accessToken),
    refresh_token: t.refreshToken ? encryptToken(t.refreshToken) : null,
    token_expires_at: t.expiresAt.toISOString(),
  };
}

export function unpackAccessToken(row: { access_token: string | null }) {
  return row.access_token ? decryptToken(row.access_token) : null;
}

export function unpackRefreshToken(row: { refresh_token: string | null }) {
  return row.refresh_token ? decryptToken(row.refresh_token) : null;
}

/** Return a usable access token, refreshing first if it is about to expire. */
export async function ensureFreshAccessToken(row: {
  access_token: string | null;
  refresh_token: string | null;
  token_expires_at: string | null;
}): Promise<{ accessToken: string; refreshed: YoutubeTokens | null }> {
  const expiresAt = row.token_expires_at ? new Date(row.token_expires_at).getTime() : 0;
  const stillGood = expiresAt - Date.now() > 60_000; // one minute of headroom
  const access = unpackAccessToken(row);

  if (stillGood && access) return { accessToken: access, refreshed: null };

  const refresh = unpackRefreshToken(row);
  if (!refresh) throw new Error('no refresh token stored — the creator must reconnect');

  const fresh = await refreshYoutubeToken(refresh);
  return { accessToken: fresh.accessToken, refreshed: fresh };
}
