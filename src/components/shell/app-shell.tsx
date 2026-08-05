'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarClock,
  BookOpen,
  CalendarDays,
  Megaphone,
  FolderDown,
  HelpCircle,
  LifeBuoy,
  Shield,
  UserRound,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { BrandLogo } from '@/components/shell/brand-logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Acadêmico',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/horarios', label: 'Meu horário', icon: CalendarClock },
      { href: '/cadeiras', label: 'Cadeiras', icon: BookOpen },
      { href: '/ausencias', label: 'Ausências', icon: CalendarDays },
    ],
  },
  {
    title: 'Comunidade',
    items: [
      { href: '/eventos', label: 'Eventos', icon: CalendarDays },
      { href: '/avisos', label: 'Avisos', icon: Megaphone },
      { href: '/arquivos', label: 'Arquivos', icon: FolderDown },
      { href: '/faqs', label: 'FAQs', icon: HelpCircle },
      { href: '/tickets', label: 'Suporte', icon: LifeBuoy },
    ],
  },
  {
    title: 'Administração',
    items: [{ href: '/admin', label: 'Admin', icon: Shield, roles: ['ADMIN'] }],
  },
];

const ROLE_LABEL: Record<UserRole, string> = {
  STUDENT: 'Aluno',
  TEACHER: 'Professor',
  ADMIN: 'Administrador',
  STAFF: 'Equipe',
};

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.roles || (user && item.roles.includes(user.role))),
  })).filter((section) => section.items.length > 0);

  const handleLogout = async () => {
    await logout();
    toast.success('Até a próxima!');
    router.push('/');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/dashboard" onClick={onNavigate}>
          <BrandLogo />
        </Link>
        <button
          className="rounded-md p-1 text-muted-foreground hover:bg-muted lg:hidden"
          onClick={onNavigate}
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {visibleSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-3 flex items-center gap-3 px-2">
          <Avatar name={user?.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.name ?? user?.username}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user ? ROLE_LABEL[user.role] : ''}
            </p>
          </div>
        </div>
        <Link
          href="/perfil"
          onClick={onNavigate}
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <UserRound className="h-4 w-4" />
          Meu perfil
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-error"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur lg:px-8">
      <button
        className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
        onClick={onMenu}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden sm:block">
        <p className="text-sm text-muted-foreground">Portal Acadêmico</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link href="/perfil" className="hidden sm:block">
          <Avatar name={user?.name ?? user?.username} />
        </Link>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onNavigate={() => setOpen(false)} />
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="lg:pl-64">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
