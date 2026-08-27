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
            <div className="glass-panel" style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--rounded-md)', background: 'var(--success-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', flexShrink: 0 }}>
                    <Icon name="check" size={18} />
                </div>
                <p style={{ color: 'var(--foreground-muted)', fontSize: 'var(--text-md)', margin: 0 }}>
                    Nenhuma aula restante. Dia livre!
                </p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: 'var(--space-2) var(--space-4)' }}>
            {classes.map((cls, i) => (
                <div
                    key={i}
                    className="hairline-row"
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', padding: 'var(--space-4) var(--space-2)' }}
                >
                    <span className="mono" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, minWidth: '3.4rem', color: 'var(--primary)' }}>
                        {cls.start}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-lg)', margin: 0 }}>{cls.subject.name}</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground-muted)', fontSize: 'var(--text-sm)', marginTop: '0.15rem' }}>
                            <Icon name="building" size={13} />
                            <span className="mono">{cls.room}</span>
                            <span style={{ opacity: 0.5 }}>·</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cls.professor.name}</span>
                        </p>
                    </div>
                    <span className="mono hide-sm" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                        {countdown(cls.start, now)}
                    </span>
                </div>
            ))}
        </div>
    );
}