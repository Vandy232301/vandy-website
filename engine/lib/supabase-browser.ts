// Browser Supabase client (Client Components). Anon key, RLS-enforced.
// Kept separate from lib/supabase.ts so client bundles never import next/headers.

import { createBrowserClient } from '@supabase/ssr';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserSupabase() {
  return createBrowserClient(URL, ANON, { db: { schema: 'creator' } });
}
