'use client';

import { useEffect, useMemo, useState } from 'react';
import { Megaphone, Pin } from 'lucide-react';
import { Card, PageHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/format';
import type { Notice } from '@/lib/types';

const AUDIENCE_LABEL: Record<string, string> = {
  ALL: 'Todos',
  STUDENTS: 'Alunos',
  TEACHERS: 'Professores',
  STAFF: 'Equipe',
};

export default function AvisosPage() {
  const [notices, setNotices] = useState<Notice[] | null>(null);

  useEffect(() => {
    apiFetch<{ notices: Notice[] }>('/api/notices')
      .then((res) => setNotices(res.notices))
      .catch(() => setNotices([]));
  }, []);

  const sorted = useMemo(() => {
    if (!notices) return [];
    return [...notices].sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  }, [notices]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      <PageHeader
        title="Avisos"
        description="Comunicados oficiais do Coffee & Code."
      />

      {!notices ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Nenhum aviso publicado"
          description="Os comunicados oficiais aparecerão aqui."
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((notice) => (
            <Card
              key={notice.id}
              className={notice.isPinned ? 'border-primary/50 ring-1 ring-primary/20' : undefined}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <Pin className="h-3 w-3" /> Fixado
                      </span>
                    )}
                    <StatusBadge value={notice.category} />
                    <Badge variant="secondary">{AUDIENCE_LABEL[notice.audience] ?? notice.audience}</Badge>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(notice.publishedAt)}
                  </span>
                </div>
                <h2 className="font-display mt-3 text-lg font-semibold">{notice.title}</h2>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {notice.content}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
