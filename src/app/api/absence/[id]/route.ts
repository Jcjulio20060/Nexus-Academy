import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, unauthorized, requireRole, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

type AbsenceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN', 'TEACHER', 'STAFF']);
  if (guard) return guard;
  if (!user) return unauthorized();

  const { id } = await params;
  const absenceId = parseId(id);
  if (absenceId === null) return badRequest('Invalid absence id');

  const absence = await db.orm.public.AbsenceJustification.where({ id: absenceId }).first();
  if (!absence) return notFound('Absence not found');

  const body = await req.json();
  const { status, response } = body as { status?: string; response?: string };

  const data: { status?: AbsenceStatus; response?: string; reviewedById?: number; reviewedAt?: Date } = {};

  if (status !== undefined) {
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) return badRequest('Invalid status');
    data.status = status as AbsenceStatus;
    data.reviewedById = user.id;
    data.reviewedAt = new Date();
  }

  if (response !== undefined) data.response = response;

  const updated = await db.orm.public.AbsenceJustification.where({ id: absenceId }).update(data);
  return json({ absence: updated });
}
