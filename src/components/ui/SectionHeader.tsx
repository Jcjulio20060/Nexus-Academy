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
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-3)',
                marginTop: 'var(--space-8)',
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
