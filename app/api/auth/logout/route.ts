import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  // In production, reject requests not coming from our own domain
  if (appUrl && origin !== appUrl) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
  return response;
}
