'use client';

import { useState } from 'react';
import Icon from './ui/Icon';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window === 'undefined') return 'dark';
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    });

    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
    };

    return (
        <button
            onClick={toggle}
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                color: 'var(--foreground-muted)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--rounded-md, 10px)',
                background: 'var(--surface)',
                cursor: 'pointer'
            }}
        >
            {theme === 'dark' ? <Icon name="sun" size={16} /> : <Icon name="moon" size={16} />}
        </button>
    );
}
