'use client';

import { useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { Database } from '@/lib/data';
import { toast } from 'sonner';

interface AdminDashboardClientProps {
    initialData: Database;
}

export default function AdminDashboardClient({ initialData }: AdminDashboardClientProps) {
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState('Monday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayLabels: Record<string, string> = {
        'Monday': 'Segunda-feira',
        'Tuesday': 'Terça-feira',
        'Wednesday': 'Quarta-feira',
        'Thursday': 'Quinta-feira',
        'Friday': 'Sexta-feira'
    };

    // Helper to handle form submission with toast
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: string, successMessage: string, modalSetter: (v: boolean) => void) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const promise = fetch(action, {
            method: 'POST',
            body: formData,
        }).then(async (res) => {
            if (res.ok) {
                modalSetter(false);
                // Force reload to update data
                window.location.reload();
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
        const form = e.currentTarget;
        const formData = new FormData(form);

        const promise = fetch(action, {
            method: 'POST',
            body: formData,
        }).then(async (res) => {
            if (res.ok) window.location.reload();
            else throw new Error('Falha ao excluir');
        });

        toast.promise(promise, {
            loading: 'Excluindo...',
            success: 'Item removido!',
            error: 'Erro ao excluir'
        });
    };

    return (
        <main className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--foreground)' }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/" target="_blank" style={{ padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                        Ver Site
                    </Link>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                {/* Notices Section */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>Avisos Rápidos</h2>
                        <button
                            onClick={() => setIsNoticeModalOpen(true)}
                            style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                        >
                            + Novo Aviso
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {initialData.notices.map(notice => (
                            <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                <span style={{ color: 'var(--foreground)' }}>{notice.message}</span>
                                <form onSubmit={(e) => handleDelete(e, '/api/admin/notices/delete')}>
                                    <input type="hidden" name="id" value={notice.id} />
                                    <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Excluir</button>
                                </form>
                            </div>
                        ))}
                        {initialData.notices.length === 0 && <p style={{ color: 'var(--foreground-muted)' }}>Nenhum aviso ativo.</p>}
                    </div>
                </section>

                {/* Schedule Section */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Grade Horária</h2>
                        <button
                            onClick={() => setIsClassModalOpen(true)}
                            style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                        >
                            + Nova Aula
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {days.map(day => {
                            const classesForDay = initialData.classes.filter(c => c.day === day).sort((a, b) => a.start.localeCompare(b.start));

                            return (
                                <div key={day} style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1rem', color: 'var(--foreground-muted)' }}>{dayLabels[day]}</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {classesForDay.map(cls => (
                                            <div key={cls.id} style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr min-content', gap: '1rem', alignItems: 'center', background: 'var(--surface-card)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--surface-border)' }}>
                                                <span style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>{cls.start} - {cls.end}</span>
                                                <div>
                                                    <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>{cls.subject}</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{cls.room} • {cls.professor}</p>
                                                </div>
                                                <form onSubmit={(e) => handleDelete(e, '/api/admin/classes/delete')}>
                                                    <input type="hidden" name="id" value={cls.id} />
                                                    <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                                                </form>
                                            </div>
                                        ))}
                                        {classesForDay.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>Sem aulas cadastradas.</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Resources Section */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: '#60a5fa' }}>Materiais de Aula</h2>
                        <button
                            onClick={() => setIsResourceModalOpen(true)}
                            style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                        >
                            + Novo Material
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {initialData.resources.map(resource => (
                            <div key={resource.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                <div>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>{resource.title}</a>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{resource.subject}</p>
                                </div>
                                <form onSubmit={(e) => handleDelete(e, '/api/admin/resources/delete')}>
                                    <input type="hidden" name="id" value={resource.id} />
                                    <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Excluir</button>
                                </form>
                            </div>
                        ))}
                        {initialData.resources.length === 0 && <p style={{ color: 'var(--foreground-muted)' }}>Nenhum material cadastrado.</p>}
                    </div>
                </section>

                {/* Events Section */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground-muted)' }}>Eventos & Datas</h2>
                        <button
                            onClick={() => setIsEventModalOpen(true)}
                            style={{ padding: '0.5rem 1rem', background: 'var(--secondary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                        >
                            + Novo Evento
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {initialData.events.map(event => (
                            <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>{event.title}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{event.date} • {event.type}</p>
                                </div>
                                <form onSubmit={(e) => handleDelete(e, '/api/admin/events/delete')}>
                                    <input type="hidden" name="id" value={event.id} />
                                    <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Excluir</button>
                                </form>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Modals */}
            <Modal isOpen={isNoticeModalOpen} onClose={() => setIsNoticeModalOpen(false)} title="Novo Aviso">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/notices/create', 'Aviso criado!', setIsNoticeModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <label style={{ color: 'var(--foreground)' }}>Mensagem</label>
                    <input name="message" required placeholder="Ex: Aula cancelada..." style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginTop: '1rem' }}>Salvar Aviso</button>
                </form>
            </Modal>

            <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title="Novo Material">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/resources/create', 'Material adicionado!', setIsResourceModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Título do Material</label>
                        <input name="title" required placeholder="Ex: Slide Aula 01" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Matéria / Cadeira</label>
                        <input name="subject" required placeholder="Ex: Algoritmos" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Link (URL)</label>
                        <input name="url" type="url" required placeholder="https://drive.google.com/..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginTop: '1rem' }}>Adicionar Material</button>
                </form>
            </Modal>

            <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Novo Evento">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/events/create', 'Evento criado!', setIsEventModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Título</label>
                        <input name="title" required placeholder="Ex: Prova 1" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Data</label>
                        <input name="date" type="date" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Tipo</label>
                        <select name="type" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }}>
                            <option value="exam">Prova</option>
                            <option value="assignment">Trabalho</option>
                            <option value="other">Outro</option>
                        </select>
                    </div>
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--secondary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginTop: '1rem' }}>Salvar Evento</button>
                </form>
            </Modal>

            <Modal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)} title="Nova Aula">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/classes/create', 'Aula adicionada!', setIsClassModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Dia da Semana</label>
                        <select
                            name="day"
                            value={selectedDay}
                            onChange={e => setSelectedDay(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }}
                        >
                            {days.map(d => <option key={d} value={d}>{dayLabels[d]}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Início</label>
                            <input name="start" type="time" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Fim</label>
                            <input name="end" type="time" required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Matéria</label>
                        <input name="subject" required placeholder="Ex: Banco de Dados" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Sala</label>
                        <input name="room" required placeholder="Ex: Lab 01" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Professor</label>
                        <input name="professor" required placeholder="Ex: João Silva" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', marginTop: '1rem' }}>Adicionar Aula</button>
                </form>
            </Modal>
        </main>
    );
}
