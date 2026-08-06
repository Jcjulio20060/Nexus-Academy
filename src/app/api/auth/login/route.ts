import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import * as bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60 * 1000;

const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = attempts.get(key);
    if (!entry || now > entry.resetAt) {
        attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }
    entry.count += 1;
    return entry.count > MAX_ATTEMPTS;
}

function clientIp(request: Request): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

export async function POST(request: Request) {
    const ip = clientIp(request);
    if (isRateLimited(ip)) {
        return NextResponse.json({ success: false, error: 'Muitas tentativas. Tente novamente em 1 minuto.' }, { status: 429 });
    }

    let body: { username?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const { username, password } = body;

    if (!username || !password) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({
        where: { username }
    });

    if (user && await bcrypt.compare(password, user.password)) {
        await setSessionCookie();
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
