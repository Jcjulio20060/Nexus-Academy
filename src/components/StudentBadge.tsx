'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import StudentIdentifyForm from '@/components/StudentIdentifyForm';
import { toast } from 'sonner';
import { getStudentSession, clearStudentSession, StudentSession } from '@/lib/studentSession';

export default function StudentBadge() {
    const [student, setStudent] = useState<StudentSession | null>(() => {
        if (typeof window === 'undefined') return null;
        return getStudentSession();
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        clearStudentSession();
        setStudent(null);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('nexus:student-change'));
        }
        toast.info('Identificação removida');
    };

    const baseStyle = {
        fontSize: '0.8rem',
        color: 'var(--foreground-muted)',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        border: '1px solid var(--surface-border)',
        borderRadius: '10px',
        background: 'var(--surface)',
        fontWeight: 600,
        backdropFilter: 'blur(8px)',
        cursor: 'pointer'
    } as const;

    return (
        <>
            {student ? (
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={{ ...baseStyle, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        👤 {student.name.split(' ')[0]}
                    </span>
                    <button onClick={handleLogout} style={baseStyle} title="Remover identificação">
                        Sair
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} style={baseStyle}>
                    Entrar
                </button>
            )}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Identificação do Aluno">
                <StudentIdentifyForm onSuccess={() => setIsOpen(false)} />
            </Modal>
        </>
    );
}
