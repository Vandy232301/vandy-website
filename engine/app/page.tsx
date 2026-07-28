import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight">Vandy Creator Engine</h1>
        <p className="text-neutral-400 mt-3 text-sm leading-relaxed">
          Clipping (pay-per-views) + Referral (pay-per-conversion) for Vandy&apos;s brands and
          products.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/clippers/dashboard"
            className="rounded-full bg-white text-black font-semibold px-5 py-2 text-sm"
          >
            Clipper dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-neutral-800 px-5 py-2 text-sm hover:bg-neutral-900"
          >
            Log in
          </Link>
        </div>
        <div className="mt-4">
          <Link href="/admin" className="text-xs text-neutral-600 hover:text-neutral-400">
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
}
