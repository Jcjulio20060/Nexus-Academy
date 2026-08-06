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
        const ticket = await prisma.ticket.findUnique({ where: { id } });
        if (ticket) {
            if (ticket.attachmentUrl) await deleteFile(ticket.attachmentUrl);
            await prisma.ticket.delete({ where: { id } });
        }
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
