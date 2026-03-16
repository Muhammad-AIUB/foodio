import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'access_token';

function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64);
    return JSON.parse(decoded) as { role?: string };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === '/sign-in' || pathname === '/login' || pathname === '/register';

  const isAdminRoute = pathname.startsWith('/admin');

  const isUserProtectedRoute =
    pathname.startsWith('/orders') || pathname.startsWith('/checkout') || pathname.startsWith('/my-orders');

  if (isAuthRoute && token) {
    const payload = decodeJwtPayload(token);
    const isAdmin = payload?.role === 'ADMIN';
    const redirectUrl = isAdmin ? '/admin' : '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (isAdminRoute) {
    if (!token) return NextResponse.redirect(new URL('/sign-in', request.url));
    const payload = decodeJwtPayload(token);
    if (payload?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (isUserProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/checkout/:path*', '/my-orders/:path*', '/sign-in', '/login', '/register'],
};
