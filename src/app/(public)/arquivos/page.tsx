'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { FolderDown, FileText, Upload, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, PageHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Tabs } from '@/components/ui/tabs';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { useAuth } from '@/lib/auth-context';
import type { Arquivo, Cadeira, FileCategory } from '@/lib/types';

const CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'MATERIAL', label: 'Material' },
  { value: 'DOCUMENT', label: 'Documento' },
  { value: 'ANNOUNCEMENT', label: 'Comunicado' },
  { value: 'OTHER', label: 'Outro' },
];

export default function ArquivosPage() {
  const { user } = useAuth();
  const [arquivos, setArquivos] = useState<Arquivo[] | null>(null);
  const [cadeiras, setCadeiras] = useState<Cadeira[]>([]);
  const [category, setCategory] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = () => {
    apiFetch<{ arquivos: Arquivo[] }>('/api/arquivos')
      .then((res) => setArquivos(res.arquivos))
      .catch(() => setArquivos([]));
  };

  useEffect(() => {
    load();
    apiFetch<{ cadeiras: Cadeira[] }>('/api/cadeiras')
      .then((res) => setCadeiras(res.cadeiras))
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => {
    if (!arquivos) return [];
    if (!category) return arquivos;
    return arquivos.filter((arquivo) => arquivo.category === category);
  }, [arquivos, category]);

  const cadeiraById = useMemo(() => {
    const map = new Map<number, Cadeira>();
    for (const cadeira of cadeiras) map.set(cadeira.id, cadeira);
    return map;
  }, [cadeiras]);

  const handleDelete = async (arquivo: Arquivo) => {
    try {
      await apiFetch(`/api/arquivos/${arquivo.id}`, { method: 'DELETE' });
      toast.success('Arquivo removido');
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao remover arquivo');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <PageHeader
        title="Arquivos"
        description="Materiais, documentos e comunicados para download."
        action={
          user ? (
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="h-4 w-4" /> Enviar arquivo
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="outline">Entrar para enviar</Button>
            </Link>
          )
        }
      />

      <div className="mb-8">
        <Tabs
          value={category}
          onChange={setCategory}
          tabs={CATEGORIES}
        />
      </div>

      {!arquivos ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FolderDown}
          title="Nenhum arquivo encontrado"
          description="Materiais e documentos aparecerão aqui conforme forem publicados."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((arquivo) => {
            const cadeira = arquivo.cadeiraId ? cadeiraById.get(arquivo.cadeiraId) : undefined;
            const canDelete = user && (user.role === 'ADMIN' || user.id === arquivo.uploadedById);
            return (
              <Card key={arquivo.id} className="flex flex-col">
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary">{arquivo.category}</Badge>
                  </div>
                  <a
                    href={arquivo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 font-medium hover:text-primary hover:underline"
                  >
                    {arquivo.title}
                  </a>
                  {arquivo.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{arquivo.description}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>
                      {cadeira ? cadeira.code : 'Geral'} · {formatDate(arquivo.uploadedAt)}
                    </span>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(arquivo)}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-error/10 hover:text-error"
                        aria-label={`Remover ${arquivo.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {user && (
        <UploadModal
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          cadeiras={cadeiras}
          onUploaded={load}
        />
      )}
    </div>
  );
}

function UploadModal({
  open,
  onClose,
  cadeiras,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  cadeiras: Cadeira[];
  onUploaded: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FileCategory>('MATERIAL');
  const [cadeiraId, setCadeiraId] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('MATERIAL');
    setCadeiraId('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!file || !title.trim()) {
      toast.error('Escolha um arquivo e informe um título');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploaded = await apiFetch<{ url: string }>('/api/arquivos/upload', {
        method: 'POST',
        body: formData,
      });

      await apiFetch('/api/arquivos', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          url: uploaded.url,
          category,
          cadeiraId: cadeiraId ? Number(cadeiraId) : undefined,
        }),
      });

      toast.success('Arquivo enviado!');
      handleClose();
      onUploaded();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar arquivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Enviar arquivo"
      description="O arquivo é publicado publicamente no portal."
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Enviar
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Arquivo" hint={file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB` : undefined}>
          <input
            ref={fileRef}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-muted-foreground file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
          />
        </Field>
        <Field label="Título" htmlFor="upload-title">
          <Input
            id="upload-title"
            placeholder="Ex.: Slides da aula 3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Descrição" htmlFor="upload-description">
          <Textarea
            id="upload-description"
            rows={2}
            placeholder="Detalhes sobre o arquivo (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Categoria" htmlFor="upload-category">
            <Select
              id="upload-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as FileCategory)}
            >
              <option value="MATERIAL">Material</option>
              <option value="DOCUMENT">Documento</option>
              <option value="ANNOUNCEMENT">Comunicado</option>
              <option value="OTHER">Outro</option>
            </Select>
          </Field>
          <Field label="Cadeira (opcional)" htmlFor="upload-cadeira">
            <Select id="upload-cadeira" value={cadeiraId} onChange={(e) => setCadeiraId(e.target.value)}>
              <option value="">Nenhuma</option>
              {cadeiras.map((cadeira) => (
                <option key={cadeira.id} value={cadeira.id}>
                  {cadeira.code} — {cadeira.title}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>
    </Modal>
  );
}
