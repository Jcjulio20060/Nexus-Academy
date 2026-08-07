import webpush from 'web-push';
import { prisma } from '@/lib/data';

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:admin@nexus.app';

export function isPushConfigured(): boolean {
    return Boolean(publicKey && privateKey);
}

function getWebPush() {
    webpush.setVapidDetails(subject, publicKey!, privateKey!);
    return webpush;
}

async function sendToSubscriptions(subscriptions: { endpoint: string; p256dh: string; auth: string }[], payload: string) {
    await Promise.allSettled(
        subscriptions.map(sub =>
            getWebPush().sendNotification(
                {
                    endpoint: sub.endpoint,
                    keys: { p256dh: sub.p256dh, auth: sub.auth }
                },
                payload
            )
        )
    );
}

export async function sendNotificationToAll(title: string, body: string, url?: string): Promise<void> {
    if (!isPushConfigured()) return;

    const subscriptions = await prisma.pushSubscription.findMany();
    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url: url || '/' });
    await sendToSubscriptions(subscriptions, payload);
}

export async function sendNotificationToStudent(studentId: number, title: string, body: string, url?: string): Promise<void> {
    if (!isPushConfigured()) return;

    const subscriptions = await prisma.pushSubscription.findMany({ where: { studentId } });
    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({ title, body, url: url || '/' });
    await sendToSubscriptions(subscriptions, payload);
}
