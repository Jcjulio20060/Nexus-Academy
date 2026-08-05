import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { db } from '@/prisma/db';

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message = 'Bad Request') {
  return json({ error: message }, 400);
}

export function unauthorized(message = 'Unauthorized') {
  return json({ error: message }, 401);
}

export function forbidden(message = 'Forbidden') {
  return json({ error: message }, 403);
}

export function conflict(message = 'Conflict') {
  return json({ error: message }, 409);
}

export function notFound(message = 'Not Found') {
  return json({ error: message }, 404);
}

export async function getCurrentUser(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;

  const token = authorization.slice(7).trim();
  if (!token) return null;

  let payload: Record<string, unknown>;
  try {
    payload = verifyToken(token);
  } catch {
    return null;
  }

  const userId = typeof payload.userId === 'number' ? payload.userId : Number(payload.userId);
  if (!Number.isFinite(userId)) return null;

  return await db.orm.public.User.where({ id: Number(userId) }).first();
}

export function requireAuth(user: Awaited<ReturnType<typeof getCurrentUser>>) {
  if (!user) return unauthorized();
  return null;
}

export function requireAdmin(user: Awaited<ReturnType<typeof getCurrentUser>>) {
  if (!user) return unauthorized();
  if (user.role !== 'ADMIN') return forbidden('Admin privileges required');
  return null;
}

export async function parseJsonRequest(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    throw new Error('Invalid JSON body');
  }
}
