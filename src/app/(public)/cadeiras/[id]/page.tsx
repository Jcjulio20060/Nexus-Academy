'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Clock,
  User,
  MapPin,
  FileText,
  Download,
  FolderDown,
} from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { formatTime, WEEKDAY_LABEL } from '@/lib/format';
import type { Arquivo, Cadeira, Horario, PublicProfessor } from '@/lib/types';

export default function CadeiraDetailPage() {
  const params = useParams<{ id: string }>();
  const cadeiraId = Number(params.id);

  const [cadeira, setCadeira] = useState<Cadeira | null | undefined>(undefined);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [professores, setProfessores] = useState<PublicProfessor[]>([]);

  useEffect(() => {
    if (!Number.isFinite(cadeiraId)) return;
    Promise.all([
      apiFetch<{ cadeiras: Cadeira[] }>('/api/cadeiras'),
      apiFetch<{ horarios: Horario[] }>(`/api/horarios?cadeiraId=${cadeiraId}`),
      apiFetch<{ arquivos: Arquivo[] }>(`/api/arquivos?cadeiraId=${cadeiraId}`),
      apiFetch<{ professores: PublicProfessor[] }>('/api/professores'),
    ])
      .then(([cadeirasRes, horariosRes, arquivosRes, professoresRes]) => {
        setCadeira(cadeirasRes.cadeiras.find((c) => c.id === cadeiraId) ?? null);
        setHorarios(horariosRes.horarios);
        setArquivos(arquivosRes.arquivos);
        setProfessores(professoresRes.professores);
      })
      .catch(() => setCadeira(null));
  }, [cadeiraId]);

  const professor = useMemo(
    () => (cadeira?.teacherId ? professores.find((p) => p.id === cadeira.teacherId) : undefined),
    [cadeira, professores]
  );

  const sortedHorarios = useMemo(
    () =>
      [...horarios].sort((a, b) => {
        const dayOrder: Record<string, number> = {
          MONDAY: 0,
          TUESDAY: 1,
          WEDNESDAY: 2,
          THURSDAY: 3,
          FRIDAY: 4,
          SATURDAY: 5,
          SUNDAY: 6,
        };
        return (dayOrder[a.day] ?? 7) - (dayOrder[b.day] ?? 7) || a.startTime.localeCompare(b.startTime);
      }),
    [horarios]
  );

  if (cadeira === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-4 h-40" />
      </div>
    );
  }

  if (cadeira === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <EmptyState
          icon={BookOpen}
          title="Cadeira não encontrada"
          description="A cadeira que você procura não existe ou foi removida."
          action={
            <Link href="/cadeiras" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Voltar para cadeiras
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <Link
        href="/cadeiras"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Todas as cadeiras
      </Link>

      <PageHeader
        title={cadeira.title}
        description={`${cadeira.code} · Semestre ${cadeira.semester ?? '—'}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Sobre a cadeira</h2>
              <p className="mt-3 text-muted-foreground">
                {cadeira.description ?? 'Sem descrição disponível.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="secondary" className="gap-1.5 py-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {cadeira.credits !== null ? `${cadeira.credits} créditos` : 'Créditos —'}
                </Badge>
                <Badge variant="secondary" className="gap-1.5 py-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {cadeira.code}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display mb-4 text-lg font-semibold">Horários das aulas</h2>
              {sortedHorarios.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Sem horários cadastrados"
                  description="Os horários desta cadeira ainda não foram divulgados."
                />
              ) : (
                <ul className="space-y-3">
                  {sortedHorarios.map((horario) => (
                    <li
                      key={horario.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">{WEEKDAY_LABEL[horario.day]}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(horario.startTime)} — {formatTime(horario.endTime)}
                        </span>
                      </div>
                      {horario.location && (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {horario.location}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold">
                <FolderDown className="h-5 w-5 text-primary" /> Arquivos da cadeira
              </h2>
              {arquivos.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Nenhum arquivo por aqui"
                  description="Materiais e documentos desta cadeira serão publicados em breve."
                />
              ) : (
                <ul className="space-y-2">
                  {arquivos.map((arquivo) => (
                    <li key={arquivo.id}>
                      <a
                        href={arquivo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <FileText className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">
                            <span className="block truncate text-sm font-medium">{arquivo.title}</span>
                            {arquivo.description && (
                              <span className="block truncate text-xs text-muted-foreground">
                                {arquivo.description}
                              </span>
                            )}
                          </span>
                        </span>
                        <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="lg:sticky lg:top-24">
            <CardContent className="p-6">
              <h2 className="font-display text-lg font-semibold">Professor</h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                  {professor?.name
                    ?.split(' ')
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="font-medium">{professor?.name ?? 'A definir'}</p>
                  {professor?.department && (
                    <p className="text-sm text-muted-foreground">{professor.department}</p>
                  )}
                </div>
              </div>
              {professor?.bio && (
                <p className="mt-4 text-sm text-muted-foreground">{professor.bio}</p>
              )}
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Dúvidas sobre a cadeira? Abra um ticket de suporte.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
