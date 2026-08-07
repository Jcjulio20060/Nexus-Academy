import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { telegramApi, isTelegramConfigured } from '@/lib/telegram';

export async function POST(request: NextRequest) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!isTelegramConfigured()) {
        return NextResponse.json({ success: false, error: 'Telegram não configurado. Verifique TELEGRAM_BOT_TOKEN e TELEGRAM_ADMIN_CHAT_ID.' }, { status: 400 });
    }

    const origin = request.headers.get('x-forwarded-proto')
        ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('x-forwarded-host')}`
        : new URL(request.url).origin;

    const webhookUrl = `${origin}/api/telegram/webhook`;

    const result = await telegramApi('setWebhook', {
        url: webhookUrl,
        secret_token: process.env.TELEGRAM_WEBHOOK_SECRET || undefined,
        allowed_updates: ['message', 'callback_query']
    });

    return NextResponse.json({ success: Boolean(result), webhookUrl, result });
}

export async function GET(request: NextRequest) {
    if (!(await isAdminRequest(request))) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const info = await telegramApi('getWebhookInfo');
    return NextResponse.json({ success: Boolean(info), info });
}
