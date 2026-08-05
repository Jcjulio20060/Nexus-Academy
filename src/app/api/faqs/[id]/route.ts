import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, requireAdmin, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireAdmin(user);
  if (guard) return guard;

  const { id } = await params;
  const faqId = parseId(id);
  if (faqId === null) return badRequest('Invalid faq id');

  const faq = await db.orm.public.FAQ.where({ id: faqId }).first();
  if (!faq) return notFound('FAQ not found');

  const body = await req.json();
  const { question, answer, category, isActive } = body as {
    question?: string;
    answer?: string;
    category?: string;
    isActive?: boolean;
  };

  const data: { question?: string; answer?: string; category?: string; isActive?: boolean } = {};

  if (question !== undefined) data.question = question;
  if (answer !== undefined) data.answer = answer;
  if (category !== undefined) data.category = category;
  if (isActive !== undefined) data.isActive = isActive;

  const updated = await db.orm.public.FAQ.where({ id: faqId }).update(data);
  return json({ faq: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireAdmin(user);
  if (guard) return guard;

  const { id } = await params;
  const faqId = parseId(id);
  if (faqId === null) return badRequest('Invalid faq id');

  const faq = await db.orm.public.FAQ.where({ id: faqId }).first();
  if (!faq) return notFound('FAQ not found');

  await db.orm.public.FAQ.where({ id: faqId }).delete();
  return json({ ok: true });
}
