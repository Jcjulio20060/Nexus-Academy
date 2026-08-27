'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
        { id: 'grade', group: 'Páginas', label: 'Ver a Grade semanal', hint: '/grade', icon: 'calendar', run: () => go('/grade') },
        { id: 'tickets', group: 'Páginas', label: 'Meus Tickets', hint: '/tickets', icon: 'ticket', run: () => go('/tickets') },
        { id: 'faltas', group: 'Páginas', label: 'Justificar Falta', hint: '/justificativas', icon: 'clipboard', run: () => go('/justificativas') },
        { id: 'materiais', group: 'Páginas', label: 'Materiais de estudo', hint: '/materiais', icon: 'book', run: () => go('/materiais') },
        { id: 'prazos', group: 'Páginas', label: 'Prazos e datas', hint: '/prazos', icon: 'flag', run: () => go('/prazos') },
        { id: 'faq', group: 'Páginas', label: 'Perguntas frequentes', hint: '/faq', icon: 'help', run: () => go('/faq') },
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
                    gap: 'var(--space-1)',
                    padding: 'var(--space-1) var(--space-3)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: 'var(--rounded-md, 10px)',
                    background: 'var(--surface)',
                    color: 'var(--foreground-muted)',
                    cursor: 'pointer'
                }}
            >
                <Icon name="search" size={15} />
            </button>

            {open && createPortal(
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--surface-border)' }}>
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
                                    fontSize: 'var(--text-md)',
                                    fontFamily: 'var(--font-sans)'
                                }}
                            />
                            <kbd className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', border: '1px solid var(--surface-border)', borderRadius: 'var(--rounded-sm, 8px)', padding: '0.1rem 0.35rem' }}>esc</kbd>
                        </div>

                        <div style={{ padding: 'var(--space-2)' }}>
                            {groups.length === 0 && (
                                <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--foreground-muted)', fontSize: 'var(--text-base)' }}>
                                    Nada encontrado para &ldquo;{query}&rdquo;
                                </p>
                            )}
                            {groups.map(g => (
                                <div key={g.group} style={{ marginBottom: 'var(--space-1)' }}>
                                    <p className="label-mono" style={{ padding: 'var(--space-1) var(--space-3) 0.25rem' }}>{g.group}</p>
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
                                                    gap: 'var(--space-3)',
                                                    width: '100%',
                                                    padding: 'var(--space-2) var(--space-3)',
                                                    border: 'none',
                                                    borderRadius: 'var(--rounded-sm, 8px)',
                                                    background: isActive ? 'var(--primary-glow)' : 'transparent',
                                                    color: isActive ? 'var(--primary)' : 'var(--foreground)',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    fontSize: 'var(--text-md)',
                                                    fontFamily: 'var(--font-sans)'
                                                }}
                                            >
                                                <Icon name={item.icon} size={16} />
                                                <span style={{ flex: 1 }}>{item.label}</span>
                                                {item.hint && <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>{item.hint}</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: 'var(--space-2) var(--space-4)', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                            <span>↑↓ navegar</span>
                            <span>↵ abrir</span>
                            <span>esc fechar</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
