'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            router.push('/admin/dashboard');
        } else {
            setError('Credenciais inválidas');
        }
    };

    const inputBase: React.CSSProperties = {
        width: '100%',
        padding: '0.9rem 1rem',
        borderRadius: '10px',
        background: 'var(--surface)',
        border: '1px solid var(--surface-border)',
        color: 'var(--foreground)',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.15s ease'
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '1rem' }}>
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, var(--surface-border) 1px, transparent 1px)', backgroundSize: '26px 26px', opacity: 0.4 }} />
            <div className="glass-panel" style={{ position: 'relative', padding: '3rem', width: '100%', maxWidth: '400px' }}>
                <Link href="/" style={{ position: 'absolute', top: '1.25rem', left: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--foreground-muted)', textDecoration: 'none', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                    <Icon name="arrow-left" size={13} />
                    console
                </Link>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p className="label-mono" style={{ marginBottom: '1.25rem' }}>{'// acesso restrito'}</p>
                    <BrandLogo size={56} className="brand-logo-glow" />
                    <h1 style={{ marginTop: '1rem', fontSize: '1.4rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Admin Access</h1>
                    <p className="mono" style={{ color: 'var(--foreground-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>Coffee &amp; Code</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Usuário ou e-mail"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputBase}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputBase}
                    />
                    <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)', margin: 0, lineHeight: 1.5 }}>
                        Representantes e vice entram com o e-mail cadastrado no painel.
                    </p>
                    {error && (
                        <p style={{ color: 'var(--error)', textAlign: 'center', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            <Icon name="alert" size={13} /> {error}
                        </p>
                    )}
                    <Button type="submit" fullWidth icon="command" style={{ marginTop: '0.5rem' }}>
                        Entrar
                    </Button>
                </form>
            </div>
        </main>
    );
}
