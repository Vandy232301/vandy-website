import { supabase } from './supabase';

/**
 * Love counts for the project cards.
 *
 * Counts live in Supabase (public.project_loves) so every visitor sees and adds
 * to the SAME number. The anon key can only read; the single write path is the
 * increment_love() RPC, which adds exactly +1.
 *
 * These seeds are the starting values and double as an offline fallback, so the
 * cards always show a stable number even if the DB is unreachable. They are
 * fixed rather than randomised per load — a number that changes on every
 * refresh reads as broken.
 */
export const SEED_LOVES: Record<string, number> = {
  dynasty: 2847,
  nowwwa: 1936,
  neotrader: 1204,
  swagg: 873,
  izzy: 642,
  blur: 1518,
  wizzywazza: 2103,
  dozain: 419,
  consult: 756,
};

const STORAGE_KEY = 'vandy_loved_projects';

/** Project ids this visitor has already loved (one love each, kept locally). */
export function getLovedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function persistLovedIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // private mode / storage disabled — the love still registers server-side
  }
}

/** Read every count. Returns null if the table isn't reachable yet. */
export async function fetchLoves(): Promise<Record<string, number> | null> {
  try {
    const { data, error } = await supabase.from('project_loves').select('project_id, loves');
    if (error || !data) return null;
    const map: Record<string, number> = {};
    for (const row of data as { project_id: string; loves: number }[]) {
      map[row.project_id] = row.loves;
    }
    return map;
  } catch {
    return null;
  }
}

/** Add one love. Returns the new server count, or null if it didn't land. */
export async function sendLove(projectId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc('increment_love', { p_project_id: projectId });
    if (error || typeof data !== 'number') return null;
    return data;
  } catch {
    return null;
  }
}

/** 1234 -> "1.2k" */
export function formatLoves(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}
