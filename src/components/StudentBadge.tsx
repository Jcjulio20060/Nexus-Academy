'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import StudentIdentifyForm from '@/components/StudentIdentifyForm';
import Icon from '@/components/ui/Icon';
import { toast } from 'sonner';
import { getStudentSession, clearStudentSession, StudentSession } from '@/lib/studentSession';

const chipStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: 'var(--text-base)',
    color: 'var(--foreground-muted)',
    padding: '0.45rem 0.8rem',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--rounded-md)',
    background: 'var(--surface)',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)'
};

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

    return (
        <>
            {student ? (
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span style={chipStyle} title={student.name}>
                        <Icon name="user" size={14} />
                        {student.name.split(' ')[0]}
                    </span>
                    <button onClick={handleLogout} style={chipStyle} title="Remover identificação">
                        <Icon name="logout" size={14} />
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsOpen(true)} style={chipStyle} title="Identificar-se">
                    <Icon name="user" size={14} />
                    Entrar
                </button>
            )}

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Identificação do Aluno">
                <StudentIdentifyForm onSuccess={() => setIsOpen(false)} />
            </Modal>
        </>
    );
}
