'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Megaphone,
  BookOpen,
  Clock,
  ArrowRight,
  Coffee,
  CalendarClock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { firstName, formatTime, greeting, todayWeekday, WEEKDAY_SHORT } from '@/lib/format';
import { cn } from '@/lib/utils';
import type {
  AbsenceJustification,
  Cadeira,
  Horario,
  ImportantDate,
  Matricula,
  Notice,
} from '@/lib/types';

const STAFF_ROLES = ['ADMIN', 'TEACHER', 'STAFF'];

export default function DashboardPage() {
  const { user, professor, loading: authLoading } = useAuth();
  const isStaff = !!user && STAFF_ROLES.includes(user.role);

  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cadeiras, setCadeiras] = useState<Cadeira[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<ImportantDate[]>([]);
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [pendingAbsences, setPendingAbsences] = useState<AbsenceJustification[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    Promise.all([
      apiFetch<{ horarios: Horario[] }>('/api/horarios').catch(() => ({ horarios: [] })),
      apiFetch<{ cadeiras: Cadeira[] }>('/api/cadeiras').catch(() => ({ cadeiras: [] })),
      apiFetch<{ notices: Notice[] }>('/api/notices').catch(() => ({ notices: [] })),
      apiFetch<{ events: ImportantDate[] }>('/api/events').catch(() => ({ events: [] })),
    ])
      .then(([horariosRes, cadeirasRes, noticesRes, eventsRes]) => {
        setHorarios(horariosRes.horarios);
        setCadeiras(cadeirasRes.cadeiras);
        setNotices(noticesRes.notices.slice(0, 4));
        setEvents(eventsRes.events);
        setLoaded(true);
      })
      .finally(() => setLoaded(true));
  }, [authLoading]);

  useEffect(() => {
    if (!user || !loaded) return;
    if (user.role === 'STUDENT') {
      apiFetch<{ matriculas: Matricula[] }>('/api/matriculas')
        .then((res) => setMatriculas(res.matriculas))
        .catch(() => undefined);
    } else {
      apiFetch<{ absences: AbsenceJustification[] }>('/api/absence?status=PENDING')
        .then((res) => setPendingAbsences(res.absences))
        .catch(() => undefined);
    }
  }, [user, loaded]);

  const cadeiraById = useMemo(() => {
    const map = new Map<number, Cadeira>();
    for (const cadeira of cadeiras) map.set(cadeira.id, cadeira);
    return map;
  }, [cadeiras]);

  const today = todayWeekday();

  const todaysClasses = useMemo(() => {
    const relevantCadeiraIds = new Set<number>();

    if (user?.role === 'STUDENT') {
      for (const matricula of matriculas) {
        if (matricula.status === 'ENROLLED' || matricula.status === 'WAITLISTED') {
          relevantCadeiraIds.add(matricula.cadeiraId);
        }
      }
    } else if (professor) {
      for (const horario of horarios) {
        if (horario.professorId === professor.id) relevantCadeiraIds.add(horario.cadeiraId);
      }
    } else {
      for (const horario of horarios) relevantCadeiraIds.add(horario.cadeiraId);
    }

    return horarios
      .filter(
        (horario) =>
          horario.day === today &&
          (relevantCadeiraIds.size === 0 || relevantCadeiraIds.has(horario.cadeiraId))
      )
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [user, professor, horarios, matriculas, today]);

  const enrolledCadeiras = useMemo(() => {
    const ids = new Set(matriculas.map((m) => m.cadeiraId));
    return cadeiras.filter((cadeira) => ids.has(cadeira.id));
  }, [cadeiras, matriculas]);

  const upcomingEvents = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return events
      .filter((event) => new Date(event.date) >= todayStart)
      .slice(0, 3);
  }, [events]);

  if (authLoading || !loaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground shadow-lg">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative">
          <Badge className="mb-3 bg-primary-foreground/15 py-1 text-primary-foreground">
            <Coffee className="h-3.5 w-3.5" /> {greeting()}!
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {firstName(user?.name) || user?.username}
          </h1>
          <p className="mt-2 max-w-xl text-primary-foreground/80">
            {isStaff
              ? 'Tenha uma boa aula e aproveite o dia.'
              : 'Confira sua grade de hoje e o que está acontecendo no portal.'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold">
              <CalendarClock className="h-5 w-5 text-primary" /> Aulas de hoje · {WEEKDAY_SHORT[today]}
            </h2>
            {todaysClasses.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="Nenhuma aula hoje"
                description="Aproveite o tempo livre com um bom café."
              />
            ) : (
              <ul className="space-y-3">
                {todaysClasses.map((horario) => {
                  const cadeira = cadeiraById.get(horario.cadeiraId);
                  return (
                    <li
                      key={horario.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-primary">
                          {cadeira?.code ?? `Cadeira #${horario.cadeiraId}`}
                        </p>
                        <p className="truncate font-medium">{cadeira?.title ?? 'Cadeira'}</p>
                      </div>
                      <div className="shrink-0 text-right text-sm text-muted-foreground">
                        <p>
                          {formatTime(horario.startTime)} — {formatTime(horario.endTime)}
                        </p>
                        {horario.location && <p className="text-xs">{horario.location}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isStaff ? (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display mb-3 text-lg font-semibold">Ausências pendentes</h2>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {pendingAbsences.length === 0
                      ? 'Nenhuma justificativa aguardando revisão.'
                      : `${pendingAbsences.length} justificativa${pendingAbsences.length > 1 ? 's' : ''} aguardando revisão.`}
                  </p>
                  <Link href="/ausencias">
                    <Button size="sm" variant="outline">
                      Revisar
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold">
                  <BookOpen className="h-5 w-5 text-primary" /> Minhas cadeiras
                </h2>
                {enrolledCadeiras.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="Você ainda não se matriculou"
                    description="Explore as cadeiras do semestre e faça sua matrícula."
                    action={
                      <Link href="/cadeiras">
                        <Button size="sm" variant="outline">
                          Ver cadeiras
                        </Button>
                      </Link>
                    }
                  />
                ) : (
                  <ul className="space-y-2">
                    {enrolledCadeiras.map((cadeira) => (
                      <li key={cadeira.id}>
                        <Link
                          href={`/cadeiras/${cadeira.id}`}
                          className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/40"
                        >
                          <span className="min-w-0">
                            <span className="block text-xs font-medium text-primary">
                              {cadeira.code}
                            </span>
                            <span className="block truncate font-medium">{cadeira.title}</span>
                          </span>
                          {cadeira.semester !== null && (
                            <Badge variant="secondary">Sem {cadeira.semester}</Badge>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h2 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold">
                <Megaphone className="h-5 w-5 text-primary" /> Avisos recentes
              </h2>
              {notices.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum aviso publicado.</p>
              ) : (
                <ul className="space-y-3">
                  {notices.map((notice) => (
                    <li key={notice.id} className="flex items-start gap-3">
                      <div className={cn('mt-1 h-2 w-2 shrink-0 rounded-full', notice.isPinned ? 'bg-primary' : 'bg-muted-foreground')} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{notice.title}</p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">{notice.content}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/avisos"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Ver todos <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-primary" /> Próximos eventos
          </h2>
          <Link href="/eventos" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        {upcomingEvents.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Nenhum evento em breve"
            description="Novidades do calendário acadêmico aparecerão aqui."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Link key={event.id} href="/eventos">
                <Card className="h-full transition-colors hover:border-primary/40">
                  <CardContent className="p-5">
                    <StatusBadge value={event.category} />
                    <p className="font-display mt-3 font-semibold leading-snug">{event.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
