// Admin decisions on the review queue.
//
// Manual counts exist because TikTok, Instagram and X have no usable read
// access yet. Confirming a count writes it as a `manual` snapshot, which the
// same payout engine then treats exactly like an API reading — one code path
// for the money, whatever the source.

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import { reconcileClipEarnings } from '@/lib/clipping';
import { reverseEarningsForClip } from '@/lib/earnings';

export const dynamic = 'force-dynamic';

type Action =
  | { action: 'confirm_views'; clipId: string; views: number }
  | { action: 'reject_clip'; clipId: string; reason?: string }
  | { action: 'approve_clipper'; clipperId: string }
  | { action: 'ban_clipper'; clipperId: string }
  | { action: 'resolve_flag'; flagId: string };

export async function POST(request: Request) {
  await requireAdmin();

  let body: Action;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send a JSON body.' }, { status: 400 });
  }

  const db = supabaseAdmin();
  const now = new Date().toISOString();

  switch (body.action) {
    // ---- confirm a hand-checked view count ----
    case 'confirm_views': {
      const views = Math.floor(Number(body.views));
      if (!Number.isFinite(views) || views < 0) {
        return NextResponse.json({ error: 'Give a view count of 0 or more.' }, { status: 400 });
      }

      const { data: clip } = await db
        .from('clips')
        .select('id, current_views, first_seen_at, status')
        .eq('id', body.clipId)
        .maybeSingle();
      if (!clip) return NextResponse.json({ error: 'Clip not found.' }, { status: 404 });

      if (views < (clip.current_views ?? 0)) {
        return NextResponse.json(
          { error: `That is lower than the ${clip.current_views} already recorded. View counts do not go down.` },
          { status: 400 },
        );
      }

      // First confirmation anchors the counting window and the baseline.
      const isFirst = !clip.first_seen_at;

      await db.from('clip_view_snapshots').insert({
        clip_id: clip.id,
        views,
        source: 'manual',
        captured_at: now,
      });

      await db
        .from('clips')
        .update({
          current_views: views,
          status: 'tracking',
          last_polled_at: now,
          ...(isFirst ? { first_seen_at: now } : {}),
        })
        .eq('id', clip.id);

      // On the very first confirmation the baseline equals the count, so this
      // credits nothing — payment starts from the next confirmation onward.
      const credited = await reconcileClipEarnings(clip.id as string);

      return NextResponse.json({
        ok: true,
        creditedCents: credited,
        note: isFirst
          ? 'Baseline set. Views from here on count toward payout.'
          : `Credited $${(credited / 100).toFixed(2)}.`,
      });
    }

    // ---- reject a clip, clawing back anything already credited ----
    case 'reject_clip': {
      const { data: clip } = await db
        .from('clips')
        .select('id')
        .eq('id', body.clipId)
        .maybeSingle();
      if (!clip) return NextResponse.json({ error: 'Clip not found.' }, { status: 404 });

      await db
        .from('clips')
        .update({ status: 'rejected', rejected_reason: body.reason ?? 'rejected by admin' })
        .eq('id', clip.id);

      await reverseEarningsForClip(clip.id as string);
      return NextResponse.json({ ok: true, note: 'Clip rejected and any credit reversed.' });
    }

    // ---- clipper application decisions ----
    case 'approve_clipper': {
      const { data: c } = await db
        .from('clippers')
        .select('id, name, code, link_slug, status')
        .eq('id', body.clipperId)
        .maybeSingle();
      if (!c) return NextResponse.json({ error: 'Clipper not found.' }, { status: 404 });

      // Give them a referral code and short-link slug on approval.
      const code = c.code ?? (await uniqueCode(db, c.name as string));
      const slug = c.link_slug ?? (await uniqueSlug(db, c.name as string));

      await db
        .from('clippers')
        .update({ status: 'approved', approved_at: now, code, link_slug: slug })
        .eq('id', c.id);

      return NextResponse.json({ ok: true, code, slug });
    }

    case 'ban_clipper': {
      await db.from('clippers').update({ status: 'banned' }).eq('id', body.clipperId);
      return NextResponse.json({ ok: true });
    }

    case 'resolve_flag': {
      await db.from('fraud_flags').update({ resolved: true }).eq('id', body.flagId);
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  }
}

// --- helpers ---------------------------------------------------------------

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 12) || 'creator'
  );
}

async function uniqueSlug(db: ReturnType<typeof supabaseAdmin>, name: string) {
  const base = slugify(name);
  for (let i = 0; i < 30; i++) {
    const candidate = i === 0 ? base : `${base}${i + 1}`;
    const { data } = await db.from('clippers').select('id').eq('link_slug', candidate).maybeSingle();
    if (!data) return candidate;
  }
  return `${base}${Date.now().toString(36).slice(-4)}`;
}

async function uniqueCode(db: ReturnType<typeof supabaseAdmin>, name: string) {
  const base = slugify(name).toUpperCase().slice(0, 8);
  for (let i = 0; i < 30; i++) {
    const candidate = i === 0 ? `${base}20` : `${base}${20 + i}`;
    const { data } = await db.from('clippers').select('id').eq('code', candidate).maybeSingle();
    if (!data) return candidate;
  }
  return `${base}${Date.now().toString(36).slice(-4).toUpperCase()}`;
}
