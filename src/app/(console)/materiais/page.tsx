import { getDatabase } from '@/lib/data';
import PageTitle from '@/components/ui/PageTitle';
import Icon from '@/components/ui/Icon';

export const revalidate = 0;

export default async function MateriaisPage() {
    const db = await getDatabase();

    const groups = db.subjects
        .map(subject => ({
            subject,
            resources: db.resources
                .filter(r => r.subjectId === subject.id)
                .sort((a, b) => a.title.localeCompare(b.title))
        }))
        .filter(g => g.resources.length > 0);

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <PageTitle label="materiais">Materiais de estudo</PageTitle>

            {groups.length === 0 ? (
                <section className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--foreground-muted)' }}>
                    <p style={{ fontSize: '1.05rem', margin: 0 }}>Nenhum material publicado ainda.</p>
                </section>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {groups.map(({ subject, resources }) => (
                        <section key={subject.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1rem' }}>
                                <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{subject.name}</h2>
                                {subject.code && <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--foreground-muted)' }}>{subject.code}</span>}
                                {subject.period && <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--secondary)' }}>· {subject.period}</span>}
                                <span className="mono" style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--foreground-muted)' }}>
                                    {resources.length} {resources.length === 1 ? 'item' : 'itens'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {resources.map(resource => (
                                    <a
                                        key={resource.id}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="resource-link"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.85rem',
                                            padding: '0.85rem 1rem',
                                            borderRadius: '12px',
                                            background: 'var(--surface-card)',
                                            border: '1px solid var(--surface-border)',
                                            textDecoration: 'none',
                                            color: 'var(--foreground)',
                                            transition: 'border-color 0.15s ease, transform 0.15s ease'
                                        }}
                                    >
                                        <span style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                                            <Icon name={resource.type === 'FILE' ? 'file' : 'link'} size={17} />
                                        </span>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {resource.title}
                                            </p>
                                            {resource.fileName && (
                                                <p className="mono" style={{ margin: '0.1rem 0 0', fontSize: '0.7rem', color: 'var(--foreground-muted)' }}>{resource.fileName}</p>
                                            )}
                                        </div>
                                        <Icon name="external" size={15} />
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
