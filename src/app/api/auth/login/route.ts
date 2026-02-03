import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/data';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({
        where: { username }
    });

    // In a real app, use bcrypt to compare hashed password. 
    // For this prototype/MVP, we are doing plain text comparison as agreed in plan.
    if (user && user.password === password) {
        (await cookies()).set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
