import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { isAdminRequest } from '@/lib/auth';
import { sendNotificationToStudent } from '@/lib/push';

export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const id = parseInt(formData.get('id') as string);

        if (!id) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
        }

        const ticket = await prisma.ticket.findUnique({ where: { id } });
        if (!ticket) {
            return NextResponse.json({ success: false, error: 'Ticket não encontrado' }, { status: 404 });
        }

        await prisma.ticket.update({
            where: { id },
            data: { status: 'CLOSED' }
        });

        await sendNotificationToStudent(
            ticket.studentId,
            'Ticket encerrado',
            ticket.subject,
            '/tickets'
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ticket close error:', error);
        return NextResponse.json({ success: false, error: 'Failed to close ticket' }, { status: 500 });
    }
}
