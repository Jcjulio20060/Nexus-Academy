import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, requireRole } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const professorId = url.searchParams.get('professorId');
  const cadeiraId = url.searchParams.get('cadeiraId');

  const filters: { professorId?: number; cadeiraId?: number } = {};

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

  const horarios = Object.keys(filters).length
    ? await db.orm.public.Horario.where(filters).all()
    : await db.orm.public.Horario.all();

  return json({ horarios });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['TEACHER', 'ADMIN']);
  if (guard) return guard;

  const body = await req.json();
  const { cadeiraId, professorId, day, startTime, endTime, location } = body as {
    cadeiraId?: number | string;
    professorId?: number | string;
    day?:
      | 'MONDAY'
      | 'TUESDAY'
      | 'WEDNESDAY'
      | 'THURSDAY'
      | 'FRIDAY'
      | 'SATURDAY'
      | 'SUNDAY';
    startTime?: string;
    endTime?: string;
    location?: string;
  };

  if (!cadeiraId || !day || !startTime || !endTime) {
    return badRequest('cadeiraId, day, startTime, and endTime are required');
  }

  const cadeiraIdParsed = Number(cadeiraId);
  if (Number.isNaN(cadeiraIdParsed)) return badRequest('cadeiraId must be a number');

  const professorIdParsed =
    professorId !== undefined && professorId !== null
      ? Number(professorId)
      : undefined;
  if (professorId !== undefined && professorId !== null && Number.isNaN(professorIdParsed)) {
    return badRequest('professorId must be a number');
  }

  const horario = await db.orm.public.Horario.create({
    cadeiraId: cadeiraIdParsed,
    professorId: professorIdParsed,
    day,
    startTime,
    endTime,
    location,
  });

  return json({ horario }, 201);
}
