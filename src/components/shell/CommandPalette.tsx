'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Icon, { IconName } from '../ui/Icon';

interface PaletteItem {
    id: string;
    group: string;
    label: string;
    hint?: string;
    icon: IconName;
    run: () => void;
}

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState(0);
    const [prev, setPrev] = useState({ q: '', o: false });
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const go = useCallback((path: string) => {
        setOpen(false);
        setQuery('');
        router.push(path);
    }, [router]);

    const toggleTheme = useCallback(() => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
        setOpen(false);
        setQuery('');
    }, []);

    const items: PaletteItem[] = [
        { id: 'home', group: 'Páginas', label: 'Ir para o Início', hint: '/', icon: 'home', run: () => go('/') },
        { id: 'tickets', group: 'Páginas', label: 'Meus Tickets', hint: '/tickets', icon: 'ticket', run: () => go('/tickets') },
        { id: 'faltas', group: 'Páginas', label: 'Justificar Falta', hint: '/justificativas', icon: 'clipboard', run: () => go('/justificativas') },
        { id: 'admin', group: 'Páginas', label: 'Painel Admin', hint: '/admin/login', icon: 'building', run: () => go('/admin/login') },
        { id: 'novo-ticket', group: 'Ações', label: 'Abrir um ticket', icon: 'ticket', run: () => go('/tickets') },
        { id: 'nova-falta', group: 'Ações', label: 'Justificar uma falta', icon: 'clipboard', run: () => go('/justificativas') },
        { id: 'tema', group: 'Ações', label: 'Alternar tema claro/escuro', icon: 'sun', run: toggleTheme }
    ];

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isTyping = (e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA';
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(o => !o);
            } else if (e.key === '/' && !isTyping && !open) {
                e.preventDefault();
                setOpen(true);
            } else if (e.key === 'Escape' && open) {
                setOpen(false);
                setQuery('');
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open]);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 20);
        }
    }, [open]);

    if (prev.o !== open || prev.q !== query) {
        setPrev({ q: query, o: open });
        setIndex(0);
    }

    const filtered = items.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        (i.hint ?? '').toLowerCase().includes(query.toLowerCase())
    );

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIndex(i => (i + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setIndex(i => (i - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            filtered[index]?.run();
        }
    };

    const groups: { group: string; items: PaletteItem[] }[] = [];
    filtered.forEach(i => {
        const existing = groups.find(g => g.group === i.group);
        if (existing) existing.items.push(i);
        else groups.push({ group: i.group, items: [i] });
    });

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                title="Buscar (Ctrl+K ou /)"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.7rem',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '10px',
                    background: 'var(--surface)',
                    color: 'var(--foreground-muted)',
                    cursor: 'pointer'
                }}
            >
                <Icon name="search" size={15} />
            </button>

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingTop: '12vh'
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            maxWidth: '520px',
                            maxHeight: '60vh',
                            overflowY: 'auto',
                            background: 'var(--background)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.1rem', borderBottom: '1px solid var(--surface-border)' }}>
                            <Icon name="search" size={16} />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="Buscar páginas e ações..."
                                style={{
                                    flex: 1,
                                    background: 'none',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--foreground)',
                                    fontSize: '0.95rem',
                                    fontFamily: 'var(--font-sans)'
                                }}
                            />
                            <kbd className="mono" style={{ fontSize: '0.66rem', color: 'var(--foreground-muted)', border: '1px solid var(--surface-border)', borderRadius: '5px', padding: '0.1rem 0.35rem' }}>esc</kbd>
                        </div>

                        <div style={{ padding: '0.5rem' }}>
                            {groups.length === 0 && (
                                <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>
                                    Nada encontrado para &ldquo;{query}&rdquo;
                                </p>
                            )}
                            {groups.map(g => (
                                <div key={g.group} style={{ marginBottom: '0.25rem' }}>
                                    <p className="label-mono" style={{ padding: '0.4rem 0.75rem 0.25rem' }}>{g.group}</p>
                                    {g.items.map(item => {
                                        const isActive = filtered.indexOf(item) === index;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={item.run}
                                                onMouseEnter={() => setIndex(filtered.indexOf(item))}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.7rem',
                                                    width: '100%',
                                                    padding: '0.6rem 0.75rem',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    background: isActive ? 'var(--primary-glow)' : 'transparent',
                                                    color: isActive ? 'var(--primary)' : 'var(--foreground)',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    fontSize: '0.9rem',
                                                    fontFamily: 'var(--font-sans)'
                                                }}
                                            >
                                                <Icon name={item.icon} size={16} />
                                                <span style={{ flex: 1 }}>{item.label}</span>
                                                {item.hint && <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--foreground-muted)' }}>{item.hint}</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '1rem', fontSize: '0.68rem', color: 'var(--foreground-muted)' }}>
                            <span>↑↓ navegar</span>
                            <span>↵ abrir</span>
                            <span>esc fechar</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
