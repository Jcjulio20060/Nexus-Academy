'use client';

import { useState, useEffect } from 'react';
import { Database, ClassSessionWithRelations, ResourceWithRelations, AcademicEvent } from '@/lib/data';
import CurrentClass from '@/components/CurrentClass';
import UpcomingList from '@/components/UpcomingList';
import ImportantDates from '@/components/ImportantDates';
// Sub-component for Material Filtering
function ResourcesView({ resources, subjects }: { resources: ResourceWithRelations[], subjects: string[] }) {
    const [selectedSubject, setSelectedSubject] = useState<string>('all');

    const filteredResources = selectedSubject === 'all'
        ? resources
        : resources.filter(r => r.subject.name === selectedSubject);

    const groupedResources = filteredResources.reduce((acc, curr) => {
        const subName = curr.subject.name;
        if (!acc[subName]) acc[subName] = [];
        acc[subName].push(curr);
        return acc;
    }, {} as Record<string, typeof resources>);

    const activeSubjects = Object.keys(groupedResources).sort();

    return (
        <div className="animate-fade-in">
            <div style={{ maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    style={{
                        width: '100%', padding: '0.8rem', borderRadius: '12px',
                        background: 'var(--surface)', border: '1px solid var(--surface-border)',
                        color: 'var(--foreground)', cursor: 'pointer', outline: 'none'
                    }}
                >
                    <option value="all">Todas as Matérias</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {activeSubjects.map(subject => (
                    <section key={subject} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
                            {subject}
                        </h3>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {groupedResources[subject].map(resource => (
                                <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" style={{
                                    display: 'flex', alignItems: 'center', padding: '0.75rem',
                                    background: 'var(--surface-hover)', borderRadius: '10px',
                                    textDecoration: 'none', transition: 'transform 0.2s',
                                    border: '1px solid var(--surface-border)'
                                }}>
                                    <div style={{ marginRight: '1rem', fontSize: '1.2rem' }}>📄</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, color: 'var(--foreground)', fontSize: '1rem' }}>{resource.title}</p>
                                    </div>
                                    <div style={{ color: 'var(--primary)' }}>➜</div>
                                </a>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}


interface HomeClientProps {
    classesToday: ClassSessionWithRelations[];
    db: Database;
}

export default function HomeClient({ classesToday, db }: HomeClientProps) {
    const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'resources' | 'calendar'>('home');
    const [currentClass, setCurrentClass] = useState<ClassSessionWithRelations | null>(null);
    const [upcomingClasses, setUpcomingClasses] = useState<ClassSessionWithRelations[]>([]);

    useEffect(() => {
        const updateClasses = () => {
            const now = new Date();
            const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            const current = classesToday.find(c =>
                currentTime >= c.start && currentTime <= c.end
            ) || null;

            const upcoming = classesToday.filter(c => c.start > currentTime);

            setCurrentClass(current);
            setUpcomingClasses(upcoming);
        };

        updateClasses();
        const interval = setInterval(updateClasses, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [classesToday]);

    const dayLabels: Record<string, string> = {
        'Monday': 'Segunda-feira',
        'Tuesday': 'Terça-feira',
        'Wednesday': 'Quarta-feira',
        'Thursday': 'Quinta-feira',
        'Friday': 'Sexta-feira'
    };
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'exam': return { label: 'Prova', color: 'var(--secondary)' };
            case 'assignment': return { label: 'Trabalho', color: 'var(--accent)' };
            case 'project': return { label: 'Projeto', color: 'var(--success)' };
            default: return { label: 'Evento', color: 'var(--primary)' };
        }
    };

    const renderHeader = () => {
        const tabs = [
            { id: 'home', label: '🏠 Início' },
            { id: 'schedule', label: '📅 Grade' },
            { id: 'resources', label: '📚 Materiais' },
            { id: 'calendar', label: '🏁 Prazos' }
        ] as const;

        return (
            <nav style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                padding: '0.5rem',
                background: 'var(--surface-card)',
                borderRadius: '16px',
                border: '1px solid var(--surface-border)',
                overflowX: 'auto',
                scrollbarWidth: 'none'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            minWidth: '100px',
                            padding: '0.75rem 1rem',
                            border: 'none',
                            borderRadius: '12px',
                            background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--foreground-muted)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        );
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {renderHeader()}

            {activeTab === 'home' && (
                <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <CurrentClass currentClass={currentClass} />
                    <UpcomingList classes={upcomingClasses} />
                    <ImportantDates events={db.events} notices={db.notices} />
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
                    {days.map(day => {
                        const classes = db.classes.filter(c => c.day === day).sort((a, b) => a.start.localeCompare(b.start));
                        return (
                            <div key={day} className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
                                    {dayLabels[day]}
                                </h3>
                                {classes.length === 0 ? (
                                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>Sem aulas</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {classes.map((cls, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <p style={{ fontWeight: 600 }}>{cls.subject.name}</p>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>{cls.professor.name}</p>
                                                </div>
                                                <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                                                    <p>{cls.start} - {cls.end}</p>
                                                    <p style={{ color: 'var(--foreground-muted)' }}>{cls.room}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'resources' && (
                <ResourcesView
                    resources={db.resources}
                    subjects={Array.from(new Set(db.resources.map(r => r.subject.name))).sort()}
                />
            )}

            {activeTab === 'calendar' && (
                <div className="animate-fade-in" style={{ display: 'grid', gap: '2rem' }}>
                    {db.events.sort((a, b) => a.date.localeCompare(b.date)).map(event => {
                        const { label, color } = getTypeLabel(event.type);
                        const date = new Date(event.date + 'T12:00:00');
                        return (
                            <div key={event.id} className="glass-panel" style={{
                                padding: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    textAlign: 'center',
                                    minWidth: '50px',
                                    padding: '0.4rem',
                                    background: 'var(--surface-card)',
                                    borderRadius: '10px',
                                    border: `1px solid ${color}`
                                }}>
                                    <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700 }}>{date.getDate()}</span>
                                    <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', opacity: 0.7 }}>
                                        {date.toLocaleDateString('pt-BR', { month: 'short' })}
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: color, textTransform: 'uppercase' }}>{label}</span>
                                    <h4 style={{ fontSize: '1rem', marginTop: '0.1rem' }}>{event.title}</h4>
                                </div>
                                <div style={{ fontSize: '1.2rem', opacity: 0.5 }}>
                                    {event.type === 'exam' ? '📝' : event.type === 'project' ? '🚀' : '📂'}
                                </div>
                            </div>
                        );
                    })}
                    {db.events.length === 0 && <p style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>Nenhum prazo cadastrado.</p>}
                </div>
            )}
        </div>
    );
}
