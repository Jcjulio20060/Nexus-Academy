import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { isAdminRequest } from '@/lib/auth';
import { deleteFile } from '@/lib/storage';

export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const idValue = formData.get('id');

    if (idValue) {
        const resource = await prisma.resource.findUnique({ where: { id: Number(idValue) } });
        if (resource) {
            if (resource.type === 'FILE') await deleteFile(resource.url);
            await prisma.resource.delete({ where: { id: resource.id } });
        }
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
