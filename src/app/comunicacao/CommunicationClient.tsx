'use client';

import { useState } from 'react';
import { CommunicationPost } from '@/lib/data';
import Modal from '@/components/Modal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CommunicationClientProps {
    initialPosts: CommunicationPost[];
}

export default function CommunicationClient({ initialPosts }: CommunicationClientProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<'OPEN' | 'CLOSED'>('OPEN');

    const filteredPosts = initialPosts.filter(post => post.status === filter);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const promise = fetch('/api/communication/create', {
            method: 'POST',
            body: formData,
        }).then(async (res) => {
            if (res.ok) {
                setIsModalOpen(false);
                router.refresh();
            } else {
                throw new Error('Falha ao enviar');
            }
        });

        toast.promise(promise, {
            loading: 'Enviando pergunta...',
            success: 'Pergunta enviada! Você receberá um retorno em breve.',
            error: 'Erro ao enviar pergunta.'
        });
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface-card)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                    <button 
                        onClick={() => setFilter('OPEN')}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                            background: filter === 'OPEN' ? 'var(--primary)' : 'transparent',
                            color: filter === 'OPEN' ? 'white' : 'var(--foreground-muted)',
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        Abertas
                    </button>
                    <button 
                        onClick={() => setFilter('CLOSED')}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                            background: filter === 'CLOSED' ? 'var(--primary)' : 'transparent',
                            color: filter === 'CLOSED' ? 'white' : 'var(--foreground-muted)',
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        Respondidas
                    </button>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white',
                        border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
                        boxShadow: '0 4px 12px var(--primary-glow)'
                    }}
                >
                    + Nova Pergunta
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {filteredPosts.map(post => (
                    <div key={post.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{post.firstName} {post.lastName}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                                    {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <span style={{ 
                                fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px',
                                background: post.status === 'OPEN' ? 'var(--warning)' : 'var(--success)',
                                color: post.status === 'OPEN' ? 'black' : 'white',
                                textTransform: 'uppercase'
                            }}>
                                {post.status === 'OPEN' ? 'Aguardando' : 'Respondida'}
                            </span>
                        </div>
                        <p style={{ lineHeight: '1.6', color: 'var(--foreground)', marginBottom: post.answer ? '1.5rem' : '0' }}>
                            {post.question}
                        </p>
                        {post.answer && (
                            <div style={{ 
                                padding: '1rem', background: 'var(--surface-card)', borderRadius: '12px', 
                                borderLeft: '4px solid var(--primary)', marginTop: '1rem'
                            }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                    Resposta do Representante:
                                </p>
                                <p style={{ fontSize: '0.95rem', color: 'var(--foreground-muted)', lineHeight: '1.5' }}>
                                    {post.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
                {filteredPosts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--foreground-muted)' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Nada por aqui ainda.</p>
                        <p style={{ fontSize: '0.9rem' }}>Seja o primeiro a enviar uma dúvida!</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Pergunta">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Nome</label>
                            <input name="firstName" required placeholder="Ex: João" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Sobrenome</label>
                            <input name="lastName" required placeholder="Ex: Silva" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Sua Dúvida ou Solicitação</label>
                        <textarea name="question" required placeholder="Descreva aqui o que você precisa..." style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', minHeight: '120px', resize: 'vertical' }} />
                    </div>
                    <button type="submit" style={{ padding: '1rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
                        Enviar Solicitação
                    </button>
                </form>
            </Modal>
        </div>
    );
}
