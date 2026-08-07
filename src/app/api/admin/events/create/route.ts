import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { isAdminRequest } from '@/lib/auth';
import { sendNotificationToAll } from '@/lib/push';

export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

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

        await sendNotificationToAll('Novo prazo', title, '/');
    }

    return NextResponse.redirect(new URL('/admin/dashboard', request.url), 303);
}
