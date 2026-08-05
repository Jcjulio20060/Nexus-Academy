import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, conflict, notFound, requireRole, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const url = new URL(req.url);
  const cadeiraId = url.searchParams.get('cadeiraId');

  if (user.role === 'STUDENT') {
    const aluno = await db.orm.public.Aluno.where({ userId: user.id }).first();
    if (!aluno) return json({ matriculas: [] });
    const matriculas = await db.orm.public.Matricula.where({ alunoId: aluno.id }).all();
    return json({ matriculas });
  }

  const guard = requireRole(user, ['ADMIN', 'TEACHER']);
  if (guard) return guard;

  if (cadeiraId) {
    const parsed = Number(cadeiraId);
    if (Number.isNaN(parsed)) return badRequest('cadeiraId must be a number');
    const matriculas = await db.orm.public.Matricula.where({ cadeiraId: parsed }).all();
    return json({ matriculas });
  }

  const matriculas = await db.orm.public.Matricula.all();
  return json({ matriculas });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { alunoId, cadeiraId } = body as { alunoId?: number | string; cadeiraId?: number | string };

  if (!cadeiraId) return badRequest('cadeiraId is required');

  const cadeiraIdParsed = Number(cadeiraId);
  if (Number.isNaN(cadeiraIdParsed)) return badRequest('cadeiraId must be a number');

  const cadeira = await db.orm.public.Cadeira.where({ id: cadeiraIdParsed }).first();
  if (!cadeira) return notFound('Cadeira not found');

  let alunoIdParsed: number;
  if (alunoId !== undefined && alunoId !== null) {
    const guard = requireRole(user, ['ADMIN', 'TEACHER']);
    if (guard) return guard;
    alunoIdParsed = Number(alunoId);
    if (Number.isNaN(alunoIdParsed)) return badRequest('alunoId must be a number');
  } else {
    if (user.role !== 'STUDENT') return badRequest('alunoId is required for non-students');
    const aluno = await db.orm.public.Aluno.where({ userId: user.id }).first();
    if (!aluno) return badRequest('User is not an aluno');
    alunoIdParsed = aluno.id;
  }

  const existing = await db.orm.public.Matricula.where({
    alunoId: alunoIdParsed,
    cadeiraId: cadeiraIdParsed,
  }).first();
  if (existing) return conflict('Aluno is already enrolled in this cadeira');

  const matricula = await db.orm.public.Matricula.create({
    alunoId: alunoIdParsed,
    cadeiraId: cadeiraIdParsed,
    status: 'ENROLLED',
  });

  return json({ matricula }, 201);
}
