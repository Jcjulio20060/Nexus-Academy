import Link from 'next/link';
import { BrandLogo } from '@/components/shell/brand-logo';

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between lg:px-8">
        <div>
          <BrandLogo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            O portal acadêmico do seu dia a dia: cadeiras, horários, eventos, arquivos e suporte —
            tudo em um só lugar.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Portal</span>
            <Link className="text-muted-foreground hover:text-foreground" href="/cadeiras">
              Cadeiras
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/horarios">
              Horários
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/eventos">
              Eventos
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Ajuda</span>
            <Link className="text-muted-foreground hover:text-foreground" href="/arquivos">
              Arquivos
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/faqs">
              FAQs
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/login">
              Entrar
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Coffee &amp; Code. Feito com café.
      </div>
    </footer>
  );
}
