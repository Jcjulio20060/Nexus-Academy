import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get(SESSION_COOKIE)?.value;
    const isAuthed = session ? await verifySessionToken(session) : false;

    const path = request.nextUrl.pathname;

    // Protect admin dashboard pages and admin API routes
    if (path.startsWith('/admin/dashboard') || path.startsWith('/api/admin')) {
        if (!isAuthed) {
            if (path.startsWith('/api/')) {
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Redirect from login if already logged in
    if (path === '/admin/login') {
        if (isAuthed) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
