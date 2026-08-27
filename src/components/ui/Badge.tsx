import { ReactNode } from 'react';

export type BadgeTone = 'amber' | 'teal' | 'success' | 'warning' | 'error' | 'neutral';

const tones: Record<BadgeTone, { color: string; background: string }> = {
    amber: { color: 'var(--primary)', background: 'var(--primary-glow)' },
    teal: { color: 'var(--secondary)', background: 'var(--secondary-glow)' },
    success: { color: 'var(--success)', background: 'var(--success-glow)' },
    warning: { color: 'var(--warning-ink)', background: 'var(--warning-glow)' },
    error: { color: 'var(--error)', background: 'var(--error-glow)' },
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
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--rounded-full)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
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
