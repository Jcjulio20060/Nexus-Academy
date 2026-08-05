import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const aluno = await db.orm.public.Aluno.where({ userId: user.id }).first();
  const professor = await db.orm.public.Professor.where({ userId: user.id }).first();

  return json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      phone: user.phone,
    },
    aluno,
    professor,
  });
}
