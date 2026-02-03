import { ClassSessionWithRelations } from '@/lib/data';

export default function CurrentClass({ currentClass }: { currentClass: ClassSessionWithRelations | null }) {
    if (!currentClass) {
        return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>Livre Agora</h2>
                <p style={{ color: '#a1a1aa' }}>Nenhuma aula agendada para este horário.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
            <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                fontWeight: 600
            }}>
                AGORA ({currentClass.start} - {currentClass.end})
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.1 }}>
                {currentClass.subject.name}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', color: '#e5e5e5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" /></svg>
                    <span style={{ fontSize: '1.1rem' }}>{currentClass.room}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span style={{ fontSize: '1.1rem' }}>{currentClass.professor.name}</span>
                </div>
            </div>
        </div>
    );
}
