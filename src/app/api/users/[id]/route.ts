import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, unauthorized, requireAdmin, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'STAFF';
const ROLES: readonly UserRole[] = ['STUDENT', 'TEACHER', 'ADMIN', 'STAFF'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireAdmin(user);
  if (guard) return guard;
  if (!user) return unauthorized();

  const { id } = await params;
  const userId = parseId(id);
  if (userId === null) return badRequest('Invalid user id');

  const target = await db.orm.public.User.where({ id: userId }).first();
  if (!target) return notFound('User not found');

  const body = await req.json();
  const { role, name, phone, username } = body as {
    role?: string;
    name?: string;
    phone?: string;
    username?: string;
  };

  const data: { role?: UserRole; name?: string; phone?: string; username?: string } = {};

  if (role !== undefined) {
    if (!ROLES.includes(role as UserRole)) return badRequest('Invalid role');
    data.role = role as UserRole;
  }

  if (name !== undefined) data.name = name;
  if (phone !== undefined) data.phone = phone;
  if (username !== undefined) data.username = username;

  const updated = await db.orm.public.User.where({ id: userId }).update(data);
  if (!updated) return notFound('User not found');

  return json({
    user: { id: updated.id, email: updated.email, username: updated.username, name: updated.name, role: updated.role, phone: updated.phone },
  });
}
