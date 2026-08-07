import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { isAdminRequest } from '@/lib/auth';
import { sendNotificationToAll } from '@/lib/push';

export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    const message = formData.get('message') as string;
    if (message) {
        await prisma.notice.create({
            data: {
                message,
                active: true
            }
        });

        await sendNotificationToAll('Novo aviso', message, '/');
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
