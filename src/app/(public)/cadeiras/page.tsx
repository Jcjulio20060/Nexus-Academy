'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, GraduationCap, User } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import type { Cadeira, PublicProfessor } from '@/lib/types';

export default function CadeirasPage() {
  const [cadeiras, setCadeiras] = useState<Cadeira[] | null>(null);
  const [professores, setProfessores] = useState<PublicProfessor[]>([]);
  const [query, setQuery] = useState('');
  const [semester, setSemester] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch<{ cadeiras: Cadeira[] }>('/api/cadeiras'),
      apiFetch<{ professores: PublicProfessor[] }>('/api/professores'),
    ])
      .then(([cadeirasRes, professoresRes]) => {
        setCadeiras(cadeirasRes.cadeiras);
        setProfessores(professoresRes.professores);
      })
      .catch(() => setCadeiras([]));
  }, []);

  const professorName = useMemo(() => {
    const map = new Map<number, string>();
    for (const professor of professores) {
      map.set(professor.id, professor.name ?? `Professor #${professor.id}`);
    }
    return map;
  }, [professores]);

  const semesters = useMemo(() => {
    if (!cadeiras) return [];
    return Array.from(new Set(cadeiras.map((c) => c.semester).filter((s): s is number => s !== null))).sort(
      (a, b) => a - b
    );
  }, [cadeiras]);

  const filtered = useMemo(() => {
    if (!cadeiras) return [];
    return cadeiras
      .filter((cadeira) => {
        if (semester && cadeira.semester !== Number(semester)) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          cadeira.title.toLowerCase().includes(q) ||
          cadeira.code.toLowerCase().includes(q) ||
          (cadeira.description ?? '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.semester ?? 0) - (b.semester ?? 0) || a.title.localeCompare(b.title));
  }, [cadeiras, query, semester]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      <PageHeader
        title="Cadeiras"
        description="Explore as disciplinas do semestre e veja os detalhes de cada uma."
      />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por código, título ou descrição..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select
          className="sm:w-48"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          aria-label="Filtrar por semestre"
        >
          <option value="">Todos os semestres</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              Semestre {sem}
            </option>
          ))}
        </Select>
      </div>

      {!cadeiras ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhuma cadeira encontrada"
          description="Tente ajustar a busca ou o filtro de semestre."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cadeira) => (
            <Link key={cadeira.id} href={`/cadeiras/${cadeira.id}`}>
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    {cadeira.semester !== null && (
                      <Badge variant="secondary">Semestre {cadeira.semester}</Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {cadeira.code}
                    </p>
                    <h2 className="font-display mt-1 text-lg font-semibold leading-tight">
                      {cadeira.title}
                    </h2>
                    {cadeira.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {cadeira.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {cadeira.credits !== null ? `${cadeira.credits} créditos` : '—'}
                    </span>
                    {cadeira.teacherId !== null && (
                      <span className="flex items-center gap-1.5 truncate">
                        <User className="h-4 w-4 shrink-0" />
                        {professorName.get(cadeira.teacherId) ?? ''}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
