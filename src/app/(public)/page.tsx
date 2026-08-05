import Link from "next/link";
import {
  Coffee,
  CalendarDays,
  BookOpen,
  Clock,
  Megaphone,
  FolderDown,
  LifeBuoy,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Cadeiras e horários",
    description:
      "Navegue pelas cadeiras do semestre, veja créditos e consulte a grade semanal de aulas.",
  },
  {
    icon: CalendarDays,
    title: "Eventos importantes",
    description:
      "Provas, projetos, prazos e atividades em um calendário único, sempre atualizado.",
  },
  {
    icon: Megaphone,
    title: "Avisos",
    description:
      "Fique por dentro dos comunicados oficiais, com destaques para os mais recentes.",
  },
  {
    icon: FolderDown,
    title: "Arquivos",
    description:
      "Materiais e documentos organizados por categoria, disponíveis para download.",
  },
  {
    icon: Clock,
    title: "Justifique ausências",
    description:
      "Envie justificativas de falta online e acompanhe a aprovação em tempo real.",
  },
  {
    icon: LifeBuoy,
    title: "Suporte",
    description:
      "Abra tickets de atendimento e acompanhe cada resposta da equipe.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(180,83,9,0.12),transparent_55%)]"
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center lg:px-8 lg:py-28">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Coffee className="h-4 w-4 text-primary" />
            Portal Acadêmico
          </div>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Seu semestre começa com um{" "}
            <span className="text-primary">bom café</span> e informação na mão
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Cadeiras, horários, eventos, avisos, arquivos e suporte — tudo o que a sua vida
            acadêmica precisa, em um único lugar.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/registro">
              <Button size="lg">
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cadeiras">
              <Button size="lg" variant="outline">
                Ver cadeiras
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-3 lg:px-8">
          {[
            { value: "7", label: "dias da semana de horários" },
            { value: "6", label: "categorias de conteúdo" },
            { value: "24h", label: "acesso ao portal" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight">Tudo que você precisa</h2>
          <p className="mt-2 text-muted-foreground">
            Ferramentas pensadas para o dia a dia de quem estuda.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-gradient-to-br from-primary to-accent p-10 text-center text-primary-foreground shadow-lg lg:p-14">
          <GraduationCap className="h-10 w-10" />
          <h2 className="font-display max-w-xl text-3xl font-bold tracking-tight">
            Pronto para viver o melhor semestre da sua vida?
          </h2>
          <p className="max-w-lg text-primary-foreground/80">
            Crie sua conta em menos de um minuto e aproveite tudo que o Coffee &amp; Code tem a
            oferecer.
          </p>
          <Link href="/registro">
            <Button
              size="lg"
              className="bg-primary-foreground text-accent hover:bg-primary-foreground/90"
            >
              Criar minha conta
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
