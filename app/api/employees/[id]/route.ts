import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  const [employee] = await sql`
    SELECT id, name, role, hourly_rate, created_at
    FROM employees
    WHERE id = ${id}
  `;

  if (!employee) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  const shifts = await sql`
    SELECT id, shift_date, start_time, end_time, total_hours, status, notes
    FROM shifts
    WHERE employee_id = ${id}
    ORDER BY shift_date DESC, start_time DESC
  `;

  return NextResponse.json({ ...employee, shifts });
}
