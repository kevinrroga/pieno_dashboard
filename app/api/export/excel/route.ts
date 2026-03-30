import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import * as XLSX from 'xlsx';

// GET /api/export/excel?week=YYYY-MM-DD
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
      e.name        AS "Employee",
      e.role        AS "Role",
      s.shift_date  AS "Date",
      s.start_time  AS "Start",
      s.end_time    AS "End",
      s.total_hours AS "Hours",
      ROUND((s.total_hours * e.hourly_rate)::numeric, 2) AS "Salary (€)",
      s.notes       AS "Notes"
    FROM shifts s
    JOIN employees e ON e.id = s.employee_id
    WHERE s.shift_date >= date_trunc('week', ${week}::date)
      AND s.shift_date <  date_trunc('week', ${week}::date) + interval '7 days'
      AND s.status = 'scheduled'
    ORDER BY s.shift_date ASC, e.name ASC
  `;

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(shifts);
  XLSX.utils.book_append_sheet(wb, ws, 'Schedule');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="schedule-${week}.xlsx"`,
    },
  });
}
