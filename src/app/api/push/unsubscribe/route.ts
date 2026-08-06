import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const endpoint = body.endpoint;

        if (!endpoint) {
            return NextResponse.json({ success: false, error: 'Endpoint obrigatório' }, { status: 400 });
        }

        await prisma.pushSubscription.deleteMany({ where: { endpoint } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Push unsubscribe error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
