import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, requireRole, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['TEACHER', 'ADMIN']);
  if (guard) return guard;

  const { id } = await params;
  const cadeiraId = parseId(id);
  if (cadeiraId === null) return badRequest('Invalid cadeira id');

  const cadeira = await db.orm.public.Cadeira.where({ id: cadeiraId }).first();
  if (!cadeira) return notFound('Cadeira not found');

  const body = await req.json();
  const { code, title, description, credits, semester, teacherId } = body as {
    code?: string;
    title?: string;
    description?: string;
    credits?: number | string | null;
    semester?: number | string | null;
    teacherId?: number | string | null;
  };

  const data: {
    code?: string;
    title?: string;
    description?: string;
    credits?: number | null;
    semester?: number | null;
    teacherId?: number | null;
  } = {};

  if (code !== undefined) data.code = code;
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;

  if (credits !== undefined && credits !== null) {
    const parsed = Number(credits);
    if (Number.isNaN(parsed)) return badRequest('credits must be a number');
    data.credits = parsed;
  } else if (credits === null) {
    data.credits = null;
  }

  if (semester !== undefined && semester !== null) {
    const parsed = Number(semester);
    if (Number.isNaN(parsed)) return badRequest('semester must be a number');
    data.semester = parsed;
  } else if (semester === null) {
    data.semester = null;
  }

  if (teacherId !== undefined && teacherId !== null) {
    const parsed = Number(teacherId);
    if (Number.isNaN(parsed)) return badRequest('teacherId must be a number');
    const professor = await db.orm.public.Professor.where({ id: parsed }).first();
    if (!professor) return notFound('Professor not found');
    data.teacherId = parsed;
  } else if (teacherId === null) {
    data.teacherId = null;
  }

  const updated = await db.orm.public.Cadeira.where({ id: cadeiraId }).update(data);
  return json({ cadeira: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN']);
  if (guard) return guard;

  const { id } = await params;
  const cadeiraId = parseId(id);
  if (cadeiraId === null) return badRequest('Invalid cadeira id');

  const cadeira = await db.orm.public.Cadeira.where({ id: cadeiraId }).first();
  if (!cadeira) return notFound('Cadeira not found');

  await db.orm.public.Cadeira.where({ id: cadeiraId }).delete();
  return json({ ok: true });
}
