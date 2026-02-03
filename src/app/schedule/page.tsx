import { getDatabase } from '@/lib/data';
import Link from 'next/link';

export default async function Schedule() {
    const db = await getDatabase();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayLabels: Record<string, string> = {
        'Monday': 'Segunda-feira',
        'Tuesday': 'Terça-feira',
        'Wednesday': 'Quarta-feira',
        'Thursday': 'Quinta-feira',
        'Friday': 'Sexta-feira'
    };

    // Group classes by day
    const classesByDay = days.map(day => ({
        day: day,
        classes: db.classes.filter(c => c.day === day).sort((a, b) => a.start.localeCompare(b.start))
    }));

    return (
        <main className="container" style={{ padding: '2rem 1rem', minHeight: '100vh' }}>
            <header style={{ marginBottom: '2rem' }}>
                <Link href="/" style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
                    &larr; Voltar para o Início
                </Link>
                <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Grade Horária</h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {classesByDay.map(({ day, classes }) => (
                    <div key={day} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
                            {dayLabels[day]}
                        </h2>
                        {classes.length === 0 ? (
                            <p style={{ color: '#52525b', fontSize: '0.9rem' }}>Sem aulas</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {classes.map((cls, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <p style={{ fontWeight: 600 }}>{cls.subject.name}</p>
                                            <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{cls.professor.name}</p>
                                        </div>
                                        <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
                                            <p>{cls.start} - {cls.end}</p>
                                            <p style={{ color: '#a1a1aa' }}>{cls.room}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
