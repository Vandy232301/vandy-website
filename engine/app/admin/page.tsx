import { requireAdmin } from '@/lib/auth';
import { createServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

type ClipperRow = {
  id: string;
  name: string;
  email: string;
  status: string;
  tier: string;
  created_at: string;
};

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createServerSupabase();

  const [{ count: total }, { count: pending }, { data: rows }] = await Promise.all([
    supabase.from('clippers').select('*', { count: 'exact', head: true }),
    supabase.from('clippers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('clippers')
      .select('id,name,email,status,tier,created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const clippers = (rows ?? []) as ClipperRow[];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Kpi label="Total clippers" value={total ?? 0} />
          <Kpi label="Pending approval" value={pending ?? 0} />
        </div>

        <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-3">
          Recent clippers
        </h2>
        <div className="rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/60 text-neutral-400">
              <tr>
                <th className="text-left font-medium px-4 py-2">Name</th>
                <th className="text-left font-medium px-4 py-2">Email</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-left font-medium px-4 py-2">Tier</th>
              </tr>
            </thead>
            <tbody>
              {clippers.map((c) => (
                <tr key={c.id} className="border-t border-neutral-800">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2 text-neutral-400">{c.email}</td>
                  <td className="px-4 py-2">{c.status}</td>
                  <td className="px-4 py-2">{c.tier}</td>
                </tr>
              ))}
              {clippers.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-neutral-500" colSpan={4}>
                    No clippers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs text-neutral-500 mt-1">{label}</div>
    </div>
  );
}
