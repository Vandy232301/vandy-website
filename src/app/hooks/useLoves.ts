import { useEffect, useState } from 'react';
import {
  SEED_LOVES,
  fetchLoves,
  sendLove,
  getLovedIds,
  persistLovedIds,
} from '../../lib/loves';

/**
 * Shared love counts for the project cards.
 *
 * Reads real counts once on mount (falling back to the seeds if the DB is
 * unreachable) and updates optimistically on click so the heart responds
 * instantly. One love per project per visitor.
 */
export function useLoves() {
  const [loves, setLoves] = useState<Record<string, number>>(SEED_LOVES);
  const [lovedIds, setLovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLovedIds(getLovedIds());
    let cancelled = false;
    fetchLoves().then((server) => {
      if (!cancelled && server && Object.keys(server).length) {
        setLoves((prev) => ({ ...prev, ...server }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function love(projectId: string) {
    if (lovedIds.has(projectId)) return; // already loved by this visitor

    // Optimistic: bump immediately, reconcile with the server below.
    setLoves((prev) => ({ ...prev, [projectId]: (prev[projectId] ?? 0) + 1 }));
    const next = new Set(lovedIds).add(projectId);
    setLovedIds(next);
    persistLovedIds(next);

    sendLove(projectId).then((serverCount) => {
      if (typeof serverCount === 'number') {
        setLoves((prev) => ({ ...prev, [projectId]: serverCount }));
      }
    });
  }

  return { loves, lovedIds, love };
}
