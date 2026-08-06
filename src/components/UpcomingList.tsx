import { ClassSessionWithRelations } from '@/lib/data';
import Icon from './ui/Icon';

interface UpcomingListProps {
    classes: ClassSessionWithRelations[];
    now: Date;
}

function countdown(start: string, now: Date): string {
    const [h, m] = start.split(':').map(Number);
    const target = new Date(now);
    target.setHours(h, m || 0, 0, 0);
    const diffMin = Math.round((target.getTime() - now.getTime()) / 60000);
    if (diffMin <= 0) return 'começa agora';
    const hours = Math.floor(diffMin / 60);
    const mins = diffMin % 60;
    return hours > 0 ? `faltam ${hours}h${String(mins).padStart(2, '0')}` : `faltam ${mins}min`;
}

export default function UpcomingList({ classes, now }: UpcomingListProps) {
    if (!classes.length) {
        return (
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
                Não há mais aulas hoje.
            </p>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {classes.map((cls, i) => (
                <div
                    key={i}
                    className="glass-panel glass-card"
                    style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem 1.25rem', borderLeft: '2px solid var(--surface-border)' }}
                >
                    <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, minWidth: '3.5rem', color: 'var(--primary)' }}>
                        {cls.start}
                    </span>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: '1rem', margin: 0 }}>{cls.subject.name}</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground-muted)', fontSize: '0.82rem', marginTop: '0.15rem' }}>
                            <Icon name="building" size={13} />
                            <span className="mono">{cls.room}</span>
                            <span style={{ opacity: 0.5 }}>·</span>
                            {cls.professor.name}
                        </p>
                    </div>
                    <span className="mono hide-sm" style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                        {countdown(cls.start, now)}
                    </span>
                </div>
            ))}
        </div>
    );
}
