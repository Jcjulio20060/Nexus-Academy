'use client';

// ... imports ... imported below in FULL REPLACEMENT
import { useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { Database, AcademicEvent } from '@/lib/data';
import { toast } from 'sonner';

interface AdminDashboardClientProps {
    initialData: Database;
}

export default function AdminDashboardClient({ initialData }: AdminDashboardClientProps) {
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
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
            if (res.ok) {
                modalSetter(false);
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
        const formData = new FormData(e.currentTarget);

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
                <h1 style={{ fontSize: '2rem', color: 'var(--foreground)' }}>Admin - Café e Código</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/" target="_blank" style={{ padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                        Ver Site
                    </Link>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {/* Subjects Section */}
                <section className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>Matérias</h2>
                        <button onClick={() => setIsSubjectModalOpen(true)} style={{ padding: '0.5rem', background: 'var(--surface)', border: 'none', borderRadius: '6px', color: 'var(--foreground)', cursor: 'pointer' }}>+</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                        {initialData.subjects.map(sub => (
                            <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--surface-card)', borderRadius: '6px' }}>
                                <span>{sub.name} <small style={{ opacity: 0.5 }}>{sub.code}</small></span>
                                <form onSubmit={(e) => handleDelete(e, '/api/admin/subjects/delete')}>
                                    <input type="hidden" name="id" value={sub.id} />
                                    <button type="submit" style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                </form>
                            </div>
                        ))}
                        {initialData.subjects.length === 0 && <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Nenhuma matéria.</p>}
                    </div>
                </section>

                {/* Professors Section */}
                <section className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>Professores</h2>
                        <button onClick={() => setIsProfessorModalOpen(true)} style={{ padding: '0.5rem', background: 'var(--surface)', border: 'none', borderRadius: '6px', color: 'var(--foreground)', cursor: 'pointer' }}>+</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                        {initialData.professors.map(prof => (
                            <div key={prof.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--surface-card)', borderRadius: '6px' }}>
                                <span>{prof.name}</span>
                                <form onSubmit={(e) => handleDelete(e, '/api/admin/professors/delete')}>
                                    <input type="hidden" name="id" value={prof.id} />
                                    <button type="submit" style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                </form>
                            </div>
                        ))}
                        {initialData.professors.length === 0 && <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Nenhum professor.</p>}
                    </div>
                </section>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {/* Schedule Section */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Grade Horária</h2>
                        <button onClick={() => setIsClassModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>+ Nova Aula</button>
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
                                                    <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>{cls.subject.name}</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{cls.room} • {cls.professor.name}</p>
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
                        <h2 style={{ fontSize: '1.5rem', color: '#60a5fa' }}>Materiais</h2>
                        <button onClick={() => setIsResourceModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>+ Novo Material</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {initialData.resources.map(resource => (
                            <div key={resource.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                <div>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>{resource.title}</a>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{resource.subject.name}</p>
                                </div>
                                <form onSubmit={(e) => handleDelete(e, '/api/admin/resources/delete')}>
                                    <input type="hidden" name="id" value={resource.id} />
                                    <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Excluir</button>
                                </form>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notices */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>Avisos</h2>
                        <button onClick={() => setIsNoticeModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>+ Novo Aviso</button>
                    </div>
                    {initialData.notices.map(notice => (
                        <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--foreground)' }}>{notice.message}</span>
                            <form onSubmit={(e) => handleDelete(e, '/api/admin/notices/delete')}>
                                <input type="hidden" name="id" value={notice.id} />
                                <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Excluir</button>
                            </form>
                        </div>
                    ))}
                </section>

                {/* Deadlines (Datas e Prazos) */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>Datas e Prazos</h2>
                        <button onClick={() => setIsEventModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>+ Nova Data</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {initialData.events.map(event => (
                            <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                <div>
                                    <p style={{ fontWeight: 600, color: 'var(--foreground)' }}>{event.title}</p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
                                        {new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR')} • {event.type === 'exam' ? 'Prova' : event.type === 'project' ? 'Projeto' : 'Trabalho'}
                                    </p>
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

            {/* MODALS */}

            {/* Subject Modal */}
            <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title="Nova Matéria">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/subjects/create', 'Matéria salva!', setIsSubjectModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="name" required placeholder="Nome da Matéria (ex: Cálculo I)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <input name="code" placeholder="Código (opcional, ex: MAT01)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Salvar</button>
                </form>
            </Modal>

            {/* Professor Modal */}
            <Modal isOpen={isProfessorModalOpen} onClose={() => setIsProfessorModalOpen(false)} title="Novo Professor">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/professors/create', 'Professor salvo!', setIsProfessorModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="name" required placeholder="Nome do Professor" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <input name="email" type="email" placeholder="Email (opcional)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--secondary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Salvar</button>
                </form>
            </Modal>

            {/* Class Modal */}
            <Modal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)} title="Nova Aula">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/classes/create', 'Aula adicionada!', setIsClassModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <select name="day" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }}>
                        {days.map(d => <option key={d} value={d}>{dayLabels[d]}</option>)}
                    </select>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input name="start" type="time" required style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                        <input name="end" type="time" required style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    </div>
                    {/* Subject Select */}
                    <select name="subjectId" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }}>
                        <option value="">Selecione a Matéria...</option>
                        {initialData.subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                    {/* Professor Select */}
                    <select name="professorId" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }}>
                        <option value="">Selecione o Professor...</option>
                        {initialData.professors.map(prof => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
                    </select>
                    <input name="room" required placeholder="Sala (ex: Lab 01)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Salvar Aula</button>
                </form>
            </Modal>

            {/* Resource Modal */}
            <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title="Novo Material">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/resources/create', 'Material adicionado!', setIsResourceModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="title" required placeholder="Título do Material" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <input name="url" type="url" required placeholder="Link (URL)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <select name="subjectId" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }}>
                        <option value="">Selecione a Matéria...</option>
                        {initialData.subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Salvar Material</button>
                </form>
            </Modal>

            {/* Event Modal (Datas e Prazos) */}
            <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Nova Data/Prazo">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/events/create', 'Evento criado!', setIsEventModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="title" required placeholder="Título (ex: Prova de Cálculo)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <input name="date" type="date" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <select name="type" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }}>
                        <option value="exam">Prova</option>
                        <option value="assignment">Trabalho</option>
                        <option value="project">Projeto</option>
                        <option value="other">Outro</option>
                    </select>
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--secondary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Salvar Prazo</button>
                </form>
            </Modal>

            {/* Notice Modal */}
            <Modal isOpen={isNoticeModalOpen} onClose={() => setIsNoticeModalOpen(false)} title="Novo Aviso">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/notices/create', 'Aviso criado!', setIsNoticeModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="message" required placeholder="Ex: Aula amanhã será no Lab 02" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)' }} />
                    <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Salvar Aviso</button>
                </form>
            </Modal>

        </main>
    );
}
