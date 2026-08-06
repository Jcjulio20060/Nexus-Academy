'use client';

import { useState, useCallback, useEffect } from 'react';
import Modal from '@/components/Modal';
import StudentIdentifyForm from '@/components/StudentIdentifyForm';
import { toast } from 'sonner';
import { getStudentSession, StudentSession } from '@/lib/studentSession';
import { Subject } from '@/lib/data';

interface AbsenceItem {
    id: number;
    subjectId: number | null;
    subject: { id: number; name: string; period: string | null } | null;
    date: string;
    reason: string;
    status: string;
    adminNote: string | null;
    attachmentUrl: string | null;
    fileName: string | null;
    createdAt: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string; background: string }> = {
    PENDING: { label: 'Pendente', color: 'black', background: 'var(--warning)' },
    APPROVED: { label: 'Aprovada', color: 'white', background: 'var(--success)' },
    REJECTED: { label: 'Reprovada', color: 'white', background: 'var(--error)' }
};

const inputStyle = {
    padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--surface-border)',
    background: 'var(--surface)', color: 'var(--foreground)'
} as const;

interface JustificativasClientProps {
    subjects: Subject[];
}

export default function JustificativasClient({ subjects }: JustificativasClientProps) {
    const [student, setStudent] = useState<StudentSession | null>(() => {
        if (typeof window === 'undefined') return null;
        return getStudentSession();
    });
    const [absences, setAbsences] = useState<AbsenceItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const todayStr = new Date().toISOString().slice(0, 10);

    const loadAbsences = useCallback(async (sid: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/absences?studentId=${sid}`);
            const data = await res.json();
            if (data.success) setAbsences(data.absences);
            else throw new Error(data.error);
        } catch {
            toast.error('Erro ao carregar justificativas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (student) loadAbsences(student.id);
    }, [student, loadAbsences]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!student) return;
        const formData = new FormData(e.currentTarget);
        formData.set('studentId', String(student.id));

        const promise = fetch('/api/absences/create', { method: 'POST', body: formData }).then(async (res) => {
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Falha ao enviar');
            setIsCreateOpen(false);
            await loadAbsences(student.id);
        });

        toast.promise(promise, {
            loading: 'Enviando justificativa...',
            success: 'Justificativa enviada! Aguarde a análise.',
            error: 'Erro ao enviar justificativa.'
        });
    };

    if (!student) {
        return (
            <div className="glass-panel" style={{ maxWidth: '420px', margin: '0 auto', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--primary)' }}>Identifique-se</h2>
                <StudentIdentifyForm onSuccess={(s) => setStudent(s)} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
                        Identificado como <strong>{student.name}</strong> • Matrícula {student.registration}
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    style={{
                        padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white',
                        border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer',
                        boxShadow: '0 4px 12px var(--primary-glow)'
                    }}
                >
                    + Nova Justificativa
                </button>
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '2rem' }}>Carregando...</p>
            ) : absences.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--foreground-muted)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Nenhuma justificativa ainda.</p>
                    <p style={{ fontSize: '0.9rem' }}>Justifique uma falta aqui!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                    {absences.map(item => {
                        const status = STATUS_LABEL[item.status] || STATUS_LABEL.PENDING;
                        return (
                            <div key={item.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.subject?.name || 'Matéria removida'}{item.subject?.period && <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--secondary)' }}> · {item.subject.period}</span>}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                                            {new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px',
                                        background: status.background, color: status.color, textTransform: 'uppercase'
                                    }}>
                                        {status.label}
                                    </span>
                                </div>

                                <p style={{ lineHeight: '1.6', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>{item.reason}</p>

                                {item.attachmentUrl && (
                                    <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                        📎 {item.fileName || 'Ver anexo'}
                                    </a>
                                )}

                                {item.status !== 'PENDING' && item.adminNote && (
                                    <div style={{
                                        padding: '0.9rem', background: 'var(--surface-card)', borderRadius: '10px',
                                        borderLeft: `4px solid ${item.status === 'APPROVED' ? 'var(--success)' : 'var(--error)'}`, marginTop: '1rem'
                                    }}>
                                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--foreground-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                                            Observação:
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>{item.adminNote}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nova Justificativa de Falta">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Matéria</label>
                        <select name="subjectId" required defaultValue="" style={inputStyle}>
                            <option value="" disabled>Selecione a matéria...</option>
                            {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}{sub.period ? ` · ${sub.period}` : ''}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Data da falta</label>
                        <input name="date" type="date" required max={todayStr} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Motivo</label>
                        <textarea name="reason" required placeholder="Descreva o motivo da falta..." style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Anexo (opcional, ex: atestado)</label>
                        <input name="file" type="file" style={{ color: 'var(--foreground)', fontSize: '0.85rem' }} />
                    </div>
                    <button type="submit" style={{ padding: '1rem', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
                        Enviar Justificativa
                    </button>
                </form>
            </Modal>
        </div>
    );
}
