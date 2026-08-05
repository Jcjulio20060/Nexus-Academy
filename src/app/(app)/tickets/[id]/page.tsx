'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Send, Loader2, LifeBuoy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { TicketStatus, TicketWithNames } from '@/lib/types';
import type { TicketMessage } from '@/lib/types';

const STAFF_ROLES = ['ADMIN', 'STAFF'];

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'OPEN', label: 'Aberto' },
  { value: 'PENDING', label: 'Em análise' },
  { value: 'RESOLVED', label: 'Resolvido' },
  { value: 'CLOSED', label: 'Fechado' },
];

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticketId = Number(params.id);
  const { user } = useAuth();

  const [ticket, setTicket] = useState<TicketWithNames | null | undefined>(undefined);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [body, setBody] = useState('');
  const [internal, setInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isStaff = !!user && STAFF_ROLES.includes(user.role);

  const load = () => {
    if (!Number.isFinite(ticketId)) return;
    Promise.all([
      apiFetch<{ ticket: TicketWithNames }>(`/api/tickets/${ticketId}`),
      apiFetch<{ messages: TicketMessage[] }>(`/api/tickets/${ticketId}/messages`),
    ])
      .then(([ticketRes, messagesRes]) => {
        setTicket(ticketRes.ticket);
        setMessages(messagesRes.messages);
      })
      .catch(() => setTicket(null));
  };

  useEffect(load, [ticketId]);

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    if (!body.trim() || sending) return;
    setSending(true);
    try {
      await apiFetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body: body.trim(), internal }),
      });
      setBody('');
      setInternal(false);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const handleStatus = async (status: TicketStatus) => {
    if (!ticket || updating) return;
    setUpdating(true);
    try {
      await apiFetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      toast.success('Ticket atualizado');
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar ticket');
    } finally {
      setUpdating(false);
    }
  };

  if (ticket === undefined) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64" />
      </div>
    );
  }

  if (ticket === null) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Meus tickets
        </Link>
        <div className="mt-8 flex flex-col items-center gap-3 py-16 text-center">
          <LifeBuoy className="h-8 w-8 text-muted-foreground" />
          <p className="font-medium">Ticket não encontrado</p>
          <p className="text-sm text-muted-foreground">
            Você não tem acesso a este ticket ou ele não existe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/tickets"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Meus tickets
      </Link>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Ticket #{ticket.id} · aberto em {formatDateTime(ticket.createdAt)}
            </p>
            <div className="flex items-center gap-2">
              <StatusBadge value={ticket.status} />
              <StatusBadge value={ticket.priority} />
            </div>
          </div>
          <h1 className="font-display mt-3 text-2xl font-bold tracking-tight">{ticket.subject}</h1>
          {ticket.description && (
            <p className="mt-2 whitespace-pre-line text-muted-foreground">{ticket.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            <span>
              Solicitado por: <span className="font-medium text-foreground">{ticket.requesterName}</span>
            </span>
            {ticket.assignedName && (
              <span>
                Atendente: <span className="font-medium text-foreground">{ticket.assignedName}</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {isStaff && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={ticket.status}
            onChange={(value) => handleStatus(value as TicketStatus)}
            tabs={STATUS_OPTIONS}
          />
          {updating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      )}

      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhuma mensagem ainda. Envie a primeira abaixo.
          </p>
        ) : (
          messages.map((message) => {
            const mine = user?.id === message.senderId;
            return (
              <div key={message.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl border px-4 py-3',
                    mine ? 'border-primary/30 bg-primary/10' : 'border-border bg-card',
                    message.internal && 'border-dashed'
                  )}
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {mine ? 'Você' : message.senderName}
                    </span>
                    {message.internal && <Badge variant="secondary">Interna</Badge>}
                    <span>{formatDateTime(message.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-line text-sm">{message.body}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend} className="mt-8 flex flex-col gap-3">
        <Textarea
          rows={3}
          placeholder="Escreva sua mensagem..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="bg-card"
        />
        <div className="flex items-center justify-between gap-3">
          {isStaff ? (
            <button
              type="button"
              onClick={() => setInternal((value) => !value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                internal
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              )}
            >
              <Check className="h-3.5 w-3.5" />
              Mensagem interna
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">
              Mensagens são visíveis para a equipe de suporte.
            </span>
          )}
          <Button type="submit" disabled={sending || !body.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
