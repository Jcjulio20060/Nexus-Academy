import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function GET() {
  const events = await db.orm.public.ImportantDate.where({ visible: true }).orderBy((event) => event.date.asc()).all();
  return json({ events });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  type ImportantDateCategory = 'EXAM' | 'PROJECT' | 'ACTIVITY' | 'DEADLINE' | 'EVENT' | 'OTHER';

  const { title, date, endDate, category, allDay, location, relatedCadeiraId, visible } = body as {
    title?: string;
    date?: string;
    endDate?: string;
    category?: ImportantDateCategory;
    allDay?: boolean;
    location?: string;
    relatedCadeiraId?: number;
    visible?: boolean;
  };

  if (!title || !date) return badRequest('title and date are required');

  const event = await db.orm.public.ImportantDate.create({
    title,
    description: body.description,
    category: category ?? 'OTHER',
    date: new Date(date),
    endDate: endDate ? new Date(endDate) : undefined,
    allDay: allDay ?? true,
    location,
    relatedCadeiraId,
    createdById: user.id,
    visible: visible ?? true,
  });

  return json({ event }, 201);
}
