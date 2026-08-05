import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('nexus_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}

export async function POST() {
  return GET();
}
