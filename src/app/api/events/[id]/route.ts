import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, notFound, requireRole, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

type ImportantDateCategory = 'EXAM' | 'PROJECT' | 'ACTIVITY' | 'DEADLINE' | 'EVENT' | 'OTHER';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN', 'STAFF', 'TEACHER']);
  if (guard) return guard;

  const { id } = await params;
  const eventId = parseId(id);
  if (eventId === null) return badRequest('Invalid event id');

  const event = await db.orm.public.ImportantDate.where({ id: eventId }).first();
  if (!event) return notFound('Event not found');

  const body = await req.json();
  const { title, description, date, endDate, category, allDay, location, relatedCadeiraId, visible } =
    body as {
      title?: string;
      description?: string;
      date?: string;
      endDate?: string | null;
      category?: ImportantDateCategory;
      allDay?: boolean;
      location?: string;
      relatedCadeiraId?: number | string | null;
      visible?: boolean;
    };

  const data: {
    title?: string;
    description?: string;
    date?: Date;
    endDate?: Date | null;
    category?: ImportantDateCategory;
    allDay?: boolean;
    location?: string;
    relatedCadeiraId?: number | null;
    visible?: boolean;
  } = {};

  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (date !== undefined) data.date = new Date(date);
  if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
  if (category !== undefined) data.category = category;
  if (allDay !== undefined) data.allDay = allDay;
  if (location !== undefined) data.location = location;
  if (relatedCadeiraId !== undefined && relatedCadeiraId !== null) {
    const parsed = Number(relatedCadeiraId);
    if (Number.isNaN(parsed)) return badRequest('relatedCadeiraId must be a number');
    data.relatedCadeiraId = parsed;
  } else if (relatedCadeiraId === null) {
    data.relatedCadeiraId = null;
  }
  if (visible !== undefined) data.visible = visible;

  const updated = await db.orm.public.ImportantDate.where({ id: eventId }).update(data);
  return json({ event: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN', 'STAFF']);
  if (guard) return guard;

  const { id } = await params;
  const eventId = parseId(id);
  if (eventId === null) return badRequest('Invalid event id');

  const event = await db.orm.public.ImportantDate.where({ id: eventId }).first();
  if (!event) return notFound('Event not found');

  await db.orm.public.ImportantDate.where({ id: eventId }).delete();
  return json({ ok: true });
}
