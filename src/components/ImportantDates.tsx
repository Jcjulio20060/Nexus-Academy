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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {events.map((ev, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 0.2rem' }}>
                            <span className="mono" style={{ minWidth: '4rem', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                                {formatDate(ev.date)}
                            </span>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{ev.title}</p>
                                <p style={{ margin: '0.1rem 0 0', color: 'var(--foreground-muted)', fontSize: '0.82rem' }}>
                                    <span className="mono">{ev.type}</span>
                                </p>
                            </div>
                            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                                {dateLabel(ev.date, today)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {notices.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {notices.map((notice, i) => (
                        <div key={i} className="glass-panel" style={{ display: 'flex', gap: '0.85rem', padding: '0.9rem 1rem', alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--warning)', marginTop: '0.1rem', flexShrink: 0 }}>
                                <UiIcon name="alert" size={16} />
                            </span>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem' }}>{notice.message}</p>
                            </div>
                            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                                {formatDate(notice.createdAt.toISOString().slice(0, 10))}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
