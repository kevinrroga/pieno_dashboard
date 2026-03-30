import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const week = searchParams.get('week');        // ISO date of any day in the week
  const employeeId = searchParams.get('employee_id');
  const status = searchParams.get('status');    // 'scheduled' | 'cancelled'

  // Build query dynamically based on filters
  // Using week param: return Mon–Sun of that week
  if (week) {
    const shifts = await sql`
      SELECT s.id, s.employee_id, e.name AS employee_name, e.role,
             s.shift_date, s.start_time, s.end_time, s.total_hours,
             s.status, s.notes
      FROM shifts s
      JOIN employees e ON e.id = s.employee_id
      WHERE s.shift_date >= date_trunc('week', ${week}::date)
        AND s.shift_date <  date_trunc('week', ${week}::date) + interval '7 days'
        AND (${employeeId}::int IS NULL OR s.employee_id = ${employeeId}::int)
        AND (${status} IS NULL OR s.status = ${status}::shift_status)
      ORDER BY s.shift_date ASC, s.start_time ASC
    `;
    return NextResponse.json(shifts);
  }

  const shifts = await sql`
    SELECT s.id, s.employee_id, e.name AS employee_name, e.role,
           s.shift_date, s.start_time, s.end_time, s.total_hours,
           s.status, s.notes
    FROM shifts s
    JOIN employees e ON e.id = s.employee_id
    WHERE (${employeeId}::int IS NULL OR s.employee_id = ${employeeId}::int)
      AND (${status} IS NULL OR s.status = ${status}::shift_status)
    ORDER BY s.shift_date DESC, s.start_time ASC
    LIMIT 100
  `;
  return NextResponse.json(shifts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { employee_id, shift_date, start_time, end_time, notes } = body;

  if (!employee_id || !shift_date || !start_time || !end_time) {
    return NextResponse.json(
      { error: 'employee_id, shift_date, start_time, and end_time are required' },
      { status: 400 }
    );
  }

  if (end_time <= start_time) {
    return NextResponse.json(
      { error: 'end_time must be after start_time' },
      { status: 400 }
    );
  }

  // Calculate total_hours server-side
  const [{ total_hours }] = await sql`
    SELECT EXTRACT(EPOCH FROM (${end_time}::time - ${start_time}::time)) / 3600 AS total_hours
  `;

  const [shift] = await sql`
    INSERT INTO shifts (employee_id, shift_date, start_time, end_time, total_hours, notes)
    VALUES (${employee_id}, ${shift_date}, ${start_time}, ${end_time}, ${total_hours}, ${notes ?? null})
    RETURNING id, employee_id, shift_date, start_time, end_time, total_hours, status, notes
  `;

  return NextResponse.json(shift, { status: 201 });
}
