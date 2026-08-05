import { Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandLogo({
  className,
  showText = true,
  textClassName,
}: {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
        <Coffee className="h-5 w-5" />
      </div>
      {showText && (
        <span className={cn('font-display text-lg font-bold tracking-tight', textClassName)}>
          Coffee &amp; Code
        </span>
      )}
    </div>
  );
}
