import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, requireAdmin } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  const guard = requireAdmin(user);
  if (guard) return guard;

  const users = await db.orm.public.User.orderBy((u) => u.createdAt.asc()).all();

  return json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      name: u.name,
      role: u.role,
      phone: u.phone,
      createdAt: u.createdAt,
    })),
  });
}
