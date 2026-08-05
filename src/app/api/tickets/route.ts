import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';
import { or } from '@prisma/orm-postgres/orm-client';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const tickets = await db.orm.public.Ticket.where((ticket) =>
    or(ticket.requesterId.eq(user.id), ticket.assignedToId.eq(user.id))
  ).all();
  return json({ tickets });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const body = await req.json();
  type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

  const { subject, description, assignedToId, priority } = body as {
    subject?: string;
    description?: string;
    assignedToId?: number;
    priority?: TicketPriority;
  };

  if (!subject) return badRequest('subject is required');

  const ticket = await db.orm.public.Ticket.create({
    subject,
    description,
    requesterId: user.id,
    assignedToId,
    priority: priority ?? 'MEDIUM',
    status: 'OPEN',
  });

  return json({ ticket }, 201);
}
