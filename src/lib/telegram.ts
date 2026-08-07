import { prisma } from '@/lib/data';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

function apiUrl(method: string): string {
    return `https://api.telegram.org/bot${TOKEN}/${method}`;
}

export function isTelegramConfigured(): boolean {
    return Boolean(TOKEN && ADMIN_CHAT_ID);
}

export function escapeTg(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export async function telegramApi<T = Record<string, unknown>>(
    method: string,
    payload: Record<string, unknown> = {}
): Promise<T | null> {
    if (!TOKEN) return null;

    try {
        const res = await fetch(apiUrl(method), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error('Telegram API error:', method, res.status, await res.text());
            return null;
        }

        return (await res.json()) as T;
    } catch (error) {
        console.error('Telegram API exception:', method, error);
        return null;
    }
}

export async function sendTelegramMessage(
    chatId: string | number,
    text: string,
    replyMarkup?: object
): Promise<boolean> {
    const result = await telegramApi('sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...(replyMarkup ? { reply_markup: replyMarkup } : {})
    });
    return Boolean(result);
}

export function inlineButtons(rows: { text: string; callbackData: string }[][]): object {
    return {
        inline_keyboard: rows.map(row =>
            row.map(button => ({ text: button.text, callback_data: button.callbackData }))
        )
    };
}

export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<void> {
    await telegramApi('answerCallbackQuery', {
        callback_query_id: callbackQueryId,
        ...(text ? { text } : {})
    });
}

export async function notifyAdminTelegram(text: string, replyMarkup?: object): Promise<void> {
    if (!ADMIN_CHAT_ID) return;
    await sendTelegramMessage(ADMIN_CHAT_ID, text, replyMarkup);
}

export async function notifyStudentTelegram(studentId: number, text: string): Promise<void> {
    const chat = await prisma.telegramChat.findFirst({ where: { studentId } });
    if (!chat) return;
    await sendTelegramMessage(chat.chatId, text);
}
