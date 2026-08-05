import { NextRequest } from 'next/server';
import { db } from '@/prisma/db';
import { json, badRequest, forbidden, notFound, unauthorized, parseId } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const arquivoId = parseId(id);
  if (arquivoId === null) return badRequest('Invalid arquivo id');

  const arquivo = await db.orm.public.Arquivo.where({ id: arquivoId }).first();
  if (!arquivo) return notFound('Arquivo not found');

  const isOwner = arquivo.uploadedById === user.id;
  const isAdmin = user.role === 'ADMIN';
  if (!isOwner && !isAdmin) return forbidden();

  await db.orm.public.Arquivo.where({ id: arquivoId }).delete();
  return json({ ok: true });
}
