// Platform registry: turning a pasted clip URL into something trackable.
//
// Auto-tracking depends on each platform's API review, which lands at a
// different time for each. Anything not auto-tracked falls to the admin's
// manual-count queue rather than silently paying out on a claimed number.

import type { Platform } from '@/config/clipping';

export interface PlatformCapability {
  platform: Platform;
  label: string;
  /** Can we read view counts through the official API today? */
  autoTracked: boolean;
  /** Why not, when false — surfaced in the UI so nobody wonders. */
  note?: string;
}

export const PLATFORMS: Record<Platform, PlatformCapability> = {
  youtube: {
    platform: 'youtube',
    label: 'YouTube',
    autoTracked: true,
  },
  tiktok: {
    platform: 'tiktok',
    label: 'TikTok',
    autoTracked: false,
    note: 'Display API access is pending app review — counts are confirmed manually until then.',
  },
  instagram: {
    platform: 'instagram',
    label: 'Instagram',
    autoTracked: false,
    note: 'Graph API access is pending app review — counts are confirmed manually until then.',
  },
  x: {
    platform: 'x',
    label: 'X',
    autoTracked: false,
    note: 'Needs a paid API tier — counts are confirmed manually until then.',
  },
};

export interface ParsedClipUrl {
  platform: Platform;
  /** The platform's own id for the video, used to poll stats later. */
  externalVideoId: string | null;
  /** Normalised URL we store and show. */
  canonicalUrl: string;
}

/**
 * Work out which platform a URL belongs to and pull the video id where the
 * URL carries one. Returns null when the URL isn't a recognised clip link.
 */
export function parseClipUrl(raw: string): ParsedClipUrl | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const host = url.hostname.replace(/^www\./, '').toLowerCase();
  const path = url.pathname;

  // --- YouTube: watch?v=, youtu.be/, /shorts/, /live/ ---
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    const v = url.searchParams.get('v');
    if (v) return yt(v);
    const seg = path.match(/^\/(?:shorts|live|embed|v)\/([A-Za-z0-9_-]{6,})/);
    if (seg) return yt(seg[1]);
    return null;
  }
  if (host === 'youtu.be') {
    const id = path.slice(1).split('/')[0];
    return id ? yt(id) : null;
  }

  // --- TikTok: /@handle/video/123, vm./vt. short links ---
  if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
    const m = path.match(/\/video\/(\d+)/);
    return {
      platform: 'tiktok',
      externalVideoId: m ? m[1] : null, // short links only resolve after a redirect
      canonicalUrl: stripTracking(url),
    };
  }

  // --- Instagram: /reel/CODE, /p/CODE ---
  if (host === 'instagram.com' || host.endsWith('.instagram.com')) {
    const m = path.match(/^\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/);
    return {
      platform: 'instagram',
      externalVideoId: m ? m[1] : null,
      canonicalUrl: stripTracking(url),
    };
  }

  // --- X / Twitter: /handle/status/123 ---
  if (host === 'x.com' || host === 'twitter.com' || host === 'mobile.twitter.com') {
    const m = path.match(/\/status\/(\d+)/);
    return {
      platform: 'x',
      externalVideoId: m ? m[1] : null,
      canonicalUrl: stripTracking(url),
    };
  }

  return null;
}

function yt(id: string): ParsedClipUrl {
  return {
    platform: 'youtube',
    externalVideoId: id,
    canonicalUrl: `https://www.youtube.com/watch?v=${id}`,
  };
}

/** Drop share/campaign params so the same clip posted twice is still one clip. */
function stripTracking(url: URL): string {
  const junk = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'is_from_webapp', 'sender_device', 'web_id', 'igsh', 'igshid', 's', 't', 'ref_src', 'ref_url',
  ];
  junk.forEach((k) => url.searchParams.delete(k));
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}
