'use client';

import { useState, useCallback, useEffect } from 'react';
import Modal from '@/components/Modal';
import StudentIdentifyForm from '@/components/StudentIdentifyForm';
import { toast } from 'sonner';
import { getStudentSession, StudentSession } from '@/lib/studentSession';
import { TicketWithReplies } from '@/lib/data';
import Card from '@/components/ui/Card';
import Badge, { BadgeTone } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

const CATEGORY_LABEL: Record<string, string> = {
    GERAL: 'Geral',
    ACADEMICO: 'Acadêmico',
    TECNICO: 'Técnico',
    OUTRO: 'Outro'
};

const CATEGORY_TONE: Record<string, BadgeTone> = {
    GERAL: 'amber',
    ACADEMICO: 'teal',
    TECNICO: 'neutral',
    OUTRO: 'warning'
};

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
                <p className="console-label" style={{ marginBottom: '1rem' }}>Identifique-se</p>
                <StudentIdentifyForm onSuccess={(s) => setStudent(s)} />
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                    <span style={{ color: 'var(--primary)' }}>{student.name}</span> · {student.registration}
                </p>
                <Button icon="plus" onClick={() => setIsCreateOpen(true)}>
                    Nova solicitação
                </Button>
            </div>

            {loading ? (
                <p className="mono" style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '2rem' }}>carregando...</p>
            ) : tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--foreground-muted)' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Nenhum ticket ainda.</p>
                    <p style={{ fontSize: '0.9rem' }}>Envie sua primeira solicitação de suporte.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {tickets.map(ticket => (
                        <Card key={ticket.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                        <Badge tone={CATEGORY_TONE[ticket.category] || 'neutral'}>
                                            {CATEGORY_LABEL[ticket.category] || ticket.category}
                                        </Badge>
                                        <Badge tone={ticket.status === 'OPEN' ? 'warning' : 'success'}>
                                            {ticket.status === 'OPEN' ? 'aberto' : 'encerrado'}
                                        </Badge>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{ticket.subject}</h3>
                                    <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>
                                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={expanded === ticket.id ? 'chevron-up' : 'message'}
                                    onClick={() => setExpanded(expanded === ticket.id ? null : ticket.id)}
                                >
                                    {expanded === ticket.id ? 'Recolher' : `Conversa (${ticket.replies.length})`}
                                </Button>
                            </div>

                            <p style={{ lineHeight: '1.6', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>{ticket.message}</p>

                            {ticket.attachmentUrl && (
                                <a href={ticket.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <Icon name="paperclip" size={14} />
                                    {ticket.fileName || 'Ver anexo'}
                                </a>
                            )}

                            {expanded === ticket.id && (
                                <div style={{ marginTop: '1.25rem', display: 'grid', gap: '0.75rem' }}>
                                    {ticket.replies.map(reply => (
                                        <div
                                            key={reply.id}
                                            style={{
                                                padding: '0.85rem 1rem', borderRadius: '12px', maxWidth: '85%',
                                                background: reply.isAdmin ? 'var(--surface-card)' : 'var(--surface)',
                                                border: reply.isAdmin ? '1px solid color-mix(in srgb, var(--primary) 45%, transparent)' : '1px solid var(--surface-border)',
                                                alignSelf: reply.isAdmin ? 'flex-start' : 'flex-end',
                                                justifySelf: reply.isAdmin ? 'flex-start' : 'flex-end'
                                            }}
                                        >
                                            <p className="mono" style={{ fontSize: '0.68rem', fontWeight: 700, color: reply.isAdmin ? 'var(--primary)' : 'var(--foreground-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                                                {reply.isAdmin ? 'Representante' : 'Você'}
                                            </p>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>{reply.message}</p>
                                            <p className="mono" style={{ fontSize: '0.62rem', color: 'var(--foreground-muted)', marginTop: '0.4rem' }}>
                                                {new Date(reply.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    ))}

                                    {ticket.status === 'OPEN' ? (
                                        replyingTo === ticket.id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignSelf: 'flex-end', width: '100%', maxWidth: '85%' }}>
                                                <textarea
                                                    className="console-textarea"
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    placeholder="Escreva sua resposta..."
                                                />
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <Button variant="ghost" size="sm" onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                                                        Cancelar
                                                    </Button>
                                                    <Button size="sm" icon="send" onClick={() => handleReply(ticket.id)} disabled={!replyText.trim()}>
                                                        Enviar
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ alignSelf: 'flex-end' }}>
                                                <Button size="sm" icon="send" onClick={() => setReplyingTo(ticket.id)}>
                                                    Responder
                                                </Button>
                                            </div>
                                        )
                                    ) : (
                                        <p className="mono" style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>
                                            Este ticket foi encerrado.
                                        </p>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nova solicitação">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label className="console-label">Assunto</label>
                        <input name="subject" required placeholder="Ex: Acesso ao portal" className="console-input" />
                    </div>
                    <div>
                        <label className="console-label">Categoria</label>
                        <select name="category" defaultValue="GERAL" className="console-select">
                            <option value="GERAL">Geral</option>
                            <option value="ACADEMICO">Acadêmico</option>
                            <option value="TECNICO">Técnico</option>
                            <option value="OUTRO">Outro</option>
                        </select>
                    </div>
                    <div>
                        <label className="console-label">Descreva sua solicitação</label>
                        <textarea name="message" required placeholder="Descreva aqui o que você precisa..." className="console-textarea" />
                    </div>
                    <div>
                        <label className="console-label">Anexo (opcional)</label>
                        <input name="file" type="file" className="console-input" style={{ padding: '0.5rem' }} />
                    </div>
                    <Button type="submit" fullWidth icon="send">
                        Enviar solicitação
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
