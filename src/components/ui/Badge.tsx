import { ReactNode } from 'react';

export type BadgeTone = 'amber' | 'teal' | 'success' | 'warning' | 'error' | 'neutral';

const tones: Record<BadgeTone, { color: string; background: string }> = {
    amber: { color: 'var(--primary)', background: 'var(--primary-glow)' },
    teal: { color: 'var(--secondary)', background: 'var(--secondary-glow)' },
    success: { color: 'var(--success)', background: 'rgba(52, 211, 153, 0.14)' },
    warning: { color: '#8a5a00', background: 'var(--warning)' },
    error: { color: 'var(--error)', background: 'rgba(248, 113, 113, 0.14)' },
    neutral: { color: 'var(--foreground-muted)', background: 'var(--surface)' }
};

interface BadgeProps {
    tone?: BadgeTone;
    children: ReactNode;
    className?: string;
}

export default function Badge({ tone = 'neutral', children, className }: BadgeProps) {
    return (
        <span
            className={className}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.18rem 0.6rem',
                borderRadius: '999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color: tones[tone].color,
                background: tones[tone].background
            }}
        >
            {children}
        </span>
    );
}
