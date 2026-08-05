'use client';

import Link from 'next/link';
import { UserRound, GraduationCap, Briefcase, Mail, AtSign, Phone, Shield } from 'lucide-react';
import { Card, CardContent, PageHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/types';

const ROLE_LABEL: Record<UserRole, string> = {
  STUDENT: 'Aluno',
  TEACHER: 'Professor',
  ADMIN: 'Administrador',
  STAFF: 'Equipe',
};

export default function PerfilPage() {
  const { user, aluno, professor, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-6 h-64" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Meu perfil" description="Suas informações e perfis acadêmicos." />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar name={user.name} className="h-20 w-20 text-2xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-bold">{user.name ?? user.username}</h2>
              <Badge variant="default">{ROLE_LABEL[user.role]}</Badge>
            </div>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
              {user.username && (
                <p className="flex items-center gap-2">
                  <AtSign className="h-4 w-4" /> @{user.username}
                </p>
              )}
              {user.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {user.phone}
                </p>
              )}
            </div>
          </div>
          <Link href="/tickets">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4" /> Falar com suporte
            </Button>
          </Link>
        </CardContent>
      </Card>

      {aluno && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold">
              <GraduationCap className="h-5 w-5 text-primary" /> Perfil de aluno
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Matrícula" value={aluno.registrationNumber} />
              <Info label="Curso" value={aluno.course} />
              <Info label="Ano" value={String(aluno.year)} />
              <Info label="Status" value={aluno.active ? 'Ativo' : 'Inativo'} />
            </div>
          </CardContent>
        </Card>
      )}

      {professor && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-display mb-4 flex items-center gap-2 text-lg font-semibold">
              <Briefcase className="h-5 w-5 text-primary" /> Perfil de professor
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Funcional" value={professor.employeeNumber} />
              <Info label="Departamento" value={professor.department} />
              <Info label="Status" value={professor.active ? 'Ativo' : 'Inativo'} />
              {professor.bio && (
                <div className="sm:col-span-2">
                  <Info label="Bio" value={professor.bio} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!aluno && !professor && (
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <UserRound className="h-5 w-5 shrink-0 text-primary" />
          <p>
            Seu perfil ainda não tem dados acadêmicos. Fale com a administração para vincular seu
            perfil de aluno ou professor.
          </p>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
