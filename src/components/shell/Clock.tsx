'use client';

import { useState, useEffect } from 'react';

export default function Clock() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        };
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return null;

    return (
        <span className="mono" style={{ fontSize: 'var(--text-base)', color: 'var(--foreground-muted)', letterSpacing: '0.04em' }}>
            {time}
        </span>
    );
}
