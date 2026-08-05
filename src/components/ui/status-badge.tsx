import { Badge, type BadgeVariant } from '@/components/ui/badge';

const STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  PENDING: { label: 'Pendente', variant: 'warning' },
  APPROVED: { label: 'Aprovado', variant: 'success' },
  REJECTED: { label: 'Rejeitado', variant: 'error' },
  OPEN: { label: 'Aberto', variant: 'info' },
  PENDING_TICKET: { label: 'Em análise', variant: 'warning' },
  RESOLVED: { label: 'Resolvido', variant: 'success' },
  CLOSED: { label: 'Fechado', variant: 'secondary' },
  ENROLLED: { label: 'Matriculado', variant: 'success' },
  WAITLISTED: { label: 'Lista de espera', variant: 'warning' },
  DROPPED: { label: 'Cancelado', variant: 'error' },
  COMPLETED: { label: 'Concluído', variant: 'info' },
  LOW: { label: 'Baixa', variant: 'secondary' },
  MEDIUM: { label: 'Média', variant: 'warning' },
  HIGH: { label: 'Alta', variant: 'error' },
  URGENT: { label: 'Urgente', variant: 'error' },
  EXAM: { label: 'Prova', variant: 'error' },
  PROJECT: { label: 'Projeto', variant: 'info' },
  ACTIVITY: { label: 'Atividade', variant: 'warning' },
  DEADLINE: { label: 'Prazo', variant: 'error' },
  EVENT: { label: 'Evento', variant: 'success' },
  OTHER: { label: 'Outro', variant: 'secondary' },
  GENERAL: { label: 'Geral', variant: 'secondary' },
  ALERT: { label: 'Alerta', variant: 'error' },
  MAINTENANCE: { label: 'Manutenção', variant: 'warning' },
  REMINDER: { label: 'Lembrete', variant: 'info' },
  MATERIAL: { label: 'Material', variant: 'default' },
  DOCUMENT: { label: 'Documento', variant: 'info' },
  ANNOUNCEMENT: { label: 'Comunicado', variant: 'warning' },
};

export function StatusBadge({ value }: { value: string }) {
  const entry = STATUS_MAP[value];
  if (!entry) return <Badge variant="secondary">{value}</Badge>;
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
