import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { notifyAdmin } from '@/lib/notify';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const ticketId = parseInt(formData.get('ticketId') as string);
        const studentId = parseInt(formData.get('studentId') as string);
        const message = (formData.get('message') as string)?.trim();

        if (!ticketId || !studentId || !message) {
            return NextResponse.json({ success: false, error: 'Dados incompletos' }, { status: 400 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { student: true }
        });

        if (!ticket || ticket.studentId !== studentId) {
            return NextResponse.json({ success: false, error: 'Ticket não encontrado' }, { status: 404 });
        }

        await prisma.ticketReply.create({ data: { message, isAdmin: false, ticketId } });

        await notifyAdmin(
            `Nova mensagem no ticket: ${ticket.subject}`,
            `
                <h2>Novo comentário de ${ticket.student.name} no ticket "${ticket.subject}"</h2>
                <p><strong>Mensagem:</strong> ${message}</p>
                <hr />
                <p>Acesse o painel administrativo para responder.</p>
            `
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Ticket student reply error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
