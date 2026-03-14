import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_PATHS = ['/dashboard', '/profile'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const isPrivate = PRIVATE_PATHS.some((p) => request.nextUrl.pathname.startsWith(p));
  if (isPrivate && !token) return NextResponse.redirect(new URL('/', request.url));
  return NextResponse.next();
}
