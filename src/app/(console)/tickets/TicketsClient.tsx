'use client';

import { useState, useCallback, useEffect } from 'react';
import Modal from '@/components/Modal';
import StudentIdentifyForm from '@/components/StudentIdentifyForm';
import { toast } from 'sonner';
import { getStudentSession, StudentSession } from '@/lib/studentSession';
import { TicketWithReplies } from '@/lib/data';

const CATEGORY_LABEL: Record<string, string> = {
    GERAL: 'Geral',
    ACADEMICO: 'Acadêmico',
    TECNICO: 'Técnico',
    OUTRO: 'Outro'
};

const CATEGORY_COLOR: Record<string, string> = {
    GERAL: 'var(--primary)',
    ACADEMICO: 'var(--secondary)',
    TECNICO: 'var(--accent)',
    OUTRO: 'var(--warning)'
};

const inputStyle = {
    padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)',
    background: 'var(--surface)', color: 'var(--foreground)'
} as const;

export default function TicketsClient() {
    const [student, setStudent] = useState<StudentSession | null>(() => {
        if (typeof window === 'undefined') return null;
        return getStudentSession();
    });
    const [tickets, setTickets] = useState<TicketWithReplies[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const [expanded, setExpanded] = useState<number | null>(null);

    const loadTickets = useCallback(async (sid: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/tickets?studentId=${sid}`);
            const data = await res.json();
            if (data.success) setTickets(data.tickets);
            else throw new Error(data.error);
        } catch {
            toast.error('Erro ao carregar tickets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (student) loadTickets(student.id);
    }, [student, loadTickets]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!student) return;
        const formData = new FormData(e.currentTarget);
        formData.set('studentId', String(student.id));

        const promise = fetch('/api/tickets/create', { method: 'POST', body: formData }).then(async (res) => {
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Falha ao enviar');
            setIsCreateOpen(false);
            await loadTickets(student.id);
        });

        toast.promise(promise, {
            loading: 'Enviando ticket...',
            success: 'Ticket enviado! Você receberá um retorno em breve.',
            error: 'Erro ao enviar ticket.'
        });
    };

    const handleReply = async (ticketId: number) => {
        if (!student || !replyText.trim()) return;
        const formData = new FormData();
        formData.set('ticketId', String(ticketId));
        formData.set('studentId', String(student.id));
        formData.set('message', replyText.trim());

        const promise = fetch('/api/tickets/reply', { method: 'POST', body: formData }).then(async (res) => {
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Falha ao responder');
            setReplyText('');
            setReplyingTo(null);
            await loadTickets(student.id);
        });

        toast.promise(promise, {
            loading: 'Enviando resposta...',
            success: 'Resposta enviada!',
            error: 'Erro ao enviar resposta.'
        });
    };

    if (!student) {
        return (
            <div className="glass-panel" style={{ maxWidth: '420px', margin: '0 auto', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--primary)' }}>Identifique-se</h2>
                <StudentIdentifyForm onSuccess={(s) => setStudent(s)} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
                        Identificado como <strong>{student.name}</strong> • Matrícula {student.registration}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    style={{
                        padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white',
                        border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
                        boxShadow: '0 4px 12px var(--primary-glow)'
                    }}
                >
                    + Nova Solicitação
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '2rem' }}>Carregando...</p>
            ) : tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--foreground-muted)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Nenhum ticket ainda.</p>
                    <p style={{ fontSize: '0.9rem' }}>Envie sua primeira solicitação!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                    {tickets.map(ticket => (
                        <div key={ticket.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px',
                                            background: CATEGORY_COLOR[ticket.category] || 'var(--surface-card)', color: 'white', textTransform: 'uppercase'
                                        }}>
                                            {CATEGORY_LABEL[ticket.category] || ticket.category}
                                        </span>
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px',
                                            background: ticket.status === 'OPEN' ? 'var(--warning)' : 'var(--success)',
                                            color: ticket.status === 'OPEN' ? 'black' : 'white', textTransform: 'uppercase'
                                        }}>
                                            {ticket.status === 'OPEN' ? 'Aberto' : 'Encerrado'}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{ticket.subject}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <button onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 }}>
                                    {expanded === ticket.id ? 'Recolher ▲' : `Ver conversa (${ticket.replies.length}) ▼`}
                                </button>
                            </div>

                            <p style={{ lineHeight: '1.6', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>{ticket.message}</p>

                            {ticket.attachmentUrl && (
                                <a href={ticket.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    📎 {ticket.fileName || 'Ver anexo'}
                                </a>
                            )}

                            {expanded === ticket.id && (
                                <div style={{ marginTop: '1.25rem', display: 'grid', gap: '0.75rem' }}>
                                    {ticket.replies.map(reply => (
                                        <div key={reply.id} style={{
                                            padding: '0.85rem', borderRadius: '12px', maxWidth: '85%',
                                            background: reply.isAdmin ? 'var(--surface-card)' : 'var(--surface)',
                                            border: reply.isAdmin ? '1px solid var(--primary)' : '1px solid var(--surface-border)',
                                            alignSelf: reply.isAdmin ? 'flex-start' : 'flex-end',
                                            justifySelf: reply.isAdmin ? 'flex-start' : 'flex-end'
                                        }}>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: reply.isAdmin ? 'var(--primary)' : 'var(--foreground-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                                                {reply.isAdmin ? 'Representante' : 'Você'}
                                            </p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>{reply.message}</p>
                                            <p style={{ fontSize: '0.65rem', color: 'var(--foreground-muted)', marginTop: '0.4rem' }}>
                                                {new Date(reply.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}

                                    {ticket.status === 'OPEN' ? (
                                        replyingTo === ticket.id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'flex-end', width: '100%', maxWidth: '85%' }}>
                                                <textarea
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    placeholder="Escreva sua resposta..."
                                                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                                />
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => { setReplyingTo(null); setReplyText(''); }} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid var(--surface-border)', borderRadius: '8px', color: 'var(--foreground-muted)', cursor: 'pointer' }}>
                                                        Cancelar
                                                    </button>
                                                    <button onClick={() => handleReply(ticket.id)} disabled={!replyText.trim()} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                                        Enviar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setReplyingTo(ticket.id)} style={{ alignSelf: 'flex-end', padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                                Responder
                                            </button>
                                        )
                                    ) : (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>Este ticket foi encerrado.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nova Solicitação">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Assunto</label>
                        <input name="subject" required placeholder="Ex: Acesso ao Portal" style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Categoria</label>
                        <select name="category" defaultValue="GERAL" style={inputStyle}>
                            <option value="GERAL">Geral</option>
                            <option value="ACADEMICO">Acadêmico</option>
                            <option value="TECNICO">Técnico</option>
                            <option value="OUTRO">Outro</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Descreva sua solicitação</label>
                        <textarea name="message" required placeholder="Descreva aqui o que você precisa..." style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Anexo (opcional)</label>
                        <input name="file" type="file" style={{ color: 'var(--foreground)', fontSize: '0.85rem' }} />
                    </div>
                    <button type="submit" style={{ padding: '1rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
                        Enviar Solicitação
                    </button>
                </form>
            </Modal>
        </div>
    );
}
