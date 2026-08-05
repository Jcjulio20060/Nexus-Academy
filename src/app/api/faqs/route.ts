import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, requireAdmin } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET() {
  const faqs = await db.orm.public.FAQ.where({ isActive: true }).all();
  return json({ faqs });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  const guard = requireAdmin(user);
  if (guard) return guard;

  const body = await req.json();
  const { question, answer, category } = body as { question?: string; answer?: string; category?: string };
  if (!question || !answer) return badRequest('Question and answer are required');

  const faq = await db.orm.public.FAQ.create({ question, answer, category, isActive: true });
  return json({ faq }, 201);
}
