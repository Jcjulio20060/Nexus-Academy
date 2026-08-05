import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, unauthorized, requireRole, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

type EnrollmentStatus = 'ENROLLED' | 'WAITLISTED' | 'DROPPED' | 'COMPLETED';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN', 'TEACHER']);
  if (guard) return guard;
  if (!user) return unauthorized();

  const { id } = await params;
  const matriculaId = parseId(id);
  if (matriculaId === null) return badRequest('Invalid matricula id');

  const matricula = await db.orm.public.Matricula.where({ id: matriculaId }).first();
  if (!matricula) return notFound('Matricula not found');

  const body = await req.json();
  const { status, grade } = body as { status?: string; grade?: number | string | null };

  const data: { status?: EnrollmentStatus; grade?: number | null } = {};

  if (status !== undefined) {
    if (!['ENROLLED', 'WAITLISTED', 'DROPPED', 'COMPLETED'].includes(status)) {
      return badRequest('Invalid status');
    }
    data.status = status as EnrollmentStatus;
  }

  if (grade !== undefined && grade !== null) {
    const parsed = Number(grade);
    if (Number.isNaN(parsed)) return badRequest('grade must be a number');
    data.grade = parsed;
  } else if (grade === null) {
    data.grade = null;
  }

  const updated = await db.orm.public.Matricula.where({ id: matriculaId }).update(data);
  return json({ matricula: updated });
}
