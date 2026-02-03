import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function POST(request: Request) {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const type = formData.get('type') as string;

    if (title && date && type) {
        await prisma.event.create({
            data: {
                title,
                date,
                type
            }
        });
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
