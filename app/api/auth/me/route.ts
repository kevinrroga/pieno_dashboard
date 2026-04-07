import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'fallback-secret');

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value;

  if (!token) {
    return NextResponse.json({ role: null }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // If role is present in token, use it
    if (payload.role === 'admin' || payload.role === 'viewer') {
      return NextResponse.json({ role: payload.role });
    }

    // Old token without role — infer from username
    if (payload.username === process.env.ADMIN_USERNAME) {
      return NextResponse.json({ role: 'admin' });
    }

    return NextResponse.json({ role: 'viewer' });
  } catch {
    return NextResponse.json({ role: null }, { status: 401 });
  }
}
