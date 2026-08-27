import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    hover?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export default function Card({ children, hover, className, style }: CardProps) {
    return (
        <div
            className={`glass-panel glass-card ${hover ? 'glass-card-hover' : ''} ${className ?? ''}`}
            style={{
                padding: 'var(--space-6)',
                ...style
            }}
        >
            {children}
        </div>
    );
}
