import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  const employees = await sql`
    SELECT id, name, role, hourly_rate, created_at
    FROM employees
    ORDER BY name ASC
  `;
  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, role, hourly_rate } = body;

  if (!name || !role || !hourly_rate) {
    return NextResponse.json(
      { error: 'name, role, and hourly_rate are required' },
      { status: 400 }
    );
  }

  if (role !== 'cook' && role !== 'waiter') {
    return NextResponse.json(
      { error: 'role must be cook or waiter' },
      { status: 400 }
    );
  }

  if (Number(hourly_rate) <= 0) {
    return NextResponse.json(
      { error: 'hourly_rate must be positive' },
      { status: 400 }
    );
  }

  const [employee] = await sql`
    INSERT INTO employees (name, role, hourly_rate)
    VALUES (${name}, ${role}, ${hourly_rate})
    RETURNING id, name, role, hourly_rate, created_at
  `;

  return NextResponse.json(employee, { status: 201 });
}
