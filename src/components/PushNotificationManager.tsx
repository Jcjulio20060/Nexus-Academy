'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getStudentSession } from '@/lib/studentSession';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function PushNotificationManager() {
    const supported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (!supported) return;
        let mounted = true;

        const syncExisting = () => {
            navigator.serviceWorker.ready
                .then(reg => reg.pushManager.getSubscription())
                .then(sub => {
                    if (!mounted) return;
                    if (!sub) {
                        setIsSubscribed(false);
                        return;
                    }
                    const student = getStudentSession();
                    fetch('/api/push/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ subscription: sub.toJSON(), studentId: student?.id })
                    }).catch(() => {});
                    setIsSubscribed(true);
                })
                .catch(() => {});
        };

        navigator.serviceWorker.ready
            .then(reg => reg.pushManager.getSubscription())
            .then((sub) => {
                if (mounted) setIsSubscribed(Boolean(sub));
            })
            .catch(() => {});

        window.addEventListener('nexus:student-change', syncExisting);
        return () => {
            mounted = false;
            window.removeEventListener('nexus:student-change', syncExisting);
        };
    }, [supported]);

    const subscribe = async () => {
        try {
            const student = getStudentSession();
            const toBody = (sub: PushSubscription) => JSON.stringify({
                subscription: sub.toJSON(),
                studentId: student?.id
            });

            const reg = await navigator.serviceWorker.ready;
            const existing = await reg.pushManager.getSubscription();
            if (existing) {
                await fetch('/api/push/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: toBody(existing)
                });
                setIsSubscribed(true);
                toast.success('Notificações ativadas!');
                return;
            }

            const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!publicKey) {
                toast.error('Notificações ainda não configuradas no servidor.');
                return;
            }

            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource
            });

            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: toBody(sub)
            });
            setIsSubscribed(true);
            toast.success('Notificações ativadas!');
        } catch (error) {
            console.error('Push subscribe error:', error);
            toast.error('Não foi possível ativar as notificações.');
        }
    };

    const unsubscribe = async () => {
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            if (sub) {
                await fetch('/api/push/unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: sub.endpoint })
                });
                await sub.unsubscribe();
            }
            setIsSubscribed(false);
            toast.info('Notificações desativadas');
        } catch (error) {
            console.error('Push unsubscribe error:', error);
            toast.error('Erro ao desativar as notificações.');
        }
    };

    if (!supported) return null;

    return (
        <button
            onClick={isSubscribed ? unsubscribe : subscribe}
            title={isSubscribed ? 'Desativar notificações' : 'Ativar notificações'}
            style={{
                fontSize: '0.8rem',
                padding: '0.5rem 0.8rem',
                border: '1px solid var(--surface-border)',
                borderRadius: '10px',
                background: isSubscribed ? 'var(--primary)' : 'var(--surface)',
                color: isSubscribed ? 'white' : 'var(--foreground-muted)',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
                cursor: 'pointer'
            }}
        >
            {isSubscribed ? '🔔' : '🔕'}
        </button>
    );
}
