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
            setError('Matrícula ou senha incorretos. Verifique e tente de novo.');
        }
    };

    const inputBase: React.CSSProperties = {
        width: '100%',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--rounded-md)',
        background: 'var(--surface)',
        border: '1px solid var(--surface-border)',
        color: 'var(--foreground)',
        fontSize: '0.95rem',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        transition: 'border-color 0.15s ease'
    };

    return (
        <main style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', background: 'var(--background)', overflow: 'hidden' }}>
            <div className="guiche-checkers guiche-checkers--tl" aria-hidden />
            <div className="guiche-checkers guiche-checkers--br" aria-hidden />

            {/* Toalha/painel esquerdo — a identidade do guichê */}
            <div style={{
                flex: '1 1 380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '3rem clamp(1.5rem, 5vw, 4.5rem)'
            }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--foreground)', textDecoration: 'none', marginBottom: '2.5rem' }}>
                    <BrandLogo size={44} />
                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.15rem', lineHeight: 1.1 }}>Coffee &amp; Code</strong>
                        <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--foreground-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>console do aluno</span>
                    </span>
                </Link>

                <p className="label-mono" style={{ color: 'var(--secondary)', margin: '0 0 var(--space-3)' }}>{'// painel de atendimento'}</p>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', lineHeight: 1.06, letterSpacing: '-0.02em', margin: 0, maxWidth: '16ch' }}>
                    Quem está <em style={{ fontStyle: 'normal', color: 'var(--primary)' }}>de serviço</em>?
                </h1>
                <p style={{ color: 'var(--foreground-muted)', fontSize: 'var(--text-lg)', marginTop: 'var(--space-3)', maxWidth: '34ch' }}>
                    Representantes e vices entram com o e-mail cadastrado no painel.
                </p>

                <Link href="/" style={{ marginTop: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', letterSpacing: '0.04em' }}>
                    <Icon name="arrow-left" size={13} />
                    voltar ao console
                </Link>
            </div>

            {/* Cartão de login */}
            <div style={{ flex: '1 1 420px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem clamp(1.5rem, 5vw, 4.5rem) 5rem' }}>
                <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-8)' }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                        <div>
                            <label className="console-label" htmlFor="login-user">Matrícula ou e-mail</label>
                            <input
                                id="login-user"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={inputBase}
                            />
                        </div>
                        <div>
                            <label className="console-label" htmlFor="login-pass">Senha</label>
                            <input
                                id="login-pass"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={inputBase}
                            />
                        </div>

                        {error && (
                            <p style={{ color: 'var(--error)', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <Icon name="alert" size={15} />
                                {error}
                            </p>
                        )}

                        <Button type="submit" fullWidth icon="command" style={{ padding: '0.85rem 1.4rem', fontSize: 'var(--text-md)' }}>
                            Entrar no atendimento
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}