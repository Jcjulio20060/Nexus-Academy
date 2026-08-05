'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Coffee, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await refresh();
      toast.success('Bem-vindo de volta!');
      router.push(searchParams.get('next') ?? '/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao entrar');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="E-mail" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Field>
      <Field label="Senha" htmlFor="password">
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Field>
      <Button type="submit" size="lg" disabled={loading} className="mt-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Entrar
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 lg:py-24">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
          <Coffee className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
        <p className="mt-2 text-muted-foreground">
          Entre na sua conta para acessar o portal.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/registro" className="font-medium text-primary hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
