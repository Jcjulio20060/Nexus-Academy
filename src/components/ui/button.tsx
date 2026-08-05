import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap select-none';

const variants = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-accent',
  secondary: 'bg-muted text-foreground hover:bg-muted/70',
  outline: 'border border-border bg-background text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
  destructive: 'bg-error text-white hover:bg-error/90',
  success: 'bg-success text-white hover:bg-success/90',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4',
  lg: 'h-11 px-6 text-base',
  icon: 'h-9 w-9',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
