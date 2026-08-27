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

const chip: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.32rem 0.7rem',
    borderRadius: 'var(--rounded-sm)',
    background: 'var(--surface-card)',
    border: '1px solid var(--surface-border)',
    color: 'var(--foreground-muted)',
    fontSize: 'var(--text-base)'
};

export default function CurrentClass({ currentClass, progress }: CurrentClassProps) {
    if (!currentClass) {
        return (
            <div className="glass-panel" style={{ padding: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--rounded-md)', background: 'var(--success-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', flexShrink: 0 }}>
                    <Icon name="coffee" size={20} />
                </div>
                <div>
                    <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--success)', margin: 0, fontWeight: 500 }}>Livre agora</h2>
                    <p style={{ color: 'var(--foreground-muted)', fontSize: 'var(--text-md)', marginTop: '0.2rem' }}>Aproveite para revisar materiais ou descansar.</p>
                </div>
            </div>
        );
    }

    const total = toMinutes(currentClass.end) - toMinutes(currentClass.start);
    const remaining = Math.max(0, Math.round(total * (1 - progress / 100)));

    return (
        <div className="glass-panel glass-card" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <span className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--foreground-muted)' }}>
                    {currentClass.start} – {currentClass.end}
                </span>
                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="live-dot" />
                    <span className="mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--secondary)' }}>
                        ao vivo
                    </span>
                </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.08, margin: '0 0 var(--space-5)' }}>
                {currentClass.subject.name}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <span style={chip}>
                    <Icon name="building" size={14} />
                    <span className="mono">{currentClass.room}</span>
                </span>
                <span style={chip}>
                    <Icon name="user" size={14} />
                    {currentClass.professor.name}
                </span>
                {currentClass.subject.period && (
                    <span style={{ ...chip, color: 'var(--secondary)', fontWeight: 600 }}>
                        <span className="mono">{currentClass.subject.period}</span>
                    </span>
                )}
            </div>

            <hr className="comanda-rule" style={{ margin: 'var(--space-6) 0 var(--space-5)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                <div className="progress-track" style={{ flex: 1 }}>
                    <div className="progress-bar" style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress / 100))})` }} />
                </div>
                <p className="mono" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--primary)', margin: 0, whiteSpace: 'nowrap' }}>
                    restante · {remaining}min
                </p>
            </div>
        </div>
    );
}