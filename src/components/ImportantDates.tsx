import { AcademicEvent, Notice } from '@/lib/data';
import UiIcon from './ui/Icon';

interface ImportantDatesProps {
    events: AcademicEvent[];
    notices: Notice[];
}

function startOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function daysUntil(date: string, today: Date): number {
    const diff = startOfDay(new Date(date)).getTime() - startOfDay(today).getTime();
    return Math.round(diff / 86400000);
}

function dateLabel(date: string, today: Date) {
    const days = daysUntil(date, today);
    if (days === 0) return 'hoje';
    if (days === 1) return 'amanhã';
    if (days === -1) return 'ontem';
    if (days < 0) return `${Math.abs(days)} dias atrás`;
    return `em ${days} dias`;
}

function formatDate(date: string) {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function ImportantDates({ events, notices }: ImportantDatesProps) {
    const today = new Date();

    return (
        <>
            {events.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {events.map((ev, i) => (
                        <div key={i} className="hairline-row" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: '0.75rem 0.2rem' }}>
                            <span className="mono" style={{ minWidth: '4rem', fontSize: 'var(--text-sm)', color: 'var(--primary)', fontWeight: 700 }}>
                                {formatDate(ev.date)}
                            </span>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-md)' }}>{ev.title}</p>
                                <p style={{ margin: '0.1rem 0 0', color: 'var(--foreground-muted)', fontSize: 'var(--text-sm)' }}>
                                    <span className="mono">{ev.type}</span>
                                </p>
                            </div>
                            <span className="mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                                {dateLabel(ev.date, today)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {notices.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {notices.map((notice, i) => (
                        <div key={i} className="glass-panel" style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', alignItems: 'flex-start', background: 'var(--warning-glow)', borderColor: 'transparent' }}>
                            <span style={{ color: 'var(--warning-ink)', marginTop: '0.1rem', flexShrink: 0 }}>
                                <UiIcon name="alert" size={16} />
                            </span>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: 'var(--text-md)' }}>{notice.message}</p>
                            </div>
                            <span className="mono" style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                                {formatDate(notice.createdAt.toISOString().slice(0, 10))}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
