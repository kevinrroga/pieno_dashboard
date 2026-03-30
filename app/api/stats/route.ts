import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET /api/stats?week=YYYY-MM-DD
// Returns per-employee hours and salary for the week (cancelled shifts excluded)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const week = searchParams.get('week');

  if (!week) {
    return NextResponse.json(
      { error: 'week query param is required (YYYY-MM-DD)' },
      { status: 400 }
    );
  }

  const rows = await sql`
    SELECT
      e.id,
      e.name,
      e.role,
      e.hourly_rate,
      COALESCE(SUM(s.total_hours), 0)                          AS total_hours,
      COALESCE(SUM(s.total_hours * e.hourly_rate), 0)          AS total_salary,
      COUNT(s.id)                                               AS shift_count
    FROM employees e
    LEFT JOIN shifts s
      ON s.employee_id = e.id
      AND s.status = 'scheduled'
      AND s.shift_date >= date_trunc('week', ${week}::date)
      AND s.shift_date <  date_trunc('week', ${week}::date) + interval '7 days'
    GROUP BY e.id, e.name, e.role, e.hourly_rate
    ORDER BY e.name ASC
  `;

  const totals = rows.reduce(
    (acc, r) => ({
      total_hours:  acc.total_hours  + Number(r.total_hours),
      total_salary: acc.total_salary + Number(r.total_salary),
    }),
    { total_hours: 0, total_salary: 0 }
  );

  return NextResponse.json({ employees: rows, totals });
}
