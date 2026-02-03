import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('admin_session');

    // Protect admin dashboard
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Redirect from login if already logged in
    if (request.nextUrl.pathname === '/admin/login') {
        if (session) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
