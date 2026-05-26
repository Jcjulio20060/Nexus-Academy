'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import { Database, CommunicationPost } from '@/lib/data';
import { toast } from 'sonner';

interface AdminDashboardClientProps {
    initialData: Database;
}

export default function AdminDashboardClient({ initialData }: AdminDashboardClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'academic' | 'content' | 'communication'>('academic');
    
    // Modals
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isClassModalOpen, setIsClassModalOpen] = useState(false);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [isProfessorModalOpen, setIsProfessorModalOpen] = useState(false);
    const [isRepModalOpen, setIsRepModalOpen] = useState(false);
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunicationPost | null>(null);

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
            if (res.ok) router.refresh();
            else throw new Error('Falha ao excluir');
        });

        toast.promise(promise, {
            loading: 'Excluindo...',
            success: 'Item removido!',
            error: 'Erro ao excluir'
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

    const renderTabs = () => (
        <div style={{ 
            display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', 
            background: 'var(--surface-card)', padding: '0.4rem', borderRadius: '14px',
            border: '1px solid var(--surface-border)', width: '100%',
            overflowX: 'auto', scrollbarWidth: 'none'
        }}>
            {[
                { id: 'academic', label: '📖 Acadêmico' },
                { id: 'content', label: '📝 Conteúdo' },
                { id: 'communication', label: '💬 Comunicação' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                        flex: '1 1 auto',
                        padding: '0.75rem 1rem', borderRadius: '10px', border: 'none',
                        background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                        color: activeTab === tab.id ? 'white' : 'var(--foreground-muted)',
                        fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                        whiteSpace: 'nowrap', fontSize: '0.85rem'
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );

    return (
        <main className="container" style={{ padding: '1.5rem 1rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', color: 'var(--foreground)' }}>Admin</h1>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link href="/" style={{ padding: '0.5rem 0.8rem', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--surface-border)', color: 'var(--foreground)', textDecoration: 'none', fontSize: '0.85rem' }}>
                        Ver Site
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{ padding: '0.5rem 0.8rem', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                        Sair
                    </button>
                </div>
            </header>

            {renderTabs()}

            {activeTab === 'academic' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <section className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>Matérias</h2>
                                <button onClick={() => setIsSubjectModalOpen(true)} style={{ padding: '0.5rem', background: 'var(--surface)', border: 'none', borderRadius: '6px', color: 'var(--foreground)', cursor: 'pointer' }}>+</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                                {initialData.subjects.map(sub => (
                                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--surface-card)', borderRadius: '6px' }}>
                                        <span style={{ fontSize: '0.9rem' }}>{sub.name} <small style={{ opacity: 0.5 }}>{sub.code}</small></span>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/subjects/delete')}>
                                            <input type="hidden" name="id" value={sub.id} />
                                            <button type="submit" style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>Professores</h2>
                                <button onClick={() => setIsProfessorModalOpen(true)} style={{ padding: '0.5rem', background: 'var(--surface)', border: 'none', borderRadius: '6px', color: 'var(--foreground)', cursor: 'pointer' }}>+</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                                {initialData.professors.map(prof => (
                                    <div key={prof.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'var(--surface-card)', borderRadius: '6px' }}>
                                        <span style={{ fontSize: '0.9rem' }}>{prof.name}</span>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/professors/delete')}>
                                            <input type="hidden" name="id" value={prof.id} />
                                            <button type="submit" style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>Grade Horária</h2>
                            <button onClick={() => setIsClassModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ Nova Aula</button>
                        </div>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {days.map(day => {
                                const classesForDay = initialData.classes.filter(c => c.day === day).sort((a, b) => a.start.localeCompare(b.start));
                                return (
                                    <div key={day} style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.25rem' }}>
                                        <h3 style={{ marginBottom: '0.75rem', color: 'var(--foreground-muted)', fontSize: '1rem' }}>{dayLabels[day]}</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {classesForDay.map(cls => (
                                                <div key={cls.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '0.75rem', alignItems: 'center', background: 'var(--surface-card)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                                    <span style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{cls.start}</span>
                                                    <div style={{ minWidth: 0 }}>
                                                        <p style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.subject.name}</p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.room} • {cls.professor.name}</p>
                                                    </div>
                                                    <form onSubmit={(e) => handleDelete(e, '/api/admin/classes/delete')}>
                                                        <input type="hidden" name="id" value={cls.id} />
                                                        <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '1.1rem' }}>&times;</button>
                                                    </form>
                                                </div>
                                            ))}
                                            {classesForDay.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', fontStyle: 'italic' }}>Sem aulas.</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'content' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <section className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', color: '#60a5fa' }}>Materiais</h2>
                                <button onClick={() => setIsResourceModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ Novo</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                                {initialData.resources.map(resource => (
                                    <div key={resource.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resource.title}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{resource.subject.name}</p>
                                        </div>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/resources/delete')}>
                                            <input type="hidden" name="id" value={resource.id} />
                                            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', marginLeft: '0.5rem' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', color: 'var(--warning)' }}>FAQ</h2>
                                <button onClick={() => setIsFaqModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ Novo</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                                {initialData.faqs.map(faq => (
                                    <div key={faq.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--surface-card)', borderRadius: '6px' }}>
                                        <span style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{faq.question}</span>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/faq/delete')}>
                                            <input type="hidden" name="id" value={faq.id} />
                                            <button type="submit" style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <section className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>Avisos</h2>
                                <button onClick={() => setIsNoticeModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ Novo</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {initialData.notices.map(notice => (
                                    <div key={notice.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                        <span style={{ color: 'var(--foreground)', fontSize: '0.9rem' }}>{notice.message}</span>
                                        <form onSubmit={(e) => handleDelete(e, '/api/admin/notices/delete')}>
                                            <input type="hidden" name="id" value={notice.id} />
                                            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>&times;</button>
                                        </form>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>Prazos</h2>
                                <button onClick={() => setIsEventModalOpen(true)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>+ Novo</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {initialData.events.map(event => (
                                    <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{event.title}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
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

                    <section className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>Representantes</h2>
                            <button onClick={() => setIsRepModalOpen(true)} style={{ padding: '0.5rem', background: 'var(--surface)', border: 'none', borderRadius: '6px', color: 'var(--foreground)', cursor: 'pointer' }}>+</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                            {initialData.representatives.map(rep => (
                                <div key={rep.id} style={{ flex: '0 0 160px', padding: '1rem', background: 'var(--surface-card)', borderRadius: '12px', border: '1px solid var(--surface-border)', textAlign: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--surface)', margin: '0 auto 0.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', overflow: 'hidden' }}>
                                        {rep.photoUrl ? <img src={rep.photoUrl} alt={rep.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep.name}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{rep.role}</p>
                                    <form onSubmit={(e) => handleDelete(e, '/api/admin/representatives/delete')}>
                                        <input type="hidden" name="id" value={rep.id} />
                                        <button type="submit" style={{ fontSize: '0.7rem', background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>Remover</button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'communication' && (
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Solicitações dos Alunos</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {initialData.communicationPosts.map(post => (
                                <div key={post.id} style={{ 
                                    padding: '1.25rem', background: 'var(--surface-card)', borderRadius: '12px', 
                                    border: `1px solid ${post.status === 'OPEN' ? 'var(--warning)' : 'var(--surface-border)'}`,
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
                                        <div style={{ minWidth: 0 }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.firstName} {post.lastName}</span>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                                            {post.status === 'OPEN' && (
                                                <button 
                                                    onClick={() => { setSelectedPost(post); setIsAnswerModalOpen(true); }}
                                                    style={{ padding: '0.3rem 0.6rem', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                                                >
                                                    Responder
                                                </button>
                                            )}
                                            <form onSubmit={(e) => handleDelete(e, '/api/admin/communication/delete')}>
                                                <input type="hidden" name="id" value={post.id} />
                                                <button type="submit" style={{ padding: '0.3rem 0.6rem', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    Excluir
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--foreground)', fontSize: '0.9rem', marginBottom: post.answer ? '1rem' : '0' }}>{post.question}</p>
                                    {post.answer && (
                                        <div style={{ padding: '0.8rem', background: 'var(--surface)', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
                                            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.25rem' }}>RESPOSTA:</p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{post.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {initialData.communicationPosts.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>Nenhuma solicitação encontrada.</p>}
                        </div>
                    </section>
                </div>
            )}

            {/* MODALS */}
            
            {/* Answer Modal */}
            <Modal isOpen={isAnswerModalOpen} onClose={() => setIsAnswerModalOpen(false)} title="Responder Solicitação">
                {selectedPost && (
                    <form onSubmit={(e) => handleSubmit(e, '/api/admin/communication/answer', 'Resposta enviada!', setIsAnswerModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--surface-card)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>PERGUNTA DE {selectedPost.firstName.toUpperCase()}:</p>
                            <p style={{ fontSize: '0.9rem' }}>{selectedPost.question}</p>
                        </div>
                        <input type="hidden" name="id" value={selectedPost.id} />
                        <textarea name="answer" required placeholder="Sua resposta..." style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', minHeight: '120px', fontSize: '0.9rem' }} />
                        <button type="submit" style={{ padding: '0.85rem', background: 'var(--success)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                            Enviar Resposta
                        </button>
                    </form>
                )}
            </Modal>

            <Modal isOpen={isNoticeModalOpen} onClose={() => setIsNoticeModalOpen(false)} title="Novo Aviso">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/notices/create', 'Aviso criado!', setIsNoticeModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="message" required placeholder="Mensagem do aviso" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <button type="submit" style={{ padding: '0.85rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Nova Data/Prazo">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/events/create', 'Evento criado!', setIsEventModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="title" required placeholder="Título" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <input name="date" type="date" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <select name="type" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                        <option value="exam">Prova</option>
                        <option value="assignment">Trabalho</option>
                        <option value="project">Projeto</option>
                        <option value="other">Outro</option>
                    </select>
                    <button type="submit" style={{ padding: '0.85rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)} title="Nova Aula">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/classes/create', 'Aula adicionada!', setIsClassModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <select name="day" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                        {days.map(d => <option key={d} value={d}>{dayLabels[d]}</option>)}
                    </select>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input name="start" type="time" required style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                        <input name="end" type="time" required style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    </div>
                    <select name="subjectId" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                        <option value="">Matéria...</option>
                        {initialData.subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                    <select name="professorId" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                        <option value="">Professor...</option>
                        {initialData.professors.map(prof => <option key={prof.id} value={prof.id}>{prof.name}</option>)}
                    </select>
                    <input name="room" required placeholder="Sala" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <button type="submit" style={{ padding: '0.85rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} title="Novo Material">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/resources/create', 'Material adicionado!', setIsResourceModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="title" required placeholder="Título" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <input name="url" type="url" required placeholder="Link (URL)" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <select name="subjectId" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                        <option value="">Matéria...</option>
                        {initialData.subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                    </select>
                    <button type="submit" style={{ padding: '0.85rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isSubjectModalOpen} onClose={() => setIsSubjectModalOpen(false)} title="Nova Matéria">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/subjects/create', 'Matéria salva!', setIsSubjectModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="name" required placeholder="Nome" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <input name="code" placeholder="Código" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <button type="submit" style={{ padding: '0.85rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isProfessorModalOpen} onClose={() => setIsProfessorModalOpen(false)} title="Novo Professor">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/professors/create', 'Professor salvo!', setIsProfessorModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="name" required placeholder="Nome" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <input name="email" type="email" placeholder="Email" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <button type="submit" style={{ padding: '0.85rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isRepModalOpen} onClose={() => setIsRepModalOpen(false)} title="Novo Representante">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/representatives/create', 'Representante salvo!', setIsRepModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="name" required placeholder="Nome" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <select name="role" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                        <option value="Representante">Representante</option>
                        <option value="Vice-Representante">Vice-Representante</option>
                    </select>
                    <input name="contact" placeholder="WhatsApp" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <input name="email" type="email" placeholder="E-mail" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <input name="photoUrl" placeholder="Link da Foto" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <button type="submit" style={{ padding: '0.85rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Salvar</button>
                </form>
            </Modal>

            <Modal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} title="Novo FAQ">
                <form onSubmit={(e) => handleSubmit(e, '/api/admin/faq/create', 'FAQ salvo!', setIsFaqModalOpen)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input name="question" required placeholder="Pergunta" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <textarea name="answer" required placeholder="Resposta" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', minHeight: '100px', fontSize: '0.9rem' }} />
                    <input name="order" type="number" defaultValue="0" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface)', color: 'var(--foreground)', fontSize: '0.9rem' }} />
                    <button type="submit" style={{ padding: '0.85rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Salvar</button>
                </form>
            </Modal>
        </main>
    );
}
