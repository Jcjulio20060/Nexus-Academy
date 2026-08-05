'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { LifeBuoy, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, PageHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { Ticket, TicketPriority } from '@/lib/types';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = () => {
    apiFetch<{ tickets: Ticket[] }>('/api/tickets')
      .then((res) => setTickets(res.tickets))
      .catch(() => setTickets([]));
  };

  useEffect(load, []);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Suporte"
        description="Abra um ticket e acompanhe a resolução."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Novo ticket
          </Button>
        }
      />

      {tickets === null ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="Nenhum ticket aberto"
          description="Precisa de ajuda? Abra um ticket e nossa equipe vai te responder."
        />
      ) : (
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link href={`/tickets/${ticket.id}`}>
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Ticket #{ticket.id} · {formatDateTime(ticket.createdAt)}
                        </p>
                        <h2 className="font-display mt-1 font-semibold">{ticket.subject}</h2>
                        {ticket.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {ticket.description}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StatusBadge value={ticket.status} />
                        <StatusBadge value={ticket.priority} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <CreateTicketModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={load} />
    </div>
  );
}

function CreateTicketModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setSubject('');
    setDescription('');
    setPriority('MEDIUM');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!subject.trim()) return;
    setLoading(true);
    try {
      await apiFetch('/api/tickets', {
        method: 'POST',
        body: JSON.stringify({
          subject: subject.trim(),
          description: description.trim() || undefined,
          priority,
        }),
      });
      toast.success('Ticket criado!');
      handleClose();
      onCreated();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Novo ticket"
      description="Descreva o problema que a equipe precisa resolver."
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="ticket-form" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Criar ticket
          </Button>
        </>
      }
    >
      <form id="ticket-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Assunto" htmlFor="ticket-subject">
          <Input
            id="ticket-subject"
            placeholder="Ex.: Não consigo acessar meus arquivos"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </Field>
        <Field label="Descrição" htmlFor="ticket-description">
          <Textarea
            id="ticket-description"
            rows={4}
            placeholder="Conte mais detalhes sobre o problema..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="Prioridade" htmlFor="ticket-priority">
          <Select
            id="ticket-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </Select>
        </Field>
      </form>
    </Modal>
  );
}
