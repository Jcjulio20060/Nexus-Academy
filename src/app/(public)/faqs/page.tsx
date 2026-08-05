'use client';

import { useEffect, useMemo, useState } from 'react';
import { HelpCircle, ChevronDown, Coffee } from 'lucide-react';
import { Card, PageHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { FAQ } from '@/lib/types';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQ[] | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<{ faqs: FAQ[] }>('/api/faqs')
      .then((res) => setFaqs(res.faqs))
      .catch(() => setFaqs([]));
  }, []);

  const categories = useMemo(() => {
    if (!faqs) return [];
    return Array.from(new Set(faqs.map((faq) => faq.category).filter((c): c is string => Boolean(c))));
  }, [faqs]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8">
      <PageHeader
        title="Perguntas frequentes"
        description="Respostas rápidas para as dúvidas mais comuns."
      />

      {!faqs ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="Nenhuma pergunta cadastrada"
          description="Em breve as perguntas frequentes estarão disponíveis."
        />
      ) : (
        <div className="space-y-4">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {faqs.map((faq) => {
              const open = openId === faq.id;
              return (
                <Card key={faq.id} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="flex items-center gap-3 font-medium">
                      <HelpCircle className="h-4 w-4 shrink-0 text-primary" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-border bg-muted/40 px-5 py-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <Coffee className="h-5 w-5 shrink-0 text-primary" />
            Não encontrou sua resposta? Abra um ticket de suporte e a equipe vai te ajudar.
          </div>
        </div>
      )}
    </div>
  );
}
