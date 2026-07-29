'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Campaign {
  id: string;
  name: string;
  brand: string;
  cpm_cents: number;
}

export function SubmitClip({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id ?? '');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/clips/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, campaignId: campaignId || undefined }),
      });
      const j = await res.json();
      if (!res.ok) {
        setMsg({ kind: 'err', text: j.error ?? 'Could not submit that clip.' });
      } else {
        setMsg({ kind: 'ok', text: j.message ?? 'Clip submitted.' });
        setUrl('');
        router.refresh();
      }
    } catch {
      setMsg({ kind: 'err', text: 'Network error — try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste the link to your posted clip"
          className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
        />
        {campaigns.length > 0 && (
          <select
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {busy ? 'Checking…' : 'Submit clip'}
        </button>
      </div>
      {msg && (
        <p className={`text-xs ${msg.kind === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {msg.text}
        </p>
      )}
    </form>
  );
}
