'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

async function post(body: unknown) {
  const res = await fetch('/api/admin/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error ?? 'Action failed.');
  return j;
}

/** Confirm a hand-checked view count for a platform we can't read yet. */
export function ConfirmViews({ clipId, current }: { clipId: string; current: number }) {
  const router = useRouter();
  const [val, setVal] = useState(String(current || ''));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go(action: 'confirm' | 'reject') {
    setBusy(true);
    setErr(null);
    try {
      if (action === 'confirm') {
        await post({ action: 'confirm_views', clipId, views: Number(val) });
      } else {
        await post({ action: 'reject_clip', clipId });
      }
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="views"
          className="w-28 rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1 text-right text-xs tabular-nums outline-none focus:border-neutral-600"
        />
        <button onClick={() => go('reject')} disabled={busy} className="rounded-md border border-neutral-800 px-2.5 py-1 text-xs text-neutral-400 hover:text-white disabled:opacity-50">
          Reject
        </button>
        <button onClick={() => go('confirm')} disabled={busy} className="rounded-md bg-amber-400 px-2.5 py-1 text-xs font-semibold text-black disabled:opacity-50">
          {busy ? '…' : 'Confirm'}
        </button>
      </div>
      {err && <span className="text-[10px] text-rose-400">{err}</span>}
    </div>
  );
}

export function ClipperDecision({ clipperId }: { clipperId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go(action: 'approve_clipper' | 'ban_clipper') {
    setBusy(true);
    setErr(null);
    try {
      await post({ action, clipperId });
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button onClick={() => go('ban_clipper')} disabled={busy} className="rounded-md border border-neutral-800 px-2.5 py-1 text-xs text-neutral-400 hover:text-white disabled:opacity-50">
          Decline
        </button>
        <button onClick={() => go('approve_clipper')} disabled={busy} className="rounded-md bg-amber-400 px-2.5 py-1 text-xs font-semibold text-black disabled:opacity-50">
          {busy ? '…' : 'Approve'}
        </button>
      </div>
      {err && <span className="text-[10px] text-rose-400">{err}</span>}
    </div>
  );
}

export function ResolveFlag({ flagId, clipId }: { flagId: string; clipId: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function go(reject: boolean) {
    setBusy(true);
    try {
      if (reject && clipId) await post({ action: 'reject_clip', clipId, reason: 'flagged and rejected' });
      await post({ action: 'resolve_flag', flagId });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => go(true)} disabled={busy} className="rounded-md border border-rose-900 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-950/40 disabled:opacity-50">
        Reject clip
      </button>
      <button onClick={() => go(false)} disabled={busy} className="rounded-md border border-neutral-800 px-2.5 py-1 text-xs text-neutral-400 hover:text-white disabled:opacity-50">
        {busy ? '…' : 'Looks fine'}
      </button>
    </div>
  );
}

export function RunTracker() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<string | null>(null);

  async function go() {
    setBusy(true);
    setOut(null);
    try {
      const res = await fetch('/api/clips/track', { method: 'POST' });
      const j = await res.json();
      setOut(res.ok ? `Polled ${j.polled}, credited $${j.creditedUSD}, released ${j.released}` : (j.error ?? 'failed'));
      router.refresh();
    } catch {
      setOut('Network error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {out && <span className="text-[11px] text-neutral-400">{out}</span>}
      <button onClick={go} disabled={busy} className="rounded-md border border-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white disabled:opacity-50">
        {busy ? 'Running…' : 'Refresh view counts now'}
      </button>
    </div>
  );
}
