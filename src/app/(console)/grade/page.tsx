import { getDatabase } from '@/lib/data';
import PageTitle from '@/components/ui/PageTitle';
import Icon from '@/components/ui/Icon';

export const revalidate = 0;

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DAY_LABEL: Record<string, string> = {
    Monday: 'Segunda-feira',
    Tuesday: 'Terça-feira',
    Wednesday: 'Quarta-feira',
    Thursday: 'Quinta-feira',
    Friday: 'Sexta-feira',
    Saturday: 'Sábado'
};

export default async function GradePage() {
    const db = await getDatabase();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const grouped = DAY_ORDER.map(day => ({
        day,
        label: DAY_LABEL[day],
        classes: db.classes
            .filter(c => c.day === day)
            .sort((a, b) => a.start.localeCompare(b.start))
    }));

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <PageTitle label="grade">Grade semanal</PageTitle>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {grouped.map(({ day, label, classes }) => {
                    const isToday = day === today;
                    return (
                        <section key={day} className="glass-panel" style={{ padding: 'var(--space-2) var(--space-5)', opacity: classes.length ? 1 : 0.75 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: 'var(--space-4) 0' }}>
                                <h2 className="mono" style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: isToday ? 'var(--primary)' : 'var(--foreground-muted)' }}>
                                    {label}
                                </h2>
                                {isToday && (
                                    <>
                                        <span className="live-dot" />
                                        <span className="mono" style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--secondary)' }}>hoje</span>
                                    </>
                                )}
                                <span className="mono" style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--foreground-muted)' }}>
                                    {classes.length} aula{classes.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {classes.length === 0 ? (
                                <p className="mono" style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', fontStyle: 'italic', margin: 0, paddingBottom: 'var(--space-4)' }}>
                                    sem aulas
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {classes.map(cls => (
                                        <div key={cls.id} className="hairline-row" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: 'var(--space-4) 0' }}>
                                            <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, minWidth: '4.2rem', color: 'var(--primary)' }}>
                                                {cls.start}
                                            </span>
                                            <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--foreground-muted)' }}>
                                                {cls.end}
                                            </span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>
                                                    {cls.subject.name}
                                                    {cls.subject.period && <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}> · {cls.subject.period}</span>}
                                                </p>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0.15rem 0 0', color: 'var(--foreground-muted)', fontSize: '0.78rem' }}>
                                                    {cls.professor.name}
                                                </p>
                                            </div>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem', borderRadius: 'var(--rounded-sm)', background: 'var(--surface-card)', border: '1px solid var(--surface-border)', color: 'var(--foreground-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                                                <Icon name="building" size={13} />
                                                <span className="mono">{cls.room}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
