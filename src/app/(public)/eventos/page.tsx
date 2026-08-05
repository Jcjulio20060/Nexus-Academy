'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { Card, PageHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/format';
import type { ImportantDate } from '@/lib/types';

type Filter = 'todos' | 'proximos' | 'passados';

export default function EventosPage() {
  const [events, setEvents] = useState<ImportantDate[] | null>(null);
  const [filter, setFilter] = useState<Filter>('proximos');

  useEffect(() => {
    apiFetch<{ events: ImportantDate[] }>('/api/events')
      .then((res) => setEvents(res.events))
      .catch(() => setEvents([]));
  }, []);

  const filtered = useMemo(() => {
    if (!events) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (filter === 'todos') return events;
    if (filter === 'passados') return events.filter((event) => new Date(event.date) < today);
    return events.filter((event) => new Date(event.date) >= today);
  }, [events, filter]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <PageHeader
        title="Eventos"
        description="Provas, prazos, atividades e datas importantes do calendário acadêmico."
        action={
          <Tabs
            value={filter}
            onChange={(value) => setFilter(value as Filter)}
            tabs={[
              { value: 'proximos', label: 'Próximos' },
              { value: 'passados', label: 'Passados' },
              { value: 'todos', label: 'Todos' },
            ]}
          />
        }
      />

      {!events ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhum evento por aqui"
          description="Não há eventos nesta lista no momento."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => {
            const date = new Date(event.date);
            return (
              <Card key={event.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="text-lg font-bold leading-none">{date.getDate()}</span>
                    <span className="text-[10px] font-medium uppercase">
                      {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">{event.title}</h2>
                      <StatusBadge value={event.category} />
                    </div>
                    {event.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(event.date)}
                        {event.endDate && ` — ${formatDate(event.endDate)}`}
                      </span>
                      {!event.allDay && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {formatTime(date.toTimeString().slice(0, 5))}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
