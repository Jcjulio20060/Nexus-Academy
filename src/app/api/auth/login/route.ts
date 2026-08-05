import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/prisma/db';
import { badRequest, unauthorized } from '@/lib/server';
import { verifyPassword } from '@/lib/auth';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body as { email?: string; password?: string };
  if (!email || !password) return badRequest('Email and password are required');

  const user = await db.orm.public.User.where({ email }).first();
  if (!user?.passwordHash) return unauthorized('Invalid credentials');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return unauthorized('Invalid credentials');

  const token = signToken({ userId: user.id, role: user.role, email: user.email });

  const res = NextResponse.json({
    token,
    user: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role },
  });

  res.cookies.set('nexus_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
