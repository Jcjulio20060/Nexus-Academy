import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { json, badRequest, unauthorized } from '@/lib/server';
import { getCurrentUser } from '@/lib/server';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return unauthorized();

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return badRequest('file is required');

  const blob = await put(file.name, file, { access: 'public', addRandomSuffix: true });

  return json(
    { url: blob.url, pathname: blob.pathname, contentType: blob.contentType },
    201
  );
}
