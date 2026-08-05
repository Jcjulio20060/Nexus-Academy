import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const aluno = await db.orm.public.Aluno.where({ userId: user.id }).first();
  if (!aluno) return json({ absences: [] });

  const absences = await db.orm.public.AbsenceJustification.where({ alunoId: aluno.id }).all();
  return json({ absences });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const aluno = await db.orm.public.Aluno.where({ userId: user.id }).first();
  if (!aluno) return badRequest('User is not an aluno');

  const body = await req.json();
  const { startDate, endDate, reason, proofUrl } = body as {
    startDate?: string;
    endDate?: string;
    reason?: string;
    proofUrl?: string;
  };

  if (!startDate || !endDate || !reason) return badRequest('startDate, endDate and reason are required');

  const absence = await db.orm.public.AbsenceJustification.create({
    alunoId: aluno.id,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    reason,
    proofUrl,
    status: 'PENDING',
  });

  return json({ absence }, 201);
}
