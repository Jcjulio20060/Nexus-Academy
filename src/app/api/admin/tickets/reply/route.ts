import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { isAdminRequest } from '@/lib/auth';
import { replyToTicket } from '@/lib/services/tickets';

export async function POST(request: Request) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const ticketId = parseInt(formData.get('ticketId') as string);
        const message = (formData.get('message') as string)?.trim();

        if (!ticketId || !message) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
        }

        const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) {
            return NextResponse.json({ success: false, error: 'Ticket não encontrado' }, { status: 404 });
        }

        await replyToTicket(ticketId, message, true);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ticket reply error:', error);
        return NextResponse.json({ success: false, error: 'Failed to reply' }, { status: 500 });
    }
}
