import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const semester = url.searchParams.get('semester');
  const teacherId = url.searchParams.get('teacherId');

  const filters: Record<string, unknown> = {};

  if (semester) {
    const parsed = Number(semester);
    if (Number.isNaN(parsed)) return badRequest('semester must be a number');
    filters.semester = parsed;
  }

  if (teacherId) {
    const parsed = Number(teacherId);
    if (Number.isNaN(parsed)) return badRequest('teacherId must be a number');
    filters.teacherId = parsed;
  }

  const cadeiras = Object.keys(filters).length
    ? await db.orm.public.Cadeira.where(filters).all()
    : await db.orm.public.Cadeira.all();

  return json({ cadeiras });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  const { code, title, description, credits, semester, teacherId } = body as {
    code?: string;
    title?: string;
    description?: string;
    credits?: number | string;
    semester?: number | string;
    teacherId?: number | string;
  };

  if (!code || !title) return badRequest('code and title are required');

  const creditsParsed = credits !== undefined && credits !== null ? Number(credits) : undefined;
  if (credits !== undefined && credits !== null && Number.isNaN(creditsParsed)) {
    return badRequest('credits must be a number');
  }

  const semesterParsed = semester !== undefined && semester !== null ? Number(semester) : undefined;
  if (semester !== undefined && semester !== null && Number.isNaN(semesterParsed)) {
    return badRequest('semester must be a number');
  }

  const teacherIdParsed = teacherId !== undefined && teacherId !== null ? Number(teacherId) : undefined;
  if (teacherId !== undefined && teacherId !== null && Number.isNaN(teacherIdParsed)) {
    return badRequest('teacherId must be a number');
  }

  const cadeira = await db.orm.public.Cadeira.create({
    code,
    title,
    description,
    credits: creditsParsed,
    semester: semesterParsed,
    teacherId: teacherIdParsed,
  });

  return json({ cadeira }, 201);
}
