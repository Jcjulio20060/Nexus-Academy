import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/prisma/db';
import { badRequest, conflict } from '@/lib/server';
import { hashPassword } from '@/lib/auth';
import { signToken } from '@/lib/jwt';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, username, name } = body as {
    email?: string;
    password?: string;
    username?: string;
    name?: string;
  };

  if (!email || !password) return badRequest('Email and password are required');
  if (!EMAIL_REGEX.test(email)) return badRequest('Invalid email address');
  if (password.length < 8) return badRequest('Password must be at least 8 characters');

  const existing = await db.orm.public.User.where({ email }).first();
  if (existing) return conflict('Email is already registered');

  const passwordHash = await hashPassword(password);
  const user = await db.orm.public.User.create({
    email,
    username,
    passwordHash,
    name,
    role: 'STUDENT',
  });

  const token = signToken({ userId: user.id, role: user.role, email: user.email });

  const res = NextResponse.json(
    { user: { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role } },
    { status: 201 }
  );

  res.cookies.set('nexus_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
