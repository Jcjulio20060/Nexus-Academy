import { prisma } from '@/lib/data';
import { sendNotificationToStudent } from '@/lib/push';
import { notifyAdmin, notifyStudent, emailTemplate, escapeHtml } from '@/lib/notify';
import { notifyAdminTelegram, notifyStudentTelegram, inlineButtons, escapeTg } from '@/lib/telegram';

export async function notifyAdminNewTicket(ticketId: number): Promise<void> {
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { student: true }
    });
    if (!ticket) return;

    const body = `Novo ticket de <strong>${escapeHtml(ticket.student.name)}</strong> (${escapeHtml(ticket.student.registration)}).<br/>Assunto: ${escapeHtml(ticket.subject)}<br/><br/>${escapeHtml(ticket.message)}`;

    await notifyAdmin(
        `Novo ticket: ${ticket.subject}`,
        emailTemplate('Novo ticket recebido', body, 'Acesse o painel administrativo para responder.')
    );

    await notifyAdminTelegram(
        `// novo ticket #${ticket.id} — ${escapeTg(ticket.student.name)}\n<strong>${escapeTg(ticket.subject)}</strong>\n${escapeTg(ticket.message.slice(0, 400))}`,
        inlineButtons([
            [
                { text: 'Responder', callbackData: `ticket_reply:${ticket.id}` },
                { text: 'Encerrar', callbackData: `ticket_close:${ticket.id}` }
            ]
        ])
    );
}

export async function replyToTicket(ticketId: number, message: string, isAdmin: boolean): Promise<void> {
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { student: true }
    });
    if (!ticket) throw new Error('Ticket não encontrado');

    await prisma.ticketReply.create({ data: { message, isAdmin, ticketId } });

    if (isAdmin) {
        const body = `Você recebeu uma resposta no ticket <strong>${escapeHtml(ticket.subject)}</strong>:<br/><br/>${escapeHtml(message)}`;

        await sendNotificationToStudent(ticket.studentId, 'Resposta no seu ticket', ticket.subject, '/tickets');
        await notifyStudent(ticket.student.email, 'Resposta no seu ticket', emailTemplate('Resposta no seu ticket', body));
        await notifyStudentTelegram(ticket.studentId, `// resposta no seu ticket "${escapeTg(ticket.subject)}":\n${escapeTg(message)}`);
    } else {
        const body = `Novo comentário de <strong>${escapeHtml(ticket.student.name)}</strong> no ticket "${escapeHtml(ticket.subject)}":<br/><br/>${escapeHtml(message)}`;

        await notifyAdmin(
            `Nova mensagem no ticket: ${ticket.subject}`,
            emailTemplate('Nova mensagem do aluno', body, 'Acesse o painel administrativo para responder.')
        );

        await notifyAdminTelegram(
            `// nova mensagem no ticket #${ticket.id} — ${escapeTg(ticket.student.name)}\n<strong>${escapeTg(ticket.subject)}</strong>\n${escapeTg(message.slice(0, 400))}`,
            inlineButtons([
                [
                    { text: 'Responder', callbackData: `ticket_reply:${ticket.id}` },
                    { text: 'Encerrar', callbackData: `ticket_close:${ticket.id}` }
                ]
            ])
        );
    }
}

export async function closeTicket(ticketId: number): Promise<void> {
    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { student: true }
    });
    if (!ticket) throw new Error('Ticket não encontrado');

    await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: 'CLOSED' }
    });

    const body = `O ticket <strong>${escapeHtml(ticket.subject)}</strong> foi encerrado.`;

    await sendNotificationToStudent(ticket.studentId, 'Ticket encerrado', ticket.subject, '/tickets');
    await notifyStudent(ticket.student.email, 'Ticket encerrado', emailTemplate('Ticket encerrado', body));
    await notifyStudentTelegram(ticket.studentId, `// ticket "${escapeTg(ticket.subject)}" encerrado.`);
}

export async function createOrReplyTicketForStudent(studentId: number, message: string) {
    const openTicket = await prisma.ticket.findFirst({
        where: { studentId, status: 'OPEN' },
        orderBy: { createdAt: 'desc' }
    });

    if (openTicket) {
        await replyToTicket(openTicket.id, message, false);
        return { ticket: openTicket, created: false };
    }

    const subject = message.split('\n')[0].slice(0, 60) || 'Mensagem via Telegram';

    const ticket = await prisma.ticket.create({
        data: { subject, category: 'OUTRO', message, studentId }
    });

    await notifyAdminNewTicket(ticket.id);

    return { ticket, created: true };
}
