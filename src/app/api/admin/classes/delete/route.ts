import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function POST(request: Request) {
    const formData = await request.formData();
    const idValue = formData.get('id');

    if (idValue) {
        await prisma.classSession.delete({
            where: {
                id: Number(idValue)
            }
        });
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
