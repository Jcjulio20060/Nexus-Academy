import { ClassSessionWithRelations } from '@/lib/data';
import Icon from './ui/Icon';

interface CurrentClassProps {
    currentClass: ClassSessionWithRelations | null;
    progress: number;
}

function toMinutes(time: string) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
}

export default function CurrentClass({ currentClass, progress }: CurrentClassProps) {
    if (!currentClass) {
        return (
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--surface-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                    <Icon name="coffee" size={20} />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--success)', margin: 0 }}>Livre agora</h2>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>Nenhuma aula agendada para este horário.</p>
                </div>
            </div>
        );
    }

    const total = toMinutes(currentClass.end) - toMinutes(currentClass.start);
    const remaining = Math.max(0, Math.round(total * (1 - progress / 100)));

    return (
        <div className="glass-panel glass-card" style={{ padding: '2rem', borderLeft: '3px solid var(--secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <span className="live-dot" />
                <span className="mono" style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
                    agora · {currentClass.start} – {currentClass.end}
                </span>
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.1, margin: '0 0 1.25rem' }}>
                {currentClass.subject.name}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: '8px', background: 'var(--surface-card)', color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>
                    <Icon name="building" size={14} />
                    <span className="mono">{currentClass.room}</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: '8px', background: 'var(--surface-card)', color: 'var(--foreground-muted)', fontSize: '0.85rem' }}>
                    <Icon name="user" size={14} />
                    {currentClass.professor.name}
                </span>
                {currentClass.subject.period && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.7rem', borderRadius: '8px', background: 'var(--surface-card)', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span className="mono">{currentClass.subject.period}</span>
                    </span>
                )}
            </div>

            <div className="progress-track">
                <div className="progress-bar" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
            </div>
            <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)', marginTop: '0.5rem' }}>
                {remaining}min restantes
            </p>
        </div>
    );
}
