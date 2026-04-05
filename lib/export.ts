import * as XLSX from 'xlsx';

type Shift = {
  employee_id: number;
  dayIndex: number;
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
};

type Employee = { id: number; name: string; role: string };

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function buildRows(employees: Employee[], shifts: Shift[], weekDays: Date[]) {
  return employees.map((emp) => {
    const row: Record<string, string> = {
      Name: emp.name,
      Role: emp.role.charAt(0).toUpperCase() + emp.role.slice(1),
    };

    let totalNet = 0;

    DAYS.forEach((day, i) => {
      const shift = shifts.find(
        (s) => s.employee_id === emp.id && s.dayIndex === i
      );
      const dateLabel = `${day} ${weekDays[i].getDate()}/${weekDays[i].getMonth() + 1}`;
      if (shift) {
        const gross = timeToMinutes(shift.end) - timeToMinutes(shift.start);
        const brk = shift.breakStart && shift.breakEnd
          ? timeToMinutes(shift.breakEnd) - timeToMinutes(shift.breakStart)
          : 0;
        const net = gross - brk;
        totalNet += net;
        row[dateLabel] = shift.breakStart
          ? `${shift.start}–${shift.end} (break ${shift.breakStart}–${shift.breakEnd})`
          : `${shift.start}–${shift.end}`;
      } else {
        row[dateLabel] = '—';
      }
    });

    row['Total Hours'] = formatHours(totalNet);
    return row;
  });
}

export function exportToExcel(
  employees: Employee[],
  shifts: Shift[],
  weekDays: Date[],
  weekLabel: string
) {
  const rows = buildRows(employees, shifts, weekDays);
  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 22 }, { wch: 10 },
    ...DAYS.map(() => ({ wch: 36 })),
    { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
  XLSX.writeFile(wb, `schedule-${weekLabel}.xlsx`);
}

export async function exportToPdf(
  employees: Employee[],
  shifts: Shift[],
  weekDays: Date[],
  weekLabel: string
) {
  const pdfMake = (await import('pdfmake/build/pdfmake')).default;
  const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default;
  pdfMake.vfs = pdfFonts.vfs;

  const body: object[][] = [
    // Header row
    ['Name', 'Role', ...DAYS.map((d, i) => `${d} ${weekDays[i].getDate()}/${weekDays[i].getMonth() + 1}`), 'Total Hours']
      .map((h) => ({ text: h, style: 'header', fillColor: '#f3f4f6' })),
  ];

  employees.forEach((emp) => {
    let totalNet = 0;
    const dayCells = DAYS.map((_, i) => {
      const shift = shifts.find((s) => s.employee_id === emp.id && s.dayIndex === i);
      if (!shift) return { text: '—', color: '#d1d5db' };
      const gross = timeToMinutes(shift.end) - timeToMinutes(shift.start);
      const brk = shift.breakStart && shift.breakEnd
        ? timeToMinutes(shift.breakEnd) - timeToMinutes(shift.breakStart)
        : 0;
      totalNet += gross - brk;
      return {
        text: shift.breakStart
          ? `${shift.start}–${shift.end}\nbreak ${shift.breakStart}–${shift.breakEnd}`
          : `${shift.start}–${shift.end}`,
        fontSize: 8,
      };
    });

    body.push([
      { text: emp.name, bold: true },
      { text: emp.role.charAt(0).toUpperCase() + emp.role.slice(1) },
      ...dayCells,
      { text: formatHours(totalNet), bold: true },
    ]);
  });

  const docDefinition = {
    pageOrientation: 'landscape' as const,
    pageMargins: [20, 30, 20, 30] as [number, number, number, number],
    content: [
      { text: `Weekly Schedule — ${weekLabel}`, style: 'title', margin: [0, 0, 0, 12] },
      {
        table: {
          headerRows: 1,
          widths: [90, 40, ...DAYS.map(() => '*'), 50],
          body,
        },
        layout: 'lightHorizontalLines',
      },
    ],
    styles: {
      title: { fontSize: 14, bold: true },
      header: { fontSize: 9, bold: true },
    },
    defaultStyle: { fontSize: 9 },
  };

  pdfMake.createPdf(docDefinition).download(`schedule-${weekLabel}.pdf`);
}
