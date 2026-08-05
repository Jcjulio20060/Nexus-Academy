import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, forbidden, notFound, unauthorized, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

async function getTicketOrDeny(userId: number, userRole: string, ticketId: number) {
  const ticket = await db.orm.public.Ticket.where({ id: ticketId }).first();
  if (!ticket) return { ticket: null, error: notFound('Ticket not found') };
  const staffRoles = ['ADMIN', 'STAFF', 'TEACHER'];
  const involved = ticket.requesterId === userId || ticket.assignedToId === userId;
  if (!involved && !staffRoles.includes(userRole)) return { ticket: null, error: forbidden() };
  return { ticket, error: null };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const ticketId = parseId(id);
  if (ticketId === null) return badRequest('Invalid ticket id');

  const { error } = await getTicketOrDeny(user.id, user.role, ticketId);
  if (error) return error;

  const messages = await db.orm.public.TicketMessage.where({ ticketId }).orderBy((m) => m.createdAt.asc()).all();
  return json({ messages });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const ticketId = parseId(id);
  if (ticketId === null) return badRequest('Invalid ticket id');

  const { error } = await getTicketOrDeny(user.id, user.role, ticketId);
  if (error) return error;

  const body = await req.json();
  const { body: messageBody, internal } = body as { body?: string; internal?: boolean };

  if (!messageBody || !messageBody.trim()) return badRequest('body is required');

  const message = await db.orm.public.TicketMessage.create({
    ticketId,
    senderId: user.id,
    body: messageBody,
    internal: internal ?? false,
  });

  return json({ message }, 201);
}
