import { ClassSessionWithRelations } from '@/lib/data';

export default function UpcomingList({ classes }: { classes: ClassSessionWithRelations[] }) {
    if (classes.length === 0) {
        return (
            <div style={{ marginTop: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>
                <p>Não há mais aulas hoje.</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--foreground-muted)' }}>A Seguir</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {classes.map((cls, idx) => (
                    <div key={idx} className="glass-panel" style={{
                        padding: '1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--surface-hover)'
                    }}>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{cls.subject.name}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)', marginTop: '0.2rem' }}>{cls.professor.name}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--foreground)' }}>{cls.start}</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--primary)', marginTop: '0.2rem' }}>{cls.room}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
