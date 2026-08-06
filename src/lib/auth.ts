import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';
import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'admin_session';
export const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
    role: 'admin' | 'representative';
    name: string;
    id?: number;
}

function getSecret(): Uint8Array {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error('SESSION_SECRET environment variable is not set');
    }
    return new TextEncoder().encode(secret);
}

export async function createSession(user: SessionUser): Promise<string> {
    return new SignJWT({ role: user.role, name: user.name, id: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<boolean> {
    try {
        await jwtVerify(token, getSecret());
        return true;
    } catch {
        return false;
    }
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
    const token = await createSession(user);
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION,
        path: '/',
    });
}

export async function getSessionUser(): Promise<SessionUser | null> {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return {
            role: (payload.role as SessionUser['role']) || 'admin',
            name: (payload.name as string) || 'admin',
            id: payload.id as number | undefined
        };
    } catch {
        return null;
    }
}

export async function clearSessionCookie(): Promise<void> {
    (await cookies()).delete(SESSION_COOKIE);
}

function extractToken(request: Request): string | null {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;
    const pair = cookieHeader
        .split(';')
        .map(c => c.trim())
        .find(c => c.startsWith(`${SESSION_COOKIE}=`));
    if (!pair) return null;
    return decodeURIComponent(pair.slice(SESSION_COOKIE.length + 1));
}

export async function isAdminRequest(request: Request): Promise<boolean> {
    const token = extractToken(request);
    if (!token) return false;
    return verifySessionToken(token);
}
