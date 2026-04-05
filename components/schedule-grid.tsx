'use client';

import { useState, useRef } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const employees = [
  { id: 1, name: 'Marco Rossi',      role: 'cook' },
  { id: 2, name: 'Sara Bianchi',     role: 'waiter' },
  { id: 3, name: 'Luca Ferrari',     role: 'cook' },
  { id: 4, name: 'Giulia Marino',    role: 'waiter' },
  { id: 5, name: 'Antonio Esposito', role: 'cook' },
];

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

function getMonday(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(monday: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function fmtMonthYear(date: Date) {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

const shiftMap: Record<number, Record<number, { start: string; end: string }>> = {};
for (const s of weeklyShifts) {
  if (!shiftMap[s.employee_id]) shiftMap[s.employee_id] = {};
  shiftMap[s.employee_id][s.dayIndex] = { start: s.start, end: s.end };
}

type View = 'front' | 'kitchen';

export default function ScheduleGrid() {
  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<View>(() => {
    if (typeof window === 'undefined') return 'front';
    return (localStorage.getItem('schedule-view') as View) ?? 'front';
  });
  const swipeLocked = useRef(false);

  const visibleEmployees = employees.filter((e) =>
    view === 'kitchen' ? e.role === 'cook' : e.role === 'waiter'
  );

  function handleWheel(e: React.WheelEvent) {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // ignore vertical scroll
    if (swipeLocked.current) return;
    if (Math.abs(e.deltaX) < 30) return;
    swipeLocked.current = true;
    setWeekOffset((o) => o + (e.deltaX > 0 ? 1 : -1));
    setTimeout(() => { swipeLocked.current = false; }, 600);
  }

  const monday = getMonday(today);
  monday.setDate(monday.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(monday);

  const todayStr = today.toISOString().slice(0, 10);
  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
          >
            ‹
          </button>
          <span className="text-sm font-semibold text-gray-800 min-w-[140px] text-center">
            {fmtMonthYear(weekDays[0])}
            {weekDays[0].getMonth() !== weekDays[6].getMonth() && (
              <> / {fmtMonthYear(weekDays[6])}</>
            )}
          </span>
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
          >
            ›
          </button>
        </div>
        <div className="flex items-center gap-2">
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
            >
              Today
            </button>
          )}
          <button
            onClick={() => setView((v) => {
              const next = v === 'front' ? 'kitchen' : 'front';
              localStorage.setItem('schedule-view', next);
              return next;
            })}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600 font-medium"
          >
            {view === 'front' ? 'Kitchen (Cooks)' : 'Front (Waiters)'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        className="bg-white rounded-xl border border-gray-200 overflow-x-auto"
        onWheel={handleWheel}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-5 py-3 font-semibold text-gray-700 w-48 bg-gray-50">
                Staff
              </th>
              {weekDays.map((d, i) => {
                const dateStr = d.toISOString().slice(0, 10);
                const isToday = dateStr === todayStr;
                return (
                  <th
                    key={i}
                    className={`px-3 py-3 text-center font-semibold min-w-[110px] ${
                      isToday ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <div>{DAYS[i]}</div>
                    <div className={`text-xs font-normal mt-0.5 ${isToday ? 'text-gray-300' : 'text-gray-400'}`}>
                      {d.getDate()}/{d.getMonth() + 1}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((emp, rowIndex) => (
              <tr key={emp.id} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="px-5 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{emp.name}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{emp.role}</p>
                </td>
                {weekDays.map((d, i) => {
                  const dateStr = d.toISOString().slice(0, 10);
                  const isToday = dateStr === todayStr;
                  // Only show shifts on current week
                  const shift = isCurrentWeek ? shiftMap[emp.id]?.[i] : undefined;
                  return (
                    <td
                      key={i}
                      className={`px-3 py-3 text-center border-b border-gray-100 ${isToday ? 'bg-yellow-50' : ''}`}
                    >
                      {shift ? (
                        <div className={`inline-flex flex-col items-center rounded-lg px-3 py-1.5 ${
                          emp.role === 'cook' ? 'bg-blue-50 text-blue-800' : 'bg-cyan-50 text-cyan-800'
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
