import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/schedule?week=YYYY-MM-DD
// Returns scheduled (non-cancelled) shifts for the Mon–Sun week containing `week`
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const week = searchParams.get('week');

  if (!week) {
    return NextResponse.json(
      { error: 'week query param is required (YYYY-MM-DD)' },
      { status: 400 }
    );
  }

  const shifts = await sql`
    SELECT
      s.id,
      s.shift_date,
      s.start_time,
      s.end_time,
      s.total_hours,
      s.status,
      s.notes,
      e.id   AS employee_id,
      e.name AS employee_name,
      e.role
    FROM shifts s
    JOIN employees e ON e.id = s.employee_id
    WHERE s.shift_date >= date_trunc('week', ${week}::date)
      AND s.shift_date <  date_trunc('week', ${week}::date) + interval '7 days'
      AND s.status = 'scheduled'
    ORDER BY s.shift_date ASC, s.start_time ASC
  `;

  // Group by date for easy frontend rendering
  const byDate: Record<string, typeof shifts> = {};
  for (const shift of shifts) {
    const key = String(shift.shift_date).slice(0, 10);
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(shift);
  }

  return NextResponse.json({
    week_start: null, // filled by query
    shifts,
    by_date: byDate,
  });
}
