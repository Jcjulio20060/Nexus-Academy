import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

type AbsenceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  const staffRoles = ['ADMIN', 'TEACHER', 'STAFF'];
  if (staffRoles.includes(user.role)) {
    const absences = status
      ? await db.orm.public.AbsenceJustification.where({ status: status as AbsenceStatus }).orderBy((a) => a.submittedAt.desc()).all()
      : await db.orm.public.AbsenceJustification.orderBy((a) => a.submittedAt.desc()).all();
    return json({ absences });
  }

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
  const { startDate, endDate, reason, proofUrl, cadeiraId } = body as {
    startDate?: string;
    endDate?: string;
    reason?: string;
    proofUrl?: string;
    cadeiraId?: number | string;
  };

  if (!startDate || !endDate || !reason) return badRequest('startDate, endDate and reason are required');

  const cadeiraIdParsed =
    cadeiraId !== undefined && cadeiraId !== null ? Number(cadeiraId) : undefined;
  if (cadeiraId !== undefined && cadeiraId !== null && Number.isNaN(cadeiraIdParsed)) {
    return badRequest('cadeiraId must be a number');
  }

  const absence = await db.orm.public.AbsenceJustification.create({
    alunoId: aluno.id,
    cadeiraId: cadeiraIdParsed,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    reason,
    proofUrl,
    status: 'PENDING',
  });

  return json({ absence }, 201);
}
