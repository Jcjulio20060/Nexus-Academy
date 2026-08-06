import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { isAdminRequest } from '@/lib/auth';

export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const idValue = formData.get('id');

    if (idValue) {
        await prisma.event.delete({
            where: {
                id: Number(idValue)
            }
        });
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
