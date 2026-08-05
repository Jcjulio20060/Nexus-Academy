import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, forbidden, notFound, unauthorized, requireRole, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

type TicketStatus = 'OPEN' | 'PENDING' | 'RESOLVED' | 'CLOSED';
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const ticketId = parseId(id);
  if (ticketId === null) return badRequest('Invalid ticket id');

  const ticket = await db.orm.public.Ticket.where({ id: ticketId }).first();
  if (!ticket) return notFound('Ticket not found');

  const staffRoles = ['ADMIN', 'STAFF', 'TEACHER'];
  const involved = ticket.requesterId === user.id || ticket.assignedToId === user.id;
  if (!involved && !staffRoles.includes(user.role)) return forbidden();

  const requester = await db.orm.public.User.where({ id: ticket.requesterId }).first();
  const assigned = ticket.assignedToId
    ? await db.orm.public.User.where({ id: ticket.assignedToId }).first()
    : null;

  return json({
    ticket: {
      ...ticket,
      requesterName: requester?.name ?? requester?.username ?? null,
      assignedName: assigned?.name ?? assigned?.username ?? null,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  const guard = requireRole(user, ['ADMIN', 'STAFF']);
  if (guard) return guard;
  if (!user) return unauthorized();

  const { id } = await params;
  const ticketId = parseId(id);
  if (ticketId === null) return badRequest('Invalid ticket id');

  const ticket = await db.orm.public.Ticket.where({ id: ticketId }).first();
  if (!ticket) return notFound('Ticket not found');

  const body = await req.json();
  const { status, priority, assignedToId } = body as {
    status?: string;
    priority?: string;
    assignedToId?: number | string;
  };

  const data: { status?: TicketStatus; priority?: TicketPriority; assignedToId?: number | null } = {};

  if (status !== undefined) {
    if (!['OPEN', 'PENDING', 'RESOLVED', 'CLOSED'].includes(status)) return badRequest('Invalid status');
    data.status = status as TicketStatus;
  }

  if (priority !== undefined) {
    if (!['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(priority)) return badRequest('Invalid priority');
    data.priority = priority as TicketPriority;
  }

  if (assignedToId !== undefined && assignedToId !== null) {
    const parsed = Number(assignedToId);
    if (Number.isNaN(parsed)) return badRequest('assignedToId must be a number');
    const assignee = await db.orm.public.User.where({ id: parsed }).first();
    if (!assignee) return notFound('Assignee user not found');
    data.assignedToId = parsed;
  } else if (assignedToId === null) {
    data.assignedToId = null;
  }

  const updated = await db.orm.public.Ticket.where({ id: ticketId }).update(data);
  return json({ ticket: updated });
}
