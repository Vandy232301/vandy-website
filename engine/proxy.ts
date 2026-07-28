// Next.js 16 "Proxy" (formerly Middleware). Optimistic, lightweight only.
// Captures a clipper referral (?ref=slug) into a first-party cookie for later attribution.
// Last-touch rule (a code used at checkout always wins) is enforced later, at webhook time.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REF_COOKIE = 'vandy_ref';
const NINETY_DAYS = 60 * 60 * 24 * 90;

export function proxy(request: NextRequest) {
  const res = NextResponse.next();
  const ref = request.nextUrl.searchParams.get('ref');
  if (ref && !request.cookies.get(REF_COOKIE)) {
    res.cookies.set(REF_COOKIE, ref, {
      maxAge: NINETY_DAYS,
      sameSite: 'lax',
      path: '/',
    });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
