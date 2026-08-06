import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/data';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const subscription = body.subscription;
        const studentIdValue = body.studentId;

        if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
            return NextResponse.json({ success: false, error: 'Subscription inválida' }, { status: 400 });
        }

        let studentId: number | null = null;
        if (studentIdValue) {
            const parsed = parseInt(studentIdValue as string);
            const student = parsed ? await prisma.student.findUnique({ where: { id: parsed } }) : null;
            if (student) studentId = parsed;
        }

        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: { p256dh: subscription.keys.p256dh, auth: subscription.keys.auth, studentId },
            create: {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                studentId
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Push subscribe error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
