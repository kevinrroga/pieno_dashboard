import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await request.json();
  const { shift_date, start_time, end_time, notes } = body;

  const [existing] = await sql`
    SELECT id, start_time, end_time FROM shifts WHERE id = ${id}
  `;

  if (!existing) {
    return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
  }

  const newStart = start_time ?? existing.start_time;
  const newEnd   = end_time   ?? existing.end_time;

  if (newEnd <= newStart) {
    return NextResponse.json(
      { error: 'end_time must be after start_time' },
      { status: 400 }
    );
  }

  // Recalculate total_hours server-side whenever times change
  const [{ total_hours }] = await sql`
    SELECT EXTRACT(EPOCH FROM (${newEnd}::time - ${newStart}::time)) / 3600 AS total_hours
  `;

  const [shift] = await sql`
    UPDATE shifts
    SET shift_date  = COALESCE(${shift_date ?? null}, shift_date),
        start_time  = ${newStart},
        end_time    = ${newEnd},
        total_hours = ${total_hours},
        notes       = COALESCE(${notes ?? null}, notes)
    WHERE id = ${id}
    RETURNING id, employee_id, shift_date, start_time, end_time, total_hours, status, notes
  `;

  return NextResponse.json(shift);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  const [shift] = await sql`
    UPDATE shifts
    SET status = 'cancelled'
    WHERE id = ${id}
    RETURNING id, status
  `;

  if (!shift) {
    return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
  }

  return NextResponse.json(shift);
}
