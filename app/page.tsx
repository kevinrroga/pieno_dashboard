function fmtDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function getWeekDays(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMon);
  d.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(d);
    dd.setDate(d.getDate() + i);
    return dd;
  });
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const employees = [
  { id: 1, name: 'Marco Rossi',      role: 'cook' },
  { id: 2, name: 'Sara Bianchi',     role: 'waiter' },
  { id: 3, name: 'Luca Ferrari',     role: 'cook' },
  { id: 4, name: 'Giulia Marino',    role: 'waiter' },
  { id: 5, name: 'Antonio Esposito', role: 'cook' },
];

// dayIndex: 0=Mon … 6=Sun
const weeklyShifts: { employee_id: number; dayIndex: number; start: string; end: string }[] = [
  { employee_id: 1, dayIndex: 0, start: '08:00', end: '16:00' },
  { employee_id: 1, dayIndex: 1, start: '08:00', end: '16:00' },
  { employee_id: 1, dayIndex: 3, start: '10:00', end: '18:00' },
  { employee_id: 1, dayIndex: 4, start: '08:00', end: '16:00' },
  { employee_id: 2, dayIndex: 0, start: '10:00', end: '18:00' },
  { employee_id: 2, dayIndex: 2, start: '12:00', end: '20:00' },
  { employee_id: 2, dayIndex: 4, start: '10:00', end: '18:00' },
  { employee_id: 3, dayIndex: 1, start: '08:00', end: '16:00' },
  { employee_id: 3, dayIndex: 5, start: '09:00', end: '17:00' },
  { employee_id: 4, dayIndex: 0, start: '12:00', end: '20:00' },
  { employee_id: 4, dayIndex: 2, start: '12:00', end: '20:00' },
  { employee_id: 4, dayIndex: 4, start: '12:00', end: '20:00' },
  { employee_id: 4, dayIndex: 6, start: '11:00', end: '19:00' },
  { employee_id: 5, dayIndex: 3, start: '08:00', end: '14:00' },
  { employee_id: 5, dayIndex: 6, start: '09:00', end: '15:00' },
];

export default async function DashboardPage() {
  const today = new Date();
  const weekDays = getWeekDays(today);
  const todayIndex = (today.getDay() === 0 ? 7 : today.getDay()) - 1; // 0=Mon

  // Build lookup: employee_id -> dayIndex -> shift
  const shiftMap: Record<number, Record<number, { start: string; end: string }>> = {};
  for (const s of weeklyShifts) {
    if (!shiftMap[s.employee_id]) shiftMap[s.employee_id] = {};
    shiftMap[s.employee_id][s.dayIndex] = { start: s.start, end: s.end };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">{fmtDate(today)}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-5 py-3 font-semibold text-gray-700 w-48 bg-gray-50">
                Staff
              </th>
              {DAYS.map((day, i) => {
                const isToday = i === todayIndex;
                return (
                  <th
                    key={day}
                    className={`px-3 py-3 text-center font-semibold min-w-[110px] ${
                      isToday ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div>{day}</div>
                    <div className={`text-xs font-normal mt-0.5 ${isToday ? 'text-gray-300' : 'text-gray-400'}`}>
                      {weekDays[i].getDate()}/{weekDays[i].getMonth() + 1}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, rowIndex) => (
              <tr
                key={emp.id}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
              >
                <td className="px-5 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{emp.role}</p>
                </td>
                {DAYS.map((_, i) => {
                  const shift = shiftMap[emp.id]?.[i];
                  const isToday = i === todayIndex;
                  return (
                    <td
                      key={i}
                      className={`px-3 py-3 text-center border-b border-gray-100 ${
                        isToday ? 'bg-yellow-50' : ''
                      }`}
                    >
                      {shift ? (
                        <div className={`inline-flex flex-col items-center rounded-lg px-3 py-1.5 ${
                          emp.role === 'cook'
                            ? 'bg-blue-50 text-blue-800'
                            : 'bg-cyan-50 text-cyan-800'
                        }`}>
                          <span className="font-medium text-xs">{shift.start}–{shift.end}</span>
                        </div>
                      ) : (
                        <span className="text-gray-200">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-blue-100 border border-blue-200" />
          Cook
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-cyan-100 border border-cyan-200" />
          Waiter
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-yellow-100 border border-yellow-200" />
          Today
        </span>
      </div>
    </div>
  );
}
