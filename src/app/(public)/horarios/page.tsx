'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock, MapPin, CalendarClock } from 'lucide-react';
import { Card, PageHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { formatTime, sortedWeekdays, todayWeekday, WEEKDAY_SHORT } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Cadeira, Horario, Weekday } from '@/lib/types';

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[] | null>(null);
  const [cadeiras, setCadeiras] = useState<Cadeira[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch<{ horarios: Horario[] }>('/api/horarios'),
      apiFetch<{ cadeiras: Cadeira[] }>('/api/cadeiras'),
    ])
      .then(([horariosRes, cadeirasRes]) => {
        setHorarios(horariosRes.horarios);
        setCadeiras(cadeirasRes.cadeiras);
      })
      .catch(() => setHorarios([]));
  }, []);

  const cadeiraById = useMemo(() => {
    const map = new Map<number, Cadeira>();
    for (const cadeira of cadeiras) map.set(cadeira.id, cadeira);
    return map;
  }, [cadeiras]);

  const byDay = useMemo(() => {
    const grouped = new Map<string, Horario[]>();
    for (const day of sortedWeekdays()) grouped.set(day, []);
    for (const horario of horarios ?? []) {
      grouped.get(horario.day)?.push(horario);
    }
    for (const list of grouped.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return grouped;
  }, [horarios]);

  const today = todayWeekday();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      <PageHeader
        title="Horários"
        description="A grade semanal de aulas do semestre."
      />

      {!horarios ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : horarios.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Nenhum horário cadastrado"
          description="Os horários das aulas ainda não foram divulgados."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from(byDay.entries()).map(([day, list]) => (
            <Card
              key={day}
              className={cn(
                'h-fit',
                day === today && 'border-primary/50 ring-1 ring-primary/20'
              )}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="font-display font-semibold">{WEEKDAY_SHORT[day as Weekday]}</h2>
                {day === today && (
                  <Badge variant="default" className="py-0.5 text-[10px] uppercase">
                    Hoje
                  </Badge>
                )}
              </div>
              <div className="space-y-3 p-4">
                {list.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Sem aulas</p>
                ) : (
                  list.map((horario) => {
                    const cadeira = cadeiraById.get(horario.cadeiraId);
                    return (
                      <div key={horario.id} className="rounded-lg border border-border bg-muted/40 p-3">
                        <p className="text-xs font-medium text-primary">{cadeira?.code ?? `Cadeira #${horario.cadeiraId}`}</p>
                        <p className="mt-0.5 text-sm font-semibold leading-snug">
                          {cadeira?.title ?? 'Cadeira'}
                        </p>
                        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(horario.startTime)} — {formatTime(horario.endTime)}
                          </span>
                          {horario.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {horario.location}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
