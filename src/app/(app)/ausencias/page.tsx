'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, Loader2, Check, X, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, PageHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs } from '@/components/ui/tabs';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatDate } from '@/lib/format';
import type { AbsenceJustification, AbsenceStatus, Cadeira } from '@/lib/types';

const STAFF_ROLES = ['ADMIN', 'TEACHER', 'STAFF'];

export default function AusenciasPage() {
  const { user } = useAuth();
  const isStaff = !!user && STAFF_ROLES.includes(user.role);

  const [cadeiras, setCadeiras] = useState<Cadeira[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    apiFetch<{ cadeiras: Cadeira[] }>('/api/cadeiras')
      .then((res) => setCadeiras(res.cadeiras))
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Ausências"
        description={
          isStaff
            ? 'Revise as justificativas de ausência dos alunos.'
            : 'Envie uma justificativa e acompanhe o status.'
        }
      />
      {isStaff ? <StaffReview cadeiras={cadeiras} /> : <StudentView cadeiras={cadeiras} />}
    </div>
  );
}

function StudentView({ cadeiras }: { cadeiras: Cadeira[] }) {
  const [absences, setAbsences] = useState<AbsenceJustification[] | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [cadeiraId, setCadeiraId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    apiFetch<{ absences: AbsenceJustification[] }>('/api/absence')
      .then((res) => setAbsences(res.absences))
      .catch(() => setAbsences([]));
  };

  useEffect(load, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('A data final deve ser depois da inicial');
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch('/api/absence', {
        method: 'POST',
        body: JSON.stringify({
          startDate,
          endDate,
          reason: reason.trim(),
          proofUrl: proofUrl.trim() || undefined,
          cadeiraId: cadeiraId ? Number(cadeiraId) : undefined,
        }),
      });
      toast.success('Justificativa enviada!');
      setStartDate('');
      setEndDate('');
      setReason('');
      setProofUrl('');
      setCadeiraId('');
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar justificativa');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit lg:col-span-2">
        <CardContent className="p-6">
          <h2 className="font-display mb-4 text-lg font-semibold">Nova justificativa</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Início" htmlFor="startDate">
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Field>
              <Field label="Fim" htmlFor="endDate">
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Field>
            </div>
            <Field label="Cadeira (opcional)" htmlFor="absence-cadeira">
              <Select id="absence-cadeira" value={cadeiraId} onChange={(e) => setCadeiraId(e.target.value)}>
                <option value="">Não se aplica</option>
                {cadeiras.map((cadeira) => (
                  <option key={cadeira.id} value={cadeira.id}>
                    {cadeira.code} — {cadeira.title}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Motivo" htmlFor="reason">
              <Textarea
                id="reason"
                rows={3}
                placeholder="Descreva o motivo da ausência..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </Field>
            <Field label="Link de comprovante (opcional)" htmlFor="proofUrl">
              <Input
                id="proofUrl"
                type="url"
                placeholder="https://..."
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
              />
            </Field>
            <Button type="submit" disabled={submitting} className="mt-1">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Enviar justificativa
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="lg:col-span-3">
        <h2 className="font-display mb-4 text-lg font-semibold">Minhas justificativas</h2>
        {absences === null ? (
          <Skeleton className="h-40" />
        ) : absences.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Nenhuma justificativa enviada"
            description="As justificativas que você enviar aparecerão aqui."
          />
        ) : (
          <ul className="space-y-3">
            {absences.map((absence) => (
              <li key={absence.id}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">
                            {formatDate(absence.startDate)} — {formatDate(absence.endDate)}
                          </p>
                          {absence.cadeiraId && (
                            <p className="text-xs text-muted-foreground">
                              {cadeiras.find((c) => c.id === absence.cadeiraId)?.title ?? `Cadeira #${absence.cadeiraId}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <StatusBadge value={absence.status} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{absence.reason}</p>
                    {absence.proofUrl && (
                      <a
                        href={absence.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" /> Ver comprovante
                      </a>
                    )}
                    {absence.response && (
                      <p className="mt-3 rounded-lg bg-muted/60 p-3 text-sm">
                        <span className="font-medium">Resposta: </span>
                        {absence.response}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StaffReview({ cadeiras }: { cadeiras: Cadeira[] }) {
  const [absences, setAbsences] = useState<AbsenceJustification[] | null>(null);
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | ''>('PENDING');
  const [working, setWorking] = useState<number | null>(null);

  const load = () => {
    apiFetch<{ absences: AbsenceJustification[] }>(
      status ? `/api/absence?status=${status}` : '/api/absence'
    )
      .then((res) => setAbsences(res.absences))
      .catch(() => setAbsences([]));
  };

  useEffect(load, [status]);

  const handleDecision = async (id: number, decision: Exclude<AbsenceStatus, 'PENDING'>) => {
    setWorking(id);
    try {
      await apiFetch(`/api/absence/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: decision }),
      });
      toast.success(decision === 'APPROVED' ? 'Ausência aprovada' : 'Ausência rejeitada');
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar');
    } finally {
      setWorking(null);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={status}
        onChange={(value) => setStatus(value as typeof status)}
        tabs={[
          { value: 'PENDING', label: 'Pendentes' },
          { value: 'APPROVED', label: 'Aprovadas' },
          { value: 'REJECTED', label: 'Rejeitadas' },
          { value: '', label: 'Todas' },
        ]}
      />

      {absences === null ? (
        <Skeleton className="h-48" />
      ) : absences.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nada por aqui"
          description="Não há justificativas nesta lista."
        />
      ) : (
        <ul className="space-y-3">
          {absences.map((absence) => (
            <li key={absence.id}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {absence.alunoId}
                      </div>
                      <div>
                        <p className="font-medium">
                          Aluno #{absence.alunoId} · {formatDate(absence.startDate)} —{' '}
                          {formatDate(absence.endDate)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {absence.cadeiraId
                            ? cadeiras.find((c) => c.id === absence.cadeiraId)?.title ??
                              `Cadeira #${absence.cadeiraId}`
                            : 'Sem cadeira'}
                        </p>
                      </div>
                    </div>
                    <StatusBadge value={absence.status} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{absence.reason}</p>
                  {absence.proofUrl && (
                    <a
                      href={absence.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" /> Ver comprovante
                    </a>
                  )}
                  {absence.status === 'PENDING' && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleDecision(absence.id, 'APPROVED')}
                        disabled={working === absence.id}
                      >
                        <Check className="h-4 w-4" /> Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDecision(absence.id, 'REJECTED')}
                        disabled={working === absence.id}
                      >
                        <X className="h-4 w-4" /> Rejeitar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
