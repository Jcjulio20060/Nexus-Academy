import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function POST(request: Request) {
    const formData = await request.formData();

    // Create mode only here based on previous impl, assuming delete is separate route
    const message = formData.get('message') as string;
    if (message) {
        await prisma.notice.create({
            data: {
                message,
                active: true
            }
        });
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
