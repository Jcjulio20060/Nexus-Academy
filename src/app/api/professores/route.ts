import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, requireAdmin } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET() {
  const professores = await db.orm.public.Professor.all();

  const publicList = await Promise.all(
    professores.map(async (professor) => {
      const user = await db.orm.public.User.where({ id: professor.userId }).first();
      return {
        id: professor.id,
        userId: professor.userId,
        name: user?.name ?? null,
        department: professor.department,
        bio: professor.bio,
        active: professor.active,
      };
    })
  );

  return json({ professores: publicList });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  const guard = requireAdmin(user);
  if (guard) return guard;

  const body = await req.json();
  const { userId, employeeNumber, department, bio, active } = body as {
    userId?: number | string;
    employeeNumber?: string;
    department?: string;
    bio?: string;
    active?: boolean;
  };

  if (!userId || !employeeNumber || !department) {
    return badRequest('userId, employeeNumber and department are required');
  }

  const userIdParsed = Number(userId);
  if (Number.isNaN(userIdParsed)) return badRequest('userId must be a number');

  const targetUser = await db.orm.public.User.where({ id: userIdParsed }).first();
  if (!targetUser) return notFound('User not found');

  const existing = await db.orm.public.Professor.where({ userId: userIdParsed }).first();
  if (existing) return badRequest('User already has a professor profile');

  const professor = await db.orm.public.Professor.create({
    userId: userIdParsed,
    employeeNumber,
    department,
    bio,
    active: active ?? true,
  });

  return json({ professor }, 201);
}
