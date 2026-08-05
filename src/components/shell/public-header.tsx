'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/shell/brand-logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/cadeiras', label: 'Cadeiras' },
  { href: '/horarios', label: 'Horários' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/arquivos', label: 'Arquivos' },
  { href: '/faqs', label: 'FAQs' },
];

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
        <Link href="/" aria-label="Início">
          <BrandLogo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground',
                pathname.startsWith(link.href) && 'text-foreground font-medium'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="sm">Criar conta</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
