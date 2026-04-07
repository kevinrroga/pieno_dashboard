import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'fallback-secret');

export async function POST(request: Request) {
  const { username, password } = await request.json();

  let role: 'admin' | 'viewer' | null = null;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    role = 'admin';
  } else if (username === process.env.VIEWER_USERNAME && password === process.env.VIEWER_PASSWORD) {
    role = 'viewer';
  }

  if (!role) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await new SignJWT({ username, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  return response;
}
