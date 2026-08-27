'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';
import { Database, TicketWithReplies, AbsenceWithRelations } from '@/lib/data';
import type { SessionUser } from '@/lib/auth';
import { toast } from 'sonner';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface AdminDashboardClientProps {
    initialData: Database;
    initialTickets: TicketWithReplies[];
    initialAbsences: AbsenceWithRelations[];
    sessionUser: SessionUser;
}

const CATEGORY_LABEL: Record<string, string> = {
    GERAL: 'Geral',
    ACADEMICO: 'Acadêmico',
    TECNICO: 'Técnico',
    OUTRO: 'Outro'
};

const STATUS_LABEL: Record<string, { label: string; color: string; background: string }> = {
    PENDING: { label: 'Pendente', color: 'black', background: 'var(--warning)' },
    APPROVED: { label: 'Aprovada', color: 'white', background: 'var(--success)' },
    REJECTED: { label: 'Reprovada', color: 'white', background: 'var(--error)' }
};

export default function AdminDashboardClient({ sessionUser, initialData, initialTickets, initialAbsences }: AdminDashboardClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'academic' | 'content' | 'tickets' | 'absences'>('academic');

    // Modals
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
    const [isRepModalOpen, setIsRepModalOpen] = useState(false);
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [isTicketReplyModalOpen, setIsTicketReplyModalOpen] = useState(false);
    const [isAbsenceReviewModalOpen, setIsAbsenceReviewModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketWithReplies | null>(null);
    const [selectedAbsence, setSelectedAbsence] = useState<AbsenceWithRelations | null>(null);
    const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

    const [selectedDay, setSelectedDay] = useState('Monday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayLabels: Record<string, string> = {
        'Monday': 'Segunda-feira',
        'Tuesday': 'Terça-feira',
        'Wednesday': 'Quarta-feira',
        'Thursday': 'Quinta-feira',
        'Friday': 'Sexta-feira'
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: string, successMessage: string, modalSetter: (v: boolean) => void) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const promise = fetch(action, {
            method: 'POST',
            body: formData,
        }).then(async (res) => {
            if (res.status === 401) {
                router.push('/admin/login');
                throw new Error('Sessão expirada');
            }
            if (res.ok) {
                modalSetter(false);
                form.reset();
                router.refresh();
            } else {
                throw new Error('Falha ao salvar');
            }
        });

        toast.promise(promise, {
            loading: 'Salvando...',
            success: successMessage,
            error: 'Erro ao salvar!'
        });
    };

    const handleDelete = async (e: React.FormEvent<HTMLFormElement>, action: string) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const promise = fetch(action, {
            method: 'POST',
            body: formData,
        }).then(async (res) => {
            if (res.status === 401) {
                router.push('/admin/login');
                throw new Error('Sessão expirada');
            }
            if (res.ok) router.refresh();
            else throw new Error('Falha ao excluir');
        });

        toast.promise(promise, {
            loading: 'Excluindo...',
            success: 'Item removido!',
            error: 'Erro ao excluir'
        });
    };

    const handleTicketClose = async (ticketId: number) => {
        const formData = new FormData();
        formData.set('id', String(ticketId));

        const promise = fetch('/api/admin/tickets/close', { method: 'POST', body: formData }).then(async (res) => {
            if (res.status === 401) {
                router.push('/admin/login');
                throw new Error('Sessão expirada');
            }
            if (!res.ok) throw new Error('Falha ao encerrar');
            router.refresh();
        });

        toast.promise(promise, {
            loading: 'Encerrando ticket...',
            success: 'Ticket encerrado!',
            error: 'Erro ao encerrar ticket.'
        });
    };

    const handleAbsenceReview = async (status: 'APPROVED' | 'REJECTED') => {
        if (!selectedAbsence) return;
        const form = document.getElementById('absence-review-form') as HTMLFormElement | null;
        const formData = new FormData(form || undefined);
        formData.set('id', String(selectedAbsence.id));
        formData.set('status', status);

        const promise = fetch('/api/admin/absences/review', { method: 'POST', body: formData }).then(async (res) => {
            if (res.status === 401) {
                router.push('/admin/login');
                throw new Error('Sessão expirada');
            }
            if (!res.ok) throw new Error('Falha ao revisar');
            setIsAbsenceReviewModalOpen(false);
            router.refresh();
        });

        toast.promise(promise, {
            loading: 'Salvando...',
            success: status === 'APPROVED' ? 'Justificativa aprovada!' : 'Justificativa reprovada!',
            error: 'Erro ao salvar'
        });
    };

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
            router.push('/admin/login');
        } else {
            toast.error('Erro ao sair');
        }
    };

    const handleTelegramSetup = async () => {
        const promise = fetch('/api/telegram/setup', { method: 'POST' }).then(async (res) => {
            const data = await res.json().catch(() => null);
            if (res.ok && data?.success) return data;
            throw new Error(data?.error || 'Falha ao ativar');
        });

        toast.promise(promise, {
            loading: 'Ativando bot...',
            success: (data) => `Bot ativado: ${data.webhookUrl}`,
            error: (err) => err.message || 'Falha ao ativar Telegram'
        });
    };

    const renderTabs = () => (
        <div style={{
            display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-8)',
            background: 'var(--surface-card)', padding: 'var(--space-1)', borderRadius: 'var(--rounded-xl, 14px)',
            border: '1px solid var(--surface-border)', width: '100%',
            overflowX: 'auto', scrollbarWidth: 'none'
        }}>
            {([
                { id: 'academic', label: 'Acadêmico', icon: 'book' },
                { id: 'content', label: 'Conteúdo', icon: 'file' },
                { id: 'tickets', label: 'Tickets', icon: 'ticket' },
                { id: 'absences', label: 'Faltas', icon: 'clipboard' }
            ] as const).map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                        flex: '1 1 auto',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)',
                        padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--rounded-md, 10px)', border: 'none',
                        background: activeTab === tab.id ? 'var(--accent-strong)' : 'transparent',
                        color: activeTab === tab.id ? 'var(--on-accent)' : 'var(--foreground-muted)',
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        whiteSpace: 'nowrap', fontSize: 'var(--text-base)'
                    }}
                >
                    <Icon name={tab.icon} size={15} />
                    {tab.label}
                </button>
            ))}
        </div>
    );

    const sectionTitle = (label: string, color = 'var(--foreground)') => (
        <h2 className="label-mono" style={{ margin: 0, color }}>
            <span style={{ color: 'var(--primary)' }}>{'//'}</span> {label}
        </h2>
    );

    const smallAddButton = (onClick: () => void) => (
        <Button variant="ghost" size="sm" icon="plus" onClick={onClick} style={{ padding: 'var(--space-1) var(--space-3)' }} />
    );

    return (
        <main className="container" style={{ padding: 'var(--space-6) var(--space-4)', position: 'relative' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                <div>
                    <p className="label-mono" style={{ margin: '0 0 var(--space-1)' }}>{'// mesa de atendimento'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: 'var(--foreground)' }}>Mesa</h1>
                        <Badge tone={sessionUser.role === 'admin' ? 'amber' : 'teal'}>
                            {sessionUser.role === 'admin' ? 'principal' : 'representante'}
                        </Badge>
                    </div>
                    <p className="mono" style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                        em serviço: <span style={{ color: 'var(--primary)' }}>{sessionUser.name}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                    <ThemeToggle />
                    <Button variant="ghost" size="sm" icon="external" href="/">
                        Ver site
                    </Button>
                    <Button variant="ghost" size="sm" icon="zap" onClick={handleTelegramSetup}>
                        Telegram
                    </Button>
                    <Button variant="danger" size="sm" icon="logout" onClick={handleLogout}>
                        Sair
                    </Button>
                </div>
            </header>

            {/* Status do guichê — o resumo do que está pendente na mesa */}
            <section className="glass-panel" style={{ padding: 'var(--space-5) var(--space-6)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span className="live-dot" />
                        <span className="mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
                            na mesa
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        {initialTickets.filter(t => t.status === 'OPEN').length > 0 && (
                            <span className="stamp stamp-warning stamp--rotate">
                                {initialTickets.filter(t => t.status === 'OPEN').length} ticket{initialTickets.filter(t => t.status === 'OPEN').length !== 1 ? 's' : ''} abertos
                            </span>
                        )}
                        {initialAbsences.filter(a => a.status === 'PENDING').length > 0 && (
                            <span className="stamp stamp-warning">
                                {initialAbsences.filter(a => a.status === 'PENDING').length} justificativa{initialAbsences.filter(a => a.status === 'PENDING').length !== 1 ? 's' : ''} pendente{initialAbsences.filter(a => a.status === 'PENDING').length !== 1 ? 's' : ''}
                            </span>
                        )}
                        {initialTickets.filter(t => t.status === 'OPEN').length === 0 && initialAbsences.filter(a => a.status === 'PENDING').length === 0 && (
                            <span className="stamp stamp-success">nada pendente</span>
                        )}
                        <span className="stamp stamp-neutral">
                            {initialData.classes.filter(c => c.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })).length} aula{initialData.classes.filter(c => c.day === new Date().toLocaleDateString('en-US', { weekday: 'long' })).length !== 1 ? 's' : ''} hoje
                        </span>
                    </div>
                </div>
            </section>

            {renderTabs()}

            {activeTab === 'academic' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                        <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                {sectionTitle('matérias', 'var(--accent)')}
                                {smallAddButton(() => setIsSubjectModalOpen(true))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '200px', overflowY: 'auto' }}>
                                {initialData.subjects.map(sub => (
                                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2)', background: 'var(--surface-card)', borderRadius: 'var(--rounded-sm, 8px)' }}>
                                        <span style={{ fontSize: 'var(--text-md)' }}>{sub.name} <small style={{ opacity: 0.5 }}>{sub.code}</small> {sub.period && <small style={{ color: 'var(--secondary)', fontWeight: 600 }}>· {sub.period}</small>}</span>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/subjects/delete')}>
                                            <input type="hidden" name="id" value={sub.id} />
                                            <button type="submit" style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                {sectionTitle('professores', 'var(--accent)')}
                                {smallAddButton(() => setIsProfessorModalOpen(true))}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '200px', overflowY: 'auto' }}>
                                {initialData.professors.map(prof => (
                                    <div key={prof.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2)', background: 'var(--surface-card)', borderRadius: 'var(--rounded-sm, 8px)' }}>
                                        <span style={{ fontSize: 'var(--text-md)' }}>{prof.name}</span>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/professors/delete')}>
                                            <input type="hidden" name="id" value={prof.id} />
                                            <button type="submit" style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                            {sectionTitle('grade horária', 'var(--primary)')}
                            <Button size="sm" icon="plus" onClick={() => setIsClassModalOpen(true)}>Nova aula</Button>
                        </div>
                        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                            {days.map(day => {
                                const classesForDay = initialData.classes.filter(c => c.day === day).sort((a, b) => a.start.localeCompare(b.start));
                                return (
                                    <div key={day} style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: 'var(--space-5)' }}>
                                        <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--foreground-muted)', fontSize: 'var(--text-lg)' }}>{dayLabels[day]}</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                            {classesForDay.map(cls => (
                                                <div key={cls.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 'var(--space-3)', alignItems: 'center', background: 'var(--surface-card)', padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)' }}>
                                                    <span style={{ whiteSpace: 'nowrap', fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)' }}>{cls.start}</span>
                                                    <div style={{ minWidth: 0 }}>
                                                        <p style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: 'var(--text-md)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.subject.name}{cls.subject.period && <span style={{ color: 'var(--secondary)' }}> · {cls.subject.period}</span>}</p>
                                                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.room} • {cls.professor.name}</p>
                                                    </div>
                                                    <form onSubmit={(e) => handleDelete(e, '/api/admin/classes/delete')}>
                                                        <input type="hidden" name="id" value={cls.id} />
                                                        <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 'var(--text-xl)' }}>&times;</button>
                                                    </form>
                                                </div>
                                            ))}
                                            {classesForDay.length === 0 && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>Sem aulas.</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'content' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                        <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                {sectionTitle('materiais', 'var(--secondary)')}
                                <Button size="sm" icon="plus" onClick={() => setIsResourceModalOpen(true)}>Novo</Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '400px', overflowY: 'auto' }}>
                                {initialData.resources.map(resource => (
                                    <div key={resource.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', background: 'var(--surface-card)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontWeight: 600, fontSize: 'var(--text-md)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <span style={{ color: 'var(--primary)', display: 'inline-flex' }}>
                                                    <Icon name={resource.type === 'FILE' ? 'paperclip' : 'file'} size={14} />
                                                </span>
                                                {resource.title}
                                            </p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>{resource.subject.name}{resource.fileName ? ` • ${resource.fileName}` : ''}</p>
                                        </div>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/resources/delete')}>
                                            <input type="hidden" name="id" value={resource.id} />
                                            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', marginLeft: 'var(--space-2)' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                {sectionTitle('faq', 'var(--warning-ink)')}
                                <Button size="sm" icon="plus" onClick={() => setIsFaqModalOpen(true)}>Novo</Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxHeight: '400px', overflowY: 'auto' }}>
                                {initialData.faqs.map(faq => (
                                    <div key={faq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--surface-card)', borderRadius: 'var(--rounded-sm, 8px)' }}>
                                        <span style={{ fontSize: 'var(--text-md)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faq.question}</span>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/faq/delete')}>
                                            <input type="hidden" name="id" value={faq.id} />
                                            <button type="submit" style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
                        <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                {sectionTitle('avisos', 'var(--secondary)')}
                                <Button size="sm" icon="plus" onClick={() => setIsNoticeModalOpen(true)}>Novo</Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {initialData.notices.map(notice => (
                                    <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-4)', background: 'var(--surface-card)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)' }}>
                                        <span style={{ color: 'var(--foreground)', fontSize: 'var(--text-md)' }}>{notice.message}</span>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/notices/delete')}>
                                            <input type="hidden" name="id" value={notice.id} />
                                            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                {sectionTitle('prazos', 'var(--accent)')}
                                <Button size="sm" icon="plus" onClick={() => setIsEventModalOpen(true)}>Novo</Button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {initialData.events.map(event => (
                                    <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', background: 'var(--surface-card)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)' }}>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{event.title}</p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>{new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/events/delete')}>
                                            <input type="hidden" name="id" value={event.id} />
                                            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            {sectionTitle('representantes', 'var(--primary)')}
                            {smallAddButton(() => setIsRepModalOpen(true))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--space-4)', overflowX: 'auto', paddingBottom: 'var(--space-2)', scrollbarWidth: 'none' }}>
                            {initialData.representatives.map(rep => (
                                <div key={rep.id} style={{ flex: '0 0 160px', padding: 'var(--space-4)', background: 'var(--surface-card)', borderRadius: 'var(--rounded-lg, 12px)', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--surface)', margin: '0 auto var(--space-2) auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)', overflow: 'hidden' }}>
                                        {rep.photoUrl ? <Image src={rep.photoUrl} alt={rep.name} width={50} height={50} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                                            <span style={{ color: 'var(--foreground-muted)', display: 'inline-flex' }}>
                                                <Icon name="user" size={20} />
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep.name}</p>
                                    <p style={{ fontSize: 'var(--text-2xs)', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>{rep.role}</p>
                                    <form onSubmit={(e) => handleDelete(e, '/api/admin/representatives/delete')}>
                                        <input type="hidden" name="id" value={rep.id} />
                                        <button type="submit" style={{ fontSize: 'var(--text-2xs)', background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Remover</button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'tickets' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            {sectionTitle('protocolos', 'var(--primary)')}
                            <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                                {initialTickets.length} no total
                            </span>
                        </div>
                        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                            {initialTickets.map(ticket => (
                                <div key={ticket.id} style={{
                                    padding: 'var(--space-5)', background: 'var(--surface-card)', borderRadius: 'var(--rounded-lg, 12px)',
                                    border: `1px solid ${ticket.status === 'OPEN' ? 'var(--warning)' : 'var(--surface-border)'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-1)', flexWrap: 'wrap' }}>
                                                <span className="mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--foreground-muted)' }}>
                                                    Nº {String(ticket.id).padStart(4, '0')}
                                                </span>
                                                <Badge tone="amber">
                                                    {CATEGORY_LABEL[ticket.category] || ticket.category}
                                                </Badge>
                                                <span className={ticket.status === 'OPEN' ? 'stamp stamp-warning stamp--rotate' : 'stamp stamp-neutral'}>
                                                    {ticket.status === 'OPEN' ? 'aberto' : 'encerrado'}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {ticket.subject}
                                            </p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                                                {ticket.student.name} ({ticket.student.registration}) • {new Date(ticket.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-1)', flexShrink: 0, alignItems: 'center' }}>
                                            {ticket.status === 'OPEN' && (
                                                <Button size="sm" icon="reply" onClick={() => { setSelectedTicket(ticket); setIsTicketReplyModalOpen(true); }}>
                                                    Responder
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" onClick={() => handleTicketClose(ticket.id)} disabled={ticket.status !== 'OPEN'}>
                                                {ticket.status === 'OPEN' ? 'Encerrar' : 'Encerrado'}
                                            </Button>
                                            <button onClick={() => setExpandedTicketId(expandedTicketId === ticket.id ? null : ticket.id)} style={{ padding: 'var(--space-1) var(--space-2)', background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: 'var(--rounded-sm, 8px)', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                                                {expandedTicketId === ticket.id ? 'Recolher' : `Conversa (${ticket.replies.length})`}
                                            </button>
                                            <form onSubmit={(e) => handleDelete(e, '/api/admin/tickets/delete')}>
                                                <input type="hidden" name="id" value={ticket.id} />
                                                <button type="submit" title="Remover" aria-label="Remover protocolo" style={{ padding: 'var(--space-1) var(--space-2)', background: 'var(--error-glow)', color: 'var(--error)', border: '1px solid color-mix(in srgb, var(--error) 45%, transparent)', borderRadius: 'var(--rounded-sm, 8px)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                                                    Remover
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-md)', whiteSpace: 'pre-wrap' }}>{ticket.message}</p>
                                    {ticket.attachmentUrl && (
                                        <a href={ticket.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)', color: 'var(--primary)', fontSize: 'var(--text-base)', fontWeight: 600 }}>
                                            <Icon name="paperclip" size={14} /> {ticket.fileName || 'Ver anexo'}
                                        </a>
                                    )}

                                    {expandedTicketId === ticket.id && ticket.replies.length > 0 && (
                                        <div style={{ marginTop: 'var(--space-4)', display: 'grid', gap: 'var(--space-2)' }}>
                                            {ticket.replies.map(reply => (
                                                <div key={reply.id} style={{
                                                    padding: 'var(--space-3)', borderRadius: 'var(--rounded-md, 10px)',
                                                    background: reply.isAdmin ? 'var(--surface)' : 'var(--surface-card)',
                                                    borderLeft: reply.isAdmin ? '3px solid var(--primary)' : '3px solid var(--surface-border)'
                                                }}>
                                                    <p style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: reply.isAdmin ? 'var(--primary)' : 'var(--foreground-muted)', textTransform: 'uppercase' }}>
                                                        {reply.isAdmin ? 'Admin' : ticket.student.name}
                                                    </p>
                                                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>{reply.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {initialTickets.length === 0 && <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--foreground-muted)', fontSize: 'var(--text-md)' }}>Nenhum ticket encontrado.</p>}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'absences' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
                    <section className="glass-panel" style={{ padding: 'var(--space-6)' }}>
                        <div style={{ marginBottom: 'var(--space-6)' }}>{sectionTitle('justificativas', 'var(--primary)')}</div>
                        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                            {initialAbsences.map(item => {
                                const status = STATUS_LABEL[item.status] || STATUS_LABEL.PENDING;
                                return (
                                    <div key={item.id} style={{
                                        padding: 'var(--space-5)', background: 'var(--surface-card)', borderRadius: 'var(--rounded-lg, 12px)',
                                        border: `1px solid ${item.status === 'PENDING' ? 'var(--warning)' : 'var(--surface-border)'}`
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.student.name} ({item.student.registration})
                                                </p>
                                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--foreground-muted)' }}>
                                                    {item.subject?.name || 'Matéria removida'}{item.subject?.period && <span style={{ color: 'var(--secondary)' }}> · {item.subject.period}</span>} • {new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--space-1)', flexShrink: 0, alignItems: 'center' }}>
                                                <span className={item.status === 'PENDING' ? 'stamp stamp-warning' : item.status === 'APPROVED' ? 'stamp stamp-success' : 'stamp stamp-error'}>
                                                    {status.label}
                                                </span>
                                                {item.status === 'PENDING' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        icon="clipboard"
                                                        onClick={() => { setSelectedAbsence(item); setIsAbsenceReviewModalOpen(true); }}
                                                    >
                                                        Revisar
                                                    </Button>
                                                )}
                                                <form onSubmit={(e) => handleDelete(e, '/api/admin/absences/delete')}>
                                                    <input type="hidden" name="id" value={item.id} />
                                                    <button type="submit" title="Remover" aria-label="Remover justificativa" style={{ padding: 'var(--space-2) var(--space-3)', background: 'var(--surface)', color: 'var(--error)', border: '1px solid var(--surface-border)', borderRadius: 'var(--rounded-md)', cursor: 'pointer', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                                                        Remover
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-md)', whiteSpace: 'pre-wrap' }}>{item.reason}</p>
                                        {item.attachmentUrl && (
                                        <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)', color: 'var(--primary)', fontSize: 'var(--text-base)', fontWeight: 600 }}>
                                            <Icon name="paperclip" size={14} /> {item.fileName || 'Ver anexo'}
                                        </a>
                                        )}
                                        {item.status !== 'PENDING' && item.adminNote && (
                                            <div style={{ padding: 'var(--space-3)', background: 'var(--surface)',     borderRadius: 'var(--rounded-sm, 8px)', borderLeft: `3px solid ${item.status === 'APPROVED' ? 'var(--success)' : 'var(--error)'}`, marginTop: 'var(--space-3)' }}>
                                                <p style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--foreground-muted)', marginBottom: 'var(--space-1)' }}>OBSERVAÇÃO:</p>
                                                <p style={{ fontSize: 'var(--text-base)', color: 'var(--foreground-muted)' }}>{item.adminNote}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {initialAbsences.length === 0 && <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--foreground-muted)', fontSize: 'var(--text-md)' }}>Nenhuma justificativa encontrada.</p>}
                        </div>
                    </section>
                </div>
            )}

            {/* MODALS */}

            {/* Ticket Reply Modal */}
            <Modal isOpen={isTicketReplyModalOpen} onClose={() => setIsTicketReplyModalOpen(false)} title="Responder Ticket">
                {selectedTicket && (
                    <form onSubmit={(e) => handleSubmit(e, '/api/admin/tickets/reply', 'Resposta enviada!', setIsTicketReplyModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ padding: 'var(--space-4)', background: 'var(--surface-card)',     borderRadius: 'var(--rounded-sm, 8px)', marginBottom: 'var(--space-2)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
                                {selectedTicket.student.name.toUpperCase()} — {selectedTicket.subject.toUpperCase()}
                            </p>
                            <p style={{ fontSize: 'var(--text-md)' }}>{selectedTicket.message}</p>
                        </div>
                        <input type="hidden" name="ticketId" value={selectedTicket.id} />
                        <textarea name="message" required placeholder="Sua resposta..." style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', minHeight: '120px', fontSize: 'var(--text-md)' }} />
                        <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--success)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-success)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>
                            Enviar Resposta
                        </button>
                    </form>
                )}
            </Modal>

            {/* Absence Review Modal */}
            <Modal isOpen={isAbsenceReviewModalOpen} onClose={() => setIsAbsenceReviewModalOpen(false)} title="Revisar Justificativa">
                {selectedAbsence && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div style={{ padding: 'var(--space-4)', background: 'var(--surface-card)', borderRadius: 'var(--rounded-sm, 8px)' }}>
                            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
                                {selectedAbsence.student.name.toUpperCase()} — {selectedAbsence.subject?.name?.toUpperCase()}
                            </p>
                            <p style={{ fontSize: 'var(--text-base)', color: 'var(--foreground-muted)', marginBottom: 'var(--space-2)' }}>
                                {new Date(selectedAbsence.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                            <p style={{ fontSize: 'var(--text-md)' }}>{selectedAbsence.reason}</p>
                            {selectedAbsence.attachmentUrl && (
                                <a href={selectedAbsence.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)', color: 'var(--primary)', fontSize: 'var(--text-base)', fontWeight: 600 }}>
                                    <Icon name="paperclip" size={14} /> {selectedAbsence.fileName || 'Ver anexo'}
                                </a>
                            )}
                        </div>
                        <form id="absence-review-form" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <textarea name="adminNote" placeholder="Observação (opcional)" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', minHeight: '80px', fontSize: 'var(--text-md)' }} />
                        </form>
                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button onClick={() => handleAbsenceReview('APPROVED')} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)', padding: 'var(--space-3)', background: 'var(--success)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-success)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>
                                <Icon name="check" size={16} /> Aprovar
                            </button>
                            <button onClick={() => handleAbsenceReview('REJECTED')} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)', padding: 'var(--space-3)', background: 'var(--error)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-error)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>
                                <Icon name="x" size={16} /> Reprovar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={isNoticeModalOpen} onClose={() => setIsNoticeModalOpen(false)} title="Novo Aviso">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/notices/create', 'Aviso criado!', setIsNoticeModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <input name="message" required placeholder="Mensagem do aviso" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--accent-strong)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-accent)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Nova Data/Prazo">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/events/create', 'Evento criado!', setIsEventModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <input name="title" required placeholder="Título" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <input name="date" type="date" required style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <select name="type" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }}>
                        <option value="exam">Prova</option>
                        <option value="assignment">Trabalho</option>
                        <option value="project">Projeto</option>
                        <option value="other">Outro</option>
                    </select>
                    <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--accent-strong)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-accent)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)} title="Nova Aula">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/classes/create', 'Aula adicionada!', setIsClassModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <select name="day" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }}>
                        {days.map(d => <option key={d} value={d}>{dayLabels[d]}</option>)}
                    </select>
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        <input name="start" type="time" required style={{ flex: 1, padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                        <input name="end" type="time" required style={{ flex: 1, padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    </div>
                    <select name="subjectId" required style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }}>
                        <option value="">Matéria...</option>
                        {initialData.subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}{sub.period ? ` · ${sub.period}` : ''}</option>)}
                    </select>
                    <select name="professorId" required style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }}>
                        <option value="">Professor...</option>
                        {initialData.professors.map(prof => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
                    </select>
                    <input name="room" required placeholder="Sala" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--accent-strong)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-accent)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title="Novo Material">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/resources/create', 'Material adicionado!', setIsResourceModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <input name="title" required placeholder="Título" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--foreground-muted)' }}>Link (URL) — ou envie um arquivo abaixo</label>
                        <input name="url" type="url" placeholder="https://..." style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--foreground-muted)' }}>Ou envie um arquivo</label>
                        <input name="file" type="file" style={{ color: 'var(--foreground)', fontSize: 'var(--text-base)' }} />
                    </div>
                    <select name="subjectId" required style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }}>
                        <option value="">Matéria...</option>
                        {initialData.subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}{sub.period ? ` · ${sub.period}` : ''}</option>)}
                    </select>
                    <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--accent-strong)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-accent)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title="Nova Matéria">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/subjects/create', 'Matéria salva!', setIsSubjectModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <input name="name" required placeholder="Nome" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <input name="code" placeholder="Código" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <input name="period" placeholder="Semestre (ex.: 2026/2)" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--accent-strong)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-accent)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isProfessorModalOpen} onClose={() => setIsProfessorModalOpen(false)} title="Novo Professor">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/professors/create', 'Professor salvo!', setIsProfessorModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <input name="name" required placeholder="Nome" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <input name="email" type="email" placeholder="Email" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--accent-strong)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-accent)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isRepModalOpen} onClose={() => setIsRepModalOpen(false)} title="Novo Representante">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/representatives/create', 'Representante salvo!', setIsRepModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <input name="name" required placeholder="Nome" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <select name="role" required style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }}>
                        <option value="Representante">Representante</option>
                        <option value="Vice-Representante">Vice-Representante</option>
                    </select>
                    <input name="contact" placeholder="WhatsApp" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <input name="email" type="email" placeholder="E-mail (usado para login)" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--foreground-muted)' }}>Senha de acesso ao painel</label>
                        <input name="password" type="password" placeholder="Senha (opcional)" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    </div>
                    <input name="photoUrl" placeholder="Link da Foto" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--accent-strong)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-accent)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} title="Novo FAQ">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/faq/create', 'FAQ salvo!', setIsFaqModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <input name="question" required placeholder="Pergunta" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <textarea name="answer" required placeholder="Resposta" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', minHeight: '100px', fontSize: 'var(--text-md)' }} />
                    <input name="order" type="number" defaultValue="0" style={{ padding: 'var(--space-3)',     borderRadius: 'var(--rounded-sm, 8px)', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: 'var(--text-md)' }} />
                    <button type="submit" style={{ padding: 'var(--space-3)', background: 'var(--accent-strong)', border: 'none', borderRadius: 'var(--rounded-md)', color: 'var(--on-accent)', fontWeight: 600, cursor: 'pointer', fontSize: 'var(--text-md)' }}>Salvar</button>
                </form>
            </Modal>
        </main>
    );
}
