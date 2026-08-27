import { ReactNode } from 'react';

export default function PageTitle({ label, children }: { label: string; children: ReactNode }) {
    return (
        <header style={{ marginBottom: '2rem' }}>
            <p className="label-mono" style={{ margin: '0 0 0.4rem' }}>{`// ${label}`}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                {children}
            </h1>
        </header>
    );
}
