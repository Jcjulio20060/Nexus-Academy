import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const PROTECTED_PATHS = ['/dashboard', '/perfil', '/ausencias', '/tickets', '/admin'];
const AUTH_PAGES = ['/login', '/registro'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('nexus_token')?.value;

  let authed = false;
  if (token) {
    try {
      verifyToken(token);
      authed = true;
    } catch {
      authed = false;
    }
  }

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.includes(pathname) && authed) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/perfil/:path*',
    '/ausencias/:path*',
    '/tickets/:path*',
    '/admin/:path*',
    '/login',
    '/registro',
  ],
};
