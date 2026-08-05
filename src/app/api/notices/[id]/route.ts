import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, requireRole, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

type NoticeCategory = 'GENERAL' | 'ALERT' | 'MAINTENANCE' | 'REMINDER';
type NoticeAudience = 'ALL' | 'STUDENTS' | 'TEACHERS' | 'STAFF';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN', 'STAFF', 'TEACHER']);
  if (guard) return guard;

  const { id } = await params;
  const noticeId = parseId(id);
  if (noticeId === null) return badRequest('Invalid notice id');

  const notice = await db.orm.public.Notice.where({ id: noticeId }).first();
  if (!notice) return notFound('Notice not found');

  const body = await req.json();
  const { title, content, category, audience, isPinned, visible, expiresAt } = body as {
    title?: string;
    content?: string;
    category?: NoticeCategory;
    audience?: NoticeAudience;
    isPinned?: boolean;
    visible?: boolean;
    expiresAt?: string | null;
  };

  const data: {
    title?: string;
    content?: string;
    category?: NoticeCategory;
    audience?: NoticeAudience;
    isPinned?: boolean;
    visible?: boolean;
    expiresAt?: Date | null;
  } = {};

  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (category !== undefined) data.category = category;
  if (audience !== undefined) data.audience = audience;
  if (isPinned !== undefined) data.isPinned = isPinned;
  if (visible !== undefined) data.visible = visible;
  if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;

  const updated = await db.orm.public.Notice.where({ id: noticeId }).update(data);
  return json({ notice: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN']);
  if (guard) return guard;

  const { id } = await params;
  const noticeId = parseId(id);
  if (noticeId === null) return badRequest('Invalid notice id');

  const notice = await db.orm.public.Notice.where({ id: noticeId }).first();
  if (!notice) return notFound('Notice not found');

  await db.orm.public.Notice.where({ id: noticeId }).delete();
  return json({ ok: true });
}
