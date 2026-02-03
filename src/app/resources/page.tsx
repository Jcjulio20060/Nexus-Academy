import { getDatabase } from '@/lib/data';

export default async function ResourcesPage() {
    const db = await getDatabase();
    const resources = db.resources;

    // Group by subject
    const groupedResources = resources.reduce((acc, curr) => {
        if (!acc[curr.subject]) {
            acc[curr.subject] = [];
        }
        acc[curr.subject].push(curr);
        return acc;
    }, {} as Record<string, typeof resources>);

    const subjects = Object.keys(groupedResources).sort();

    return (
        <main className="container" style={{ padding: '4rem 1rem' }}>
            <h1 className="title-gradient" style={{ textAlign: 'center', marginBottom: '3rem' }}>Materiais de Aula</h1>

            <div style={{ display: 'grid', gap: '3rem' }}>
                {subjects.map(subject => (
                    <section key={subject} className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>{subject}</h2>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {groupedResources[subject].map(resource => (
                                <a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        transition: 'background 0.2s',
                                        border: '1px solid transparent'
                                    }}
                                    className="resource-link"
                                >
                                    <div style={{ fontSize: '1.5rem', marginRight: '1rem' }}>📄</div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', color: '#e4e4e7', marginBottom: '0.25rem' }}>{resource.title}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Clique para abrir</p>
                                    </div>
                                    <div style={{ color: 'var(--primary)' }}>➜</div>
                                </a>
                            ))}
                        </div>
                    </section>
                ))}
                {subjects.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#a1a1aa', padding: '4rem' }}>
                        <p>Nenhum material disponível no momento.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
