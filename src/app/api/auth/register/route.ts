import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, conflict } from '@/lib/server';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, username, name, role } = body as {
    email?: string;
    password?: string;
    username?: string;
    name?: string;
    role?: string;
  };

  if (!email || !password) return badRequest('Email and password are required');

  const existing = await db.orm.public.User.where({ email }).first();
  if (existing) return conflict('Email is already registered');

  const passwordHash = await hashPassword(password);
  const user = await db.orm.public.User.create({
    email,
    username,
    passwordHash,
    name,
    role: role && ['STUDENT', 'TEACHER', 'ADMIN', 'STAFF'].includes(role) ? (role as any) : 'STUDENT',
  });

  return json({ user: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role } }, 201);
}
