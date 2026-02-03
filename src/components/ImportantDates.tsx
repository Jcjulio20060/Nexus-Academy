import { Event, Notice } from '@/lib/data';

export default function ImportantDates({ events, notices }: { events: Event[], notices: Notice[] }) {
    if (events.length === 0 && notices.length === 0) return null;

    return (
        <div style={{ marginTop: '3rem' }}>
            {notices.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#d4d4d8' }}>Avisos Rápidos</h3>
                    {notices.map(notice => (
                        <div key={notice.id} className="glass-panel" style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            color: '#fca5a5'
                        }}>
                            <p>⚠️ {notice.message}</p>
                        </div>
                    ))}
                </div>
            )}

            {events.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#d4d4d8' }}>Datas Importantes</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {events.map(event => (
                            <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: event.type === 'exam' ? 'var(--secondary)' : 'var(--accent)' }}></div>
                                <p style={{ fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.25rem' }}>
                                    {new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                                </p>
                                <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{event.title}</p>
                                <span style={{
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    padding: '0.1rem 0.5rem',
                                    borderRadius: '4px',
                                    background: 'var(--surface)',
                                    color: '#d4d4d8'
                                }}>
                                    {event.type === 'exam' ? 'Prova' : 'Trabalho'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
