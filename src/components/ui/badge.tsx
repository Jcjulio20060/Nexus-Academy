import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const base = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium';

export const badgeVariants = {
  default: 'bg-primary/10 text-primary',
  secondary: 'bg-muted text-muted-foreground',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  info: 'bg-info/10 text-info',
  outline: 'border border-border text-muted-foreground',
};

export type BadgeVariant = keyof typeof badgeVariants;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn(base, badgeVariants[variant], className)} {...props} />;
}
