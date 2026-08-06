'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClassSessionWithRelations, Database } from '@/lib/data';
import CurrentClass from '@/components/CurrentClass';
import UpcomingList from '@/components/UpcomingList';
import ImportantDates from '@/components/ImportantDates';
import SectionHeader from '@/components/ui/SectionHeader';
import Icon from '@/components/ui/Icon';
import { getStudentSession, StudentSession } from '@/lib/studentSession';

interface HomeClientProps {
    classesToday: ClassSessionWithRelations[];
    db: Database;
}

function timeToMinutes(t: string) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
}

function greeting(now: Date, name?: string) {
    const h = now.getHours();
    let msg = h >= 5 && h < 12 ? 'Bom dia' : h >= 12 && h < 18 ? 'Boa tarde' : 'Boa noite';
    if (name) msg += `, ${name}`;
    return msg;
}

export default function HomeClient({ classesToday, db }: HomeClientProps) {
    const [now, setNow] = useState(() => new Date());
    const [current, setCurrent] = useState<{ cls: ClassSessionWithRelations; progress: number } | null>(null);
    const [upcoming, setUpcoming] = useState<ClassSessionWithRelations[]>([]);
    const [student, setStudent] = useState<StudentSession | null>(() => {
        if (typeof window === 'undefined') return null;
        return getStudentSession();
    });

    useEffect(() => {
        const tick = () => {
            const n = new Date();
            setNow(n);

            const mins = timeToMinutes(`${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`);

            const ongoing = classesToday.filter(cls => mins >= timeToMinutes(cls.start) && mins < timeToMinutes(cls.end));
            if (ongoing.length > 0) {
                const cls = ongoing[0];
                const start = timeToMinutes(cls.start);
                const end = timeToMinutes(cls.end);
                setCurrent({ cls, progress: Math.round(((mins - start) / (end - start)) * 100) });
            } else {
                setCurrent(null);
            }

            setUpcoming(classesToday.filter(cls => mins < timeToMinutes(cls.start)).slice(0, 3));
        };
        tick();
        const id = setInterval(tick, 30000);
        return () => clearInterval(id);
    }, [classesToday]);

    useEffect(() => {
        const onChange = () => setStudent(getStudentSession());
        window.addEventListener('nexus:student-change', onChange);
        return () => window.removeEventListener('nexus:student-change', onChange);
    }, []);

    const todayStr = now.toISOString().slice(0, 10);
    const upcomingEvents = db.events
        .filter(e => e.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);

    const dateLabel = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <section style={{ marginBottom: '2.5rem' }}>
                <p className="label-mono" style={{ margin: '0 0 0.5rem' }}>{`// ${dateLabel}`}</p>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0 }}>
                    {greeting(now, student?.name.split(' ')[0])}
                </h1>
                <p style={{ color: 'var(--foreground-muted)', margin: '0.5rem 0 0', fontSize: '0.95rem' }}>
                    Console do aluno · {classesToday.length > 0 ? `${classesToday.length} aula${classesToday.length > 1 ? 's' : ''} hoje` : 'sem aulas hoje'}
                </p>
            </section>

            <SectionHeader label="agora" style={{ marginBottom: '0.9rem' }} />
            <div style={{ marginBottom: '2.5rem' }}>
                <CurrentClass currentClass={current?.cls ?? null} progress={current?.progress ?? 0} />
            </div>

            <SectionHeader label="a seguir" style={{ marginBottom: '0.9rem' }} />
            <div style={{ marginBottom: '2.5rem' }}>
                <UpcomingList classes={upcoming} now={now} />
            </div>

            <SectionHeader
                label="prazos"
                style={{ marginBottom: '0.9rem' }}
                action={
                    <Link href="/prazos" className="mono" style={{ fontSize: '0.72rem', color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        ver todos
                        <Icon name="arrow-right" size={13} />
                    </Link>
                }
            />
            <div style={{ marginBottom: '2.5rem' }}>
                {upcomingEvents.length > 0 ? (
                    <ImportantDates events={upcomingEvents} notices={[]} />
                ) : (
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>Nenhum prazo próximo.</p>
                )}
            </div>

            <SectionHeader label="avisos" style={{ marginBottom: '0.9rem' }} />
            <div style={{ marginBottom: '2.5rem' }}>
                {db.notices.length > 0 ? (
                    <ImportantDates events={[]} notices={db.notices.slice(0, 3)} />
                ) : (
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>Sem avisos no momento.</p>
                )}
            </div>

            <SectionHeader label="ações" style={{ marginBottom: '0.9rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem' }}>
                <Link href="/tickets" className="glass-panel glass-card" style={{ textDecoration: 'none', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="ticket" size={20} />
                    </span>
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>Meus tickets</p>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', margin: 0 }}>Abrir ou acompanhar uma solicitação de suporte.</p>
                </Link>
                <Link href="/justificativas" className="glass-panel glass-card" style={{ textDecoration: 'none', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--secondary-glow)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="clipboard" size={20} />
                    </span>
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>Justificar falta</p>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', margin: 0 }}>Enviar uma justificativa de ausência.</p>
                </Link>
                <Link href="/grade" className="glass-panel glass-card" style={{ textDecoration: 'none', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="calendar" size={20} />
                    </span>
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>Grade da semana</p>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', margin: 0 }}>Aulas, horários, salas e professores.</p>
                </Link>
                <Link href="/materiais" className="glass-panel glass-card" style={{ textDecoration: 'none', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--secondary-glow)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="book" size={20} />
                    </span>
                    <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>Materiais de estudo</p>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.85rem', margin: 0 }}>Links e arquivos por matéria.</p>
                </Link>
            </div>
        </div>
    );
}
