import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    accent?: string;
    hover?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export default function Card({ children, accent, hover, className, style }: CardProps) {
    return (
        <div
            className={`glass-panel glass-card ${hover ? 'glass-card-hover' : ''} ${className ?? ''}`}
            style={{
                padding: '1.5rem',
                ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
                ...style
            }}
        >
            {children}
        </div>
    );
}
