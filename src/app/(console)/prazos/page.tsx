import { getDatabase, AcademicEvent } from '@/lib/data';
import PageTitle from '@/components/ui/PageTitle';
import Badge, { BadgeTone } from '@/components/ui/Badge';

export const revalidate = 0;

const TYPE_META: Record<string, { label: string; tone: BadgeTone }> = {
    exam: { label: 'Prova', tone: 'teal' },
    assignment: { label: 'Trabalho', tone: 'amber' },
    project: { label: 'Projeto', tone: 'warning' },
    holiday: { label: 'Feriado', tone: 'neutral' },
    other: { label: 'Outro', tone: 'neutral' }
};

function startOfDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

function dateLabel(date: string, today: Date) {
    const diff = Math.round((startOfDay(new Date(date)).getTime() - startOfDay(today).getTime()) / 86400000);
    if (diff === 0) return 'hoje';
    if (diff === 1) return 'amanhã';
    if (diff < 0) return `${Math.abs(diff)} dias atrás`;
    return `em ${diff} dias`;
}

function formatDate(date: string) {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function EventRow({ ev, label }: { ev: AcademicEvent; label: string }) {
    const meta = TYPE_META[ev.type] || TYPE_META.other;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 0.2rem', borderBottom: '1px solid var(--surface-border)' }}>
            <span className="mono" style={{ minWidth: '4.2rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                {formatDate(ev.date)}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{ev.title}</p>
            </div>
            <Badge tone={meta.tone}>{meta.label}</Badge>
            <span className="mono hide-sm" style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                {label}
            </span>
        </div>
    );
}

export default async function PrazosPage() {
    const db = await getDatabase();
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const upcoming = db.events
        .filter(e => e.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date));
    const past = db.events
        .filter(e => e.date < todayStr)
        .sort((a, b) => b.date.localeCompare(a.date));

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <PageTitle label="prazos">Prazos e datas</PageTitle>

            <p className="console-label" style={{ marginBottom: '0.5rem' }}>Próximos</p>
            <section className="glass-panel" style={{ padding: '0.5rem 1.5rem', marginBottom: '2.5rem' }}>
                {upcoming.length === 0 ? (
                    <p className="mono" style={{ fontSize: '0.82rem', color: 'var(--foreground-muted)', padding: '1rem 0', fontStyle: 'italic' }}>
                        nenhum prazo próximo
                    </p>
                ) : (
                    upcoming.map(ev => <EventRow key={ev.id} ev={ev} label={dateLabel(ev.date, today)} />)
                )}
            </section>

            {past.length > 0 && (
                <>
                    <p className="console-label" style={{ marginBottom: '0.5rem' }}>Anteriores</p>
                    <section className="glass-panel" style={{ padding: '0.5rem 1.5rem' }}>
                        {past.map(ev => <EventRow key={ev.id} ev={ev} label={dateLabel(ev.date, today)} />)}
                    </section>
                </>
            )}
        </div>
    );
}
