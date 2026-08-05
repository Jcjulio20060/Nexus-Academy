import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET() {
  const notices = await db.orm.public.Notice.where({ visible: true }).orderBy((notice) => notice.publishedAt.desc()).all();
  return json({ notices });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  type NoticeCategory = 'GENERAL' | 'ALERT' | 'MAINTENANCE' | 'REMINDER';
  type NoticeAudience = 'ALL' | 'STUDENTS' | 'TEACHERS' | 'STAFF';

  const { title, content, category, audience, isPinned, expiresAt, visible } = body as {
    title?: string;
    content?: string;
    category?: NoticeCategory;
    audience?: NoticeAudience;
    isPinned?: boolean;
    expiresAt?: string;
    visible?: boolean;
  };

  if (!title || !content) return badRequest('title and content are required');

  const notice = await db.orm.public.Notice.create({
    title,
    content,
    category: category ?? 'GENERAL',
    audience: audience ?? 'ALL',
    isPinned: isPinned ?? false,
    visible: visible ?? true,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    createdById: user.id,
  });

  return json({ notice }, 201);
}
