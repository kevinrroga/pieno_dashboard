import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PdfPrinter = require('pdfmake') as new (fonts: Record<string, unknown>) => { createPdfKitDocument: (def: unknown) => NodeJS.ReadableStream & { end: () => void } };
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

const fonts = {
  Helvetica: {
    normal:      'Helvetica',
    bold:        'Helvetica-Bold',
    italics:     'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
};

// GET /api/export/pdf?week=YYYY-MM-DD
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
      e.name                                                     AS employee_name,
      e.role,
      to_char(s.shift_date, 'DD/MM/YYYY')                        AS shift_date,
      to_char(s.start_time, 'HH24:MI')                           AS start_time,
      to_char(s.end_time,   'HH24:MI')                           AS end_time,
      s.total_hours,
      ROUND((s.total_hours * e.hourly_rate)::numeric, 2)         AS salary
    FROM shifts s
    JOIN employees e ON e.id = s.employee_id
    WHERE s.shift_date >= date_trunc('week', ${week}::date)
      AND s.shift_date <  date_trunc('week', ${week}::date) + interval '7 days'
      AND s.status = 'scheduled'
    ORDER BY s.shift_date ASC, e.name ASC
  `;

  const totalHours  = shifts.reduce((acc, s) => acc + Number(s.total_hours), 0);
  const totalSalary = shifts.reduce((acc, s) => acc + Number(s.salary), 0);

  const tableBody = [
    // Header row
    ['Employee', 'Role', 'Date', 'Start', 'End', 'Hours', 'Salary (€)'].map(
      (h) => ({ text: h, style: 'tableHeader' })
    ),
    // Data rows
    ...shifts.map((s) => [
      s.employee_name,
      s.role,
      s.shift_date,
      s.start_time,
      s.end_time,
      Number(s.total_hours).toFixed(2),
      Number(s.salary).toFixed(2),
    ]),
    // Totals row
    [
      { text: 'TOTAL', bold: true, colSpan: 5 }, {}, {}, {}, {},
      { text: totalHours.toFixed(2), bold: true },
      { text: totalSalary.toFixed(2), bold: true },
    ],
  ];

  const docDefinition: TDocumentDefinitions = {
    defaultStyle: { font: 'Helvetica' },
    content: [
      { text: `Weekly Schedule — ${week}`, style: 'header' },
      { text: '\n' },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: tableBody,
        },
        layout: 'lightHorizontalLines',
      },
    ],
    styles: {
      header:      { fontSize: 16, bold: true },
      tableHeader: { bold: true, fillColor: '#f0f0f0' },
    },
  };

  const printer = new PdfPrinter(fonts);
  const doc = printer.createPdfKitDocument(docDefinition);

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', resolve);
    doc.on('error', reject);
    doc.end();
  });

  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="schedule-${week}.pdf"`,
    },
  });
}
