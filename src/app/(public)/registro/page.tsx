'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function RegistroPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, username: username || undefined, email, password }),
      });
      await refresh();
      toast.success('Conta criada! Bem-vindo ao Coffee & Code.');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar conta');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 lg:py-24">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
          <Coffee className="h-7 w-7" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Criar conta</h1>
        <p className="mt-2 text-muted-foreground">
          Leva menos de um minuto. Só precisa de um bom café.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Nome completo" htmlFor="name">
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Maria Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field label="Nome de usuário" htmlFor="username" hint="Opcional">
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="maria.silva"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Field>
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
          <Field label="Senha" htmlFor="password" hint="Mínimo de 8 caracteres">
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </Field>
          <Field label="Confirmar senha" htmlFor="confirm">
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
              required
            />
          </Field>
          <Button type="submit" size="lg" disabled={loading} className="mt-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Criar conta
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
