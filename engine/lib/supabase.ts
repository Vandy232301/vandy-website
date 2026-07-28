// Supabase clients for the Creator Engine.
// - Browser / server (user-scoped): anon key, RLS-enforced.
// - Admin: service-role key, SERVER ONLY, bypasses RLS (webhooks/workers/admin actions).
// All clients target the dedicated `creator` schema.

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SCHEMA = 'creator';

// Browser client lives in `lib/supabase-browser.ts` so client components never
// pull in this module's `next/headers` (server-only) import.

/** Server components & route handlers — user session via cookies, RLS-enforced. */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(URL, ANON, {
    db: { schema: SCHEMA },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component — cookies are read-only here; ignore.
        }
      },
    },
  });
}

/**
 * Service-role client. SERVER ONLY — bypasses every RLS policy.
 * Use exclusively in webhooks, cron workers, and trusted server actions.
 */
export function supabaseAdmin() {
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin() must never run in the browser');
  }
  const service = process.env.SUPABASE_SERVICE_KEY;
  if (!service) throw new Error('SUPABASE_SERVICE_KEY is not set');
  return createClient(URL, service, {
    db: { schema: SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
