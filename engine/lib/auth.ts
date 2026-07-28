// Server-side auth helpers. Uses Supabase getUser() (revalidates the token) and the
// creator.is_admin() RPC for role checks. Call these in Server Components / route handlers.

import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase';

export async function getUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect('/login?next=/clippers/dashboard');
  return user;
}

export async function isAdmin(): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return data === true;
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user) redirect('/login?next=/admin');
  if (!(await isAdmin())) redirect('/login?e=forbidden');
  return user;
}

/** The clipper row owned by a given auth user (RLS-scoped), or null. */
export async function getMyClipper(userId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.from('clippers').select('*').eq('user_id', userId).maybeSingle();
  return data;
}
