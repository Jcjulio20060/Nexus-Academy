'use client';

import { useState } from 'react';

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
                fontSize: '0.8rem',
                color: 'var(--foreground-muted)',
                padding: '0.5rem 0.8rem',
                border: '1px solid var(--surface-border)',
                borderRadius: '10px',
                background: 'var(--surface)',
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
                cursor: 'pointer'
            }}
        >
            {theme === 'dark' ? '☀️' : '🌙'}
        </button>
    );
}
