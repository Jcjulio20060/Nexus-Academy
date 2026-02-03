import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function POST(request: Request) {
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const subject = formData.get('subject') as string;
    const url = formData.get('url') as string;

    if (title && subject && url) {
        await prisma.resource.create({
            data: {
                title,
                subject,
                url
            }
        });
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
