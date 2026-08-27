'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import Icon, { IconName } from './Icon';

type Variant = 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps {
    children?: ReactNode;
    variant?: Variant;
    size?: Size;
    icon?: IconName;
    href?: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
    title?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const variantStyle: Record<Variant, React.CSSProperties> = {
    primary: {
        background: 'var(--accent-strong)',
        color: 'var(--on-accent)',
        border: '1px solid transparent',
        boxShadow: '0 1px 2px rgba(36, 28, 20, 0.12)'
    },
    ghost: {
        background: 'var(--surface)',
        color: 'var(--foreground)',
        border: '1px solid var(--surface-border)'
    },
    danger: {
        background: 'var(--error-glow)',
        color: 'var(--error)',
        border: '1px solid color-mix(in srgb, var(--error) 45%, transparent)'
    }
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    icon,
    href,
    onClick,
    type = 'button',
    title,
    disabled,
    fullWidth,
    style,
    className
}: ButtonProps) {
    const base: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        borderRadius: 'var(--rounded-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.15s ease, opacity 0.15s ease, background 0.15s ease',
        textDecoration: 'none',
        ...variantStyle[variant],
        ...(size === 'sm' ? { padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-sm)' } : { padding: 'var(--space-3) var(--space-5)', fontSize: 'var(--text-md)' }),
        ...(fullWidth ? { width: '100%' } : {}),
        ...style
    };

    const inner = (
        <>
            {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
            {children}
        </>
    );

    if (href) {
        return (
            <Link href={href} onClick={onClick} title={title} style={base} className={className}>
                {inner}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} title={title} disabled={disabled} style={base} className={className}>
            {inner}
        </button>
    );
}
