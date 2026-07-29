// Presentation helpers shared by the portal and the console.

export function money(cents: number, currency = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

export function views(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

/** 1_240_000 -> "1.24M" — for tight columns. */
export function viewsShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

export function whenShort(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export const PLATFORM_COLOR: Record<string, string> = {
  youtube: '#ff2f2f',
  tiktok: '#25f4ee',
  instagram: '#e1306c',
  x: '#e7e9ea',
};
