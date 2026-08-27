'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './ui/Icon';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={overlayRef}
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(36, 28, 20, 0.45)',
                backdropFilter: 'blur(3px)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-4)'
            }}
        >
            <div
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    background: 'var(--surface)',
                    color: 'var(--foreground)'
                }}
            >
                <div style={{
                    padding: 'var(--space-5) var(--space-6)',
                    borderBottom: '1px solid var(--surface-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 className="label-mono" style={{ margin: 0 }}>
                        <span style={{ color: 'var(--primary)' }}>{'//'}</span> {title}
                    </h2>
                    <button
                        onClick={onClose}
                        title="Fechar"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px',
                            background: 'var(--surface)',
                            border: '1px solid var(--surface-border)',
                            borderRadius: 'var(--rounded-sm, 8px)',
                            color: 'var(--foreground-muted)',
                            cursor: 'pointer',
                            transition: 'color 0.15s ease'
                        }}
                    >
                        <Icon name="x" size={15} />
                    </button>
                </div>
                <div style={{ padding: 'var(--space-6)' }}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
