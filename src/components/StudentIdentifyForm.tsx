'use client';

import { toast } from 'sonner';
import { setStudentSession, StudentSession } from '@/lib/studentSession';

const inputStyle = {
    padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)',
    background: 'var(--surface)', color: 'var(--foreground)'
} as const;

interface StudentIdentifyFormProps {
    onSuccess?: (student: StudentSession) => void;
}

export default function StudentIdentifyForm({ onSuccess }: StudentIdentifyFormProps) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const promise = fetch('/api/student/identify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.get('name'),
                registration: formData.get('registration'),
                email: formData.get('email')
            })
        }).then(async (res) => {
            if (!res.ok) throw new Error('Falha ao identificar');
            const data = await res.json();
            setStudentSession(data.student);
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('nexus:student-change'));
            }
            onSuccess?.(data.student);
        });

        toast.promise(promise, {
            loading: 'Identificando...',
            success: 'Identificado com sucesso!',
            error: 'Não foi possível identificar.'
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', lineHeight: 1.5 }}>
                Identifique-se com nome e matrícula para acessar este recurso.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Nome completo</label>
                <input name="name" required placeholder="Ex: João da Silva" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Matrícula</label>
                <input name="registration" required placeholder="Ex: 2023001234" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>E-mail (opcional)</label>
                <input name="email" type="email" placeholder="voce@email.com" style={inputStyle} />
            </div>
            <button type="submit" style={{ padding: '1rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                Salvar
            </button>
        </form>
    );
}
