'use client';

import { useState, useCallback, useEffect } from 'react';
import Modal from '@/components/Modal';
import StudentIdentifyForm from '@/components/StudentIdentifyForm';
import { toast } from 'sonner';
import { getStudentSession, StudentSession } from '@/lib/studentSession';
import { Subject } from '@/lib/data';
import Card from '@/components/ui/Card';
import Badge, { BadgeTone } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

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

const STATUS_META: Record<string, { label: string; tone: BadgeTone }> = {
    PENDING: { label: 'Pendente', tone: 'warning' },
    APPROVED: { label: 'Aprovada', tone: 'success' },
    REJECTED: { label: 'Reprovada', tone: 'error' }
};

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
                <p className="console-label" style={{ marginBottom: '1rem' }}>Identifique-se</p>
                <StudentIdentifyForm onSuccess={(s) => setStudent(s)} />
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                    <span style={{ color: 'var(--primary)' }}>{student.name}</span> · {student.registration}
                </p>
                <Button icon="plus" onClick={() => setIsCreateOpen(true)}>
                    Nova justificativa
                </Button>
            </div>

            {loading ? (
                <p className="mono" style={{ textAlign: 'center', color: 'var(--foreground-muted)', padding: '2rem' }}>carregando...</p>
            ) : absences.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--foreground-muted)' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Nenhuma justificativa ainda.</p>
                    <p style={{ fontSize: '0.9rem' }}>Justifique uma falta aqui.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {absences.map(item => {
                        const status = STATUS_META[item.status] || STATUS_META.PENDING;
                        return (
                            <Card key={item.id} accent={item.status === 'APPROVED' ? 'var(--success)' : item.status === 'REJECTED' ? 'var(--error)' : 'var(--warning)'}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                            {item.subject?.name || 'Matéria removida'}
                                            {item.subject?.period && <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--secondary)' }}> · {item.subject.period}</span>}
                                        </h3>
                                        <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>
                                            {new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <Badge tone={status.tone}>{status.label}</Badge>
                                </div>

                                <p style={{ lineHeight: '1.6', color: 'var(--foreground)', whiteSpace: 'pre-wrap' }}>{item.reason}</p>

                                {item.attachmentUrl && (
                                    <a href={item.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                        <Icon name="paperclip" size={14} />
                                        {item.fileName || 'Ver anexo'}
                                    </a>
                                )}

                                {item.status !== 'PENDING' && item.adminNote && (
                                    <div style={{
                                        padding: '0.9rem 1rem', background: 'var(--surface-card)', borderRadius: '10px',
                                        borderLeft: `3px solid ${item.status === 'APPROVED' ? 'var(--success)' : 'var(--error)'}`, marginTop: '1rem'
                                    }}>
                                        <p className="mono" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--foreground-muted)', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                                            Observação
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>{item.adminNote}</p>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nova justificativa de falta">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label className="console-label">Matéria</label>
                        <select name="subjectId" required defaultValue="" className="console-select">
                            <option value="" disabled>Selecione a matéria...</option>
                            {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}{sub.period ? ` · ${sub.period}` : ''}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="console-label">Data da falta</label>
                        <input name="date" type="date" required max={todayStr} className="console-input" />
                    </div>
                    <div>
                        <label className="console-label">Motivo</label>
                        <textarea name="reason" required placeholder="Descreva o motivo da falta..." className="console-textarea" />
                    </div>
                    <div>
                        <label className="console-label">Anexo (opcional, ex: atestado)</label>
                        <input name="file" type="file" className="console-input" style={{ padding: '0.5rem' }} />
                    </div>
                    <Button type="submit" fullWidth icon="send">
                        Enviar justificativa
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
