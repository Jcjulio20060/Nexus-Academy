import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { isAdminRequest } from '@/lib/auth';
import { deleteFile } from '@/lib/storage';

export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const id = parseInt(formData.get('id') as string);

    if (id) {
        const justification = await prisma.absenceJustification.findUnique({ where: { id } });
        if (justification) {
            if (justification.attachmentUrl) await deleteFile(justification.attachmentUrl);
            await prisma.absenceJustification.delete({ where: { id } });
        }
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
