import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const categoria = url.searchParams.get('category');
  const alunoId = url.searchParams.get('alunoId');
  const professorId = url.searchParams.get('professorId');
  const cadeiraId = url.searchParams.get('cadeiraId');

  const filters: Record<string, unknown> = {};

  if (categoria) filters.category = categoria;
  if (alunoId) {
    const parsed = Number(alunoId);
    if (Number.isNaN(parsed)) return badRequest('alunoId must be a number');
    filters.alunoId = parsed;
  }
  if (professorId) {
    const parsed = Number(professorId);
    if (Number.isNaN(parsed)) return badRequest('professorId must be a number');
    filters.professorId = parsed;
  }
  if (cadeiraId) {
    const parsed = Number(cadeiraId);
    if (Number.isNaN(parsed)) return badRequest('cadeiraId must be a number');
    filters.cadeiraId = parsed;
  }

  const arquivos = Object.keys(filters).length
    ? await db.orm.public.Arquivo.where(filters).all()
    : await db.orm.public.Arquivo.all();

  return json({ arquivos });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { title, description, url, category, alunoId, professorId, cadeiraId, visible } = body as {
    title?: string;
    description?: string;
    url?: string;
    category?: 'MATERIAL' | 'DOCUMENT' | 'ANNOUNCEMENT' | 'OTHER';
    alunoId?: number | string;
    professorId?: number | string;
    cadeiraId?: number | string;
    visible?: boolean;
  };

  if (!title || !url) return badRequest('title and url are required');

  const alunoIdParsed = alunoId !== undefined && alunoId !== null ? Number(alunoId) : undefined;
  if (alunoId !== undefined && alunoId !== null && Number.isNaN(alunoIdParsed)) {
    return badRequest('alunoId must be a number');
  }

  const professorIdParsed = professorId !== undefined && professorId !== null ? Number(professorId) : undefined;
  if (professorId !== undefined && professorId !== null && Number.isNaN(professorIdParsed)) {
    return badRequest('professorId must be a number');
  }

  const cadeiraIdParsed = cadeiraId !== undefined && cadeiraId !== null ? Number(cadeiraId) : undefined;
  if (cadeiraId !== undefined && cadeiraId !== null && Number.isNaN(cadeiraIdParsed)) {
    return badRequest('cadeiraId must be a number');
  }

  const arquivo = await db.orm.public.Arquivo.create({
    title,
    description,
    url,
    category: category ?? 'OTHER',
    visible: visible ?? true,
    uploadedById: user.id,
    alunoId: alunoIdParsed,
    professorId: professorIdParsed,
    cadeiraId: cadeiraIdParsed,
  });

  return json({ arquivo }, 201);
}
