import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, requireRole } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN', 'TEACHER']);
  if (guard) return guard;

  const alunos = await db.orm.public.Aluno.all();
  return json({ alunos });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN']);
  if (guard) return guard;

  const body = await req.json();
  const { userId, registrationNumber, course, year, active } = body as {
    userId?: number | string;
    registrationNumber?: string;
    course?: string;
    year?: number | string;
    active?: boolean;
  };

  if (!userId || !registrationNumber || !course || year === undefined || year === null) {
    return badRequest('userId, registrationNumber, course and year are required');
  }

  const userIdParsed = Number(userId);
  if (Number.isNaN(userIdParsed)) return badRequest('userId must be a number');

  const yearParsed = Number(year);
  if (Number.isNaN(yearParsed)) return badRequest('year must be a number');

  const targetUser = await db.orm.public.User.where({ id: userIdParsed }).first();
  if (!targetUser) return notFound('User not found');

  const existing = await db.orm.public.Aluno.where({ userId: userIdParsed }).first();
  if (existing) return badRequest('User already has an aluno profile');

  const aluno = await db.orm.public.Aluno.create({
    userId: userIdParsed,
    registrationNumber,
    course,
    year: yearParsed,
    active: active ?? true,
  });

  return json({ aluno }, 201);
}
