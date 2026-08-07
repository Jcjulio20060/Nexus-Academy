import { NextResponse } from 'next/server';
import { prisma } from '@/lib/data';
import { sendTelegramMessage, answerCallbackQuery, escapeTg } from '@/lib/telegram';
import { replyToTicket, closeTicket, createOrReplyTicketForStudent } from '@/lib/services/tickets';
import { reviewAbsence } from '@/lib/services/absences';

const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;
const SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

const pendingReplies = new Map<string, { ticketId: number }>();

interface TelegramMessage {
    message_id: number;
    chat: { id: number };
    from: { id: number; first_name?: string };
    text?: string;
}

interface TelegramCallbackQuery {
    id: string;
    message?: { chat: { id: number } };
    data?: string;
}

export async function POST(request: Request) {
    if (SECRET) {
        const token = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
        if (token !== SECRET) {
            return NextResponse.json({ ok: false }, { status: 403 });
        }
    }

    const update = await request.json().catch(() => null);
    if (!update) return NextResponse.json({ ok: true });

    try {
        if (update.callback_query) {
            await handleCallback(update.callback_query as TelegramCallbackQuery);
        } else if (update.message) {
            await handleMessage(update.message as TelegramMessage);
        }
    } catch (error) {
        console.error('Telegram webhook error:', error);
    }

    return NextResponse.json({ ok: true });
}

async function handleMessage(message: TelegramMessage) {
    const chatId = String(message.chat.id);
    const text = (message.text || '').trim();

    if (ADMIN_CHAT_ID && chatId === ADMIN_CHAT_ID) {
        await handleAdminMessage(chatId, text);
        return;
    }

    await handleStudentMessage(chatId, text);
}

async function handleAdminMessage(chatId: string, text: string) {
    if (text.startsWith('/status')) {
        const [openTickets, pendingAbsences, students] = await Promise.all([
            prisma.ticket.count({ where: { status: 'OPEN' } }),
            prisma.absenceJustification.count({ where: { status: 'PENDING' } }),
            prisma.student.count()
        ]);
        await sendTelegramMessage(
            chatId,
            `// status do console\nTickets abertos: <b>${openTickets}</b>\nJustificativas pendentes: <b>${pendingAbsences}</b>\nAlunos cadastrados: <b>${students}</b>`
        );
        return;
    }

    if (text.startsWith('/')) {
        pendingReplies.delete(chatId);
        await sendTelegramMessage(
            chatId,
            'Comandos disponíveis:\n/status — resumo do console\n/start — ajuda\n\nUse os botões das notificações para aprovar, reprovar ou encerrar. Em "Responder", digite a resposta na sequência.'
        );
        return;
    }

    const pending = pendingReplies.get(chatId);
    if (pending) {
        pendingReplies.delete(chatId);
        const ticket = await prisma.ticket.findUnique({ where: { id: pending.ticketId }, include: { student: true } });
        if (!ticket) {
            await sendTelegramMessage(chatId, '// ticket não encontrado');
            return;
        }
        await replyToTicket(pending.ticketId, text, true);
        await sendTelegramMessage(chatId, `// resposta enviada a ${escapeTg(ticket.student.name)}`);
        return;
    }

    await sendTelegramMessage(chatId, 'Use /start para ver os comandos ou os botões das notificações.');
}

async function handleStudentMessage(chatId: string, text: string) {
    if (text.startsWith('/identificar')) {
        const registration = text.split(/\s+/)[1];
        if (!registration) {
            await sendTelegramMessage(chatId, '// use assim: /identificar 2023001234');
            return;
        }

        const student = await prisma.student.findUnique({ where: { registration } });
        if (!student) {
            await sendTelegramMessage(chatId, '// matrícula não encontrada. Confira e tente novamente.');
            return;
        }

        await prisma.telegramChat.upsert({
            where: { chatId },
            update: { studentId: student.id },
            create: { chatId, studentId: student.id }
        });

        await sendTelegramMessage(chatId, `// identificado como ${escapeTg(student.name)}. Mande sua mensagem para abrir um ticket.`);
        return;
    }

    if (text.startsWith('/start')) {
        await sendTelegramMessage(
            chatId,
            '// console Coffee & Code via Telegram\nIdentifique-se com sua matrícula:\n/identificar 2023001234\n\nDepois, é só mandar mensagem para abrir ou responder um ticket.'
        );
        return;
    }

    const link = await prisma.telegramChat.findUnique({ where: { chatId } });
    if (!link?.studentId) {
        await sendTelegramMessage(chatId, '// identifique-se primeiro com /identificar <matricula>');
        return;
    }

    const { ticket, created } = await createOrReplyTicketForStudent(link.studentId, text);
    await sendTelegramMessage(
        chatId,
        created
            ? `// ticket #${ticket.id} aberto. O admin vai responder aqui mesmo.`
            : `// mensagem adicionada ao ticket #${ticket.id}.`
    );
}

async function handleCallback(callback: TelegramCallbackQuery) {
    const chatId = String(callback.message?.chat.id || '');
    if (ADMIN_CHAT_ID && chatId !== ADMIN_CHAT_ID) return;

    const data = callback.data || '';
    const [action, rawId] = data.split(':');
    const id = Number(rawId);

    await answerCallbackQuery(callback.id);

    try {
        if (action === 'ticket_reply' && id) {
            pendingReplies.set(chatId, { ticketId: id });
            await sendTelegramMessage(chatId, `// digite a resposta para o ticket #${id}:`);
        } else if (action === 'ticket_close' && id) {
            await closeTicket(id);
            await sendTelegramMessage(chatId, `// ticket #${id} encerrado.`);
        } else if (action === 'absence_approve' && id) {
            await reviewAbsence(id, 'APPROVED', null);
            await sendTelegramMessage(chatId, `// justificativa #${id} aprovada.`);
        } else if (action === 'absence_reject' && id) {
            await reviewAbsence(id, 'REJECTED', null);
            await sendTelegramMessage(chatId, `// justificativa #${id} reprovada.`);
        }
    } catch (error) {
        console.error('Telegram callback error:', error);
        await sendTelegramMessage(chatId, '// falha ao processar a ação.');
    }
}
