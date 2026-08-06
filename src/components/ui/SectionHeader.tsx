import { ReactNode } from 'react';

interface SectionHeaderProps {
    label: string;
    action?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function SectionHeader({ label, action, className, style }: SectionHeaderProps) {
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '0.9rem',
                marginTop: '2.4rem',
                ...style
            }}
        >
            <h2 className="label-mono" style={{ margin: 0 }}>
                <span style={{ color: 'var(--primary)' }}>{'//'}</span> {label}
            </h2>
            {action}
        </div>
    );
}
