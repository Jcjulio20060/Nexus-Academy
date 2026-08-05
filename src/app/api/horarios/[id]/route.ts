import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, requireRole, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['TEACHER', 'ADMIN']);
  if (guard) return guard;

  const { id } = await params;
  const horarioId = parseId(id);
  if (horarioId === null) return badRequest('Invalid horario id');

  const horario = await db.orm.public.Horario.where({ id: horarioId }).first();
  if (!horario) return notFound('Horario not found');

  const body = await req.json();
  const { cadeiraId, professorId, day, startTime, endTime, location } = body as {
    cadeiraId?: number | string;
    professorId?: number | string | null;
    day?: Weekday;
    startTime?: string;
    endTime?: string;
    location?: string;
  };

  const data: {
    cadeiraId?: number;
    professorId?: number | null;
    day?: Weekday;
    startTime?: string;
    endTime?: string;
    location?: string;
  } = {};

  if (cadeiraId !== undefined) {
    const parsed = Number(cadeiraId);
    if (Number.isNaN(parsed)) return badRequest('cadeiraId must be a number');
    data.cadeiraId = parsed;
  }

  if (professorId !== undefined && professorId !== null) {
    const parsed = Number(professorId);
    if (Number.isNaN(parsed)) return badRequest('professorId must be a number');
    data.professorId = parsed;
  } else if (professorId === null) {
    data.professorId = null;
  }

  if (day !== undefined) data.day = day;
  if (startTime !== undefined) data.startTime = startTime;
  if (endTime !== undefined) data.endTime = endTime;
  if (location !== undefined) data.location = location;

  const updated = await db.orm.public.Horario.where({ id: horarioId }).update(data);
  return json({ horario: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN']);
  if (guard) return guard;

  const { id } = await params;
  const horarioId = parseId(id);
  if (horarioId === null) return badRequest('Invalid horario id');

  const horario = await db.orm.public.Horario.where({ id: horarioId }).first();
  if (!horario) return notFound('Horario not found');

  await db.orm.public.Horario.where({ id: horarioId }).delete();
  return json({ ok: true });
}
