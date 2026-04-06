'use client';

import { useState, useRef, useEffect } from 'react';
import { exportToExcel, exportToPdf } from '@/lib/export';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

function TimeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [h, m] = value ? value.split(':') : ['08', '00'];
  const selectClass = "text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 w-full";
  return (
    <div className="flex gap-1 items-center">
      <select
        value={h}
        onChange={(e) => onChange(`${e.target.value}:${m}`)}
        className={selectClass}
      >
        {HOURS.map((hour) => <option key={hour} value={hour}>{hour}</option>)}
      </select>
      <span className="text-gray-400 dark:text-gray-500 font-bold">:</span>
      <select
        value={MINUTES.includes(m) ? m : '00'}
        onChange={(e) => onChange(`${h}:${e.target.value}`)}
        className={selectClass}
      >
        {MINUTES.map((min) => <option key={min} value={min}>{min}</option>)}
      </select>
    </div>
  );
}
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const employees = [
  { id: 1,  name: 'Daniel',       role: 'waiter'   },
  { id: 2,  name: 'Coli',      role: 'waiter' },
  { id: 3,  name: 'Toni',      role: 'waiter'   },
  { id: 4,  name: 'Dita',     role: 'waiter' },
  { id: 5,  name: 'Kevin',  role: 'waiter'   },
  { id: 6,  name: 'Bianca',      role: 'waiter'   },
  { id: 7,  name: 'AJ',       role: 'waiter'   },
  { id: 8,  name: 'Ben',   role: 'waiter'   },
  { id: 9,  name: 'Chris',   role: 'waiter'   },
  { id: 10, name: 'Mia',   role: 'waiter'   },
  { id: 11, name: 'Ross',    role: 'waiter' },
  { id: 12, name: 'Rubin',  role: 'waiter' },
  { id: 13, name: 'Henri',    role: 'waiter' },
  { id: 14, name: 'Ionel',    role: 'cook' },
  { id: 15, name: 'Costa',     role: 'cook' },
  { id: 16, name: 'Osman',   role: 'cook' },
  { id: 17, name: 'Reshat',     role: 'cook' },
  { id: 18, name: 'Ilyas', role: 'cook' },
];

type Shift = {
  employee_id: number;
  weekKey: string;
  dayIndex: number;
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
};

function getCurrentWeekKey(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const THIS_WEEK = getCurrentWeekKey();

const weeklyShifts: Shift[] = [
  { weekKey: THIS_WEEK, employee_id: 1, dayIndex: 0, start: '08:00', end: '16:00', breakStart: '12:00', breakEnd: '12:30' },
  { weekKey: THIS_WEEK, employee_id: 1, dayIndex: 1, start: '08:00', end: '16:00', breakStart: '12:00', breakEnd: '12:30' },
  { weekKey: THIS_WEEK, employee_id: 1, dayIndex: 3, start: '10:00', end: '18:00', breakStart: '14:00', breakEnd: '14:30' },
  { weekKey: THIS_WEEK, employee_id: 1, dayIndex: 4, start: '08:00', end: '16:00', breakStart: '12:00', breakEnd: '12:30' },
  { weekKey: THIS_WEEK, employee_id: 2, dayIndex: 0, start: '10:00', end: '18:00', breakStart: '14:00', breakEnd: '15:00' },
  { weekKey: THIS_WEEK, employee_id: 2, dayIndex: 2, start: '12:00', end: '20:00', breakStart: '16:00', breakEnd: '16:30' },
  { weekKey: THIS_WEEK, employee_id: 2, dayIndex: 4, start: '10:00', end: '18:00', breakStart: '14:00', breakEnd: '15:00' },
  { weekKey: THIS_WEEK, employee_id: 3, dayIndex: 1, start: '08:00', end: '16:00', breakStart: '12:00', breakEnd: '12:30' },
  { weekKey: THIS_WEEK, employee_id: 3, dayIndex: 5, start: '09:00', end: '17:00', breakStart: '13:00', breakEnd: '13:30' },
  { weekKey: THIS_WEEK, employee_id: 4, dayIndex: 0, start: '12:00', end: '20:00', breakStart: '16:00', breakEnd: '17:00' },
  { weekKey: THIS_WEEK, employee_id: 4, dayIndex: 2, start: '12:00', end: '20:00', breakStart: '16:00', breakEnd: '17:00' },
  { weekKey: THIS_WEEK, employee_id: 4, dayIndex: 4, start: '12:00', end: '20:00', breakStart: '16:00', breakEnd: '17:00' },
  { weekKey: THIS_WEEK, employee_id: 4, dayIndex: 6, start: '11:00', end: '19:00', breakStart: '15:00', breakEnd: '15:30' },
  { weekKey: THIS_WEEK, employee_id: 5, dayIndex: 3, start: '08:00', end: '14:00' },
  { weekKey: THIS_WEEK, employee_id: 5, dayIndex: 6, start: '09:00', end: '15:00', breakStart: '12:00', breakEnd: '12:30' },
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

function toLocalDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  // Monday-based: Sunday (0) becomes 6, others shift by -1
  const leadingBlanks = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(leadingBlanks).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// shiftMap is now built inside the component from state

type View = 'front' | 'kitchen';

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

type EditingShift = {
  employee_id: number;
  dayIndex: number;
  employeeName: string;
  dayLabel: string;
  start: string;
  end: string;
  breakStart: string;
  breakEnd: string;
};

type Employee = { id: number; name: string; role: string };

export default function ScheduleGrid() {
  const today = new Date();
  const [allEmployees, setAllEmployees] = useState<Employee[]>(employees);
  const [shifts, setShifts] = useState<Shift[]>(weeklyShifts);
  const [weekOffset, setWeekOffset] = useState(0);
  const [view, setView] = useState<View>('front');
  const [editing, setEditing] = useState<EditingShift | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [draggedEmployee, setDraggedEmployee] = useState<Employee | null>(null);
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [staffColumnDragOver, setStaffColumnDragOver] = useState(false);
  const [leaderboardMonth, setLeaderboardMonth] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });

  // Touch drag state
  const touchDragEmployee = useRef<Employee | null>(null);
  const touchGhost = useRef<HTMLDivElement | null>(null);
  const staffColumnRef = useRef<HTMLTableCellElement>(null);

  function createGhost(emp: Employee, x: number, y: number) {
    const ghost = document.createElement('div');
    ghost.textContent = emp.name;
    ghost.style.cssText = `
      position: fixed; z-index: 9999; pointer-events: none;
      padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 500;
      background: ${emp.role === 'cook' ? '#eff6ff' : '#ecfeff'};
      color: ${emp.role === 'cook' ? '#1e40af' : '#155e75'};
      border: 1px solid ${emp.role === 'cook' ? '#bfdbfe' : '#a5f3fc'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translate(-50%, -50%);
      left: ${x}px; top: ${y}px;
    `;
    document.body.appendChild(ghost);
    touchGhost.current = ghost;
  }

  function removeGhost() {
    if (touchGhost.current) {
      document.body.removeChild(touchGhost.current);
      touchGhost.current = null;
    }
  }

  function handleTouchStart(emp: Employee, e: React.TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    touchDragEmployee.current = emp;
    setDraggedEmployee(emp);
    createGhost(emp, touch.clientX, touch.clientY);
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchDragEmployee.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (touchGhost.current) {
      touchGhost.current.style.left = `${touch.clientX}px`;
      touchGhost.current.style.top = `${touch.clientY}px`;
    }
    // Check if over staff column
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const isOverStaff = staffColumnRef.current?.contains(el) || el === staffColumnRef.current;
    setStaffColumnDragOver(!!isOverStaff);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchDragEmployee.current) return;
    const touch = e.changedTouches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const isOverStaff = staffColumnRef.current?.contains(el) || el === staffColumnRef.current;
    if (isOverStaff) {
      addToGrid(touchDragEmployee.current);
    }
    touchDragEmployee.current = null;
    setDraggedEmployee(null);
    setStaffColumnDragOver(false);
    removeGhost();
  }
  // Per-week roster: { 'YYYY-MM-DD': [empId, ...] }
  const [weeklyGridIds, setWeeklyGridIds] = useState<Record<string, number[]>>(() => {
    const key = toLocalDateStr(getMonday(new Date()));
    return { [key]: [...new Set(weeklyShifts.map((s) => s.employee_id))] };
  });

  useEffect(() => {
    const stored = localStorage.getItem('schedule-view') as View;
    if (stored === 'front' || stored === 'kitchen') setView(stored);
  }, []);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const calendarRef = useRef<HTMLDivElement>(null);
  const swipeLocked = useRef(false);

  useEffect(() => {
    if (!calendarOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [calendarOpen]);

  function openCalendar() {
    // Sync calendar to the month currently being viewed
    const monday = getMonday(today);
    monday.setDate(monday.getDate() + weekOffset * 7);
    setCalYear(monday.getFullYear());
    setCalMonth(monday.getMonth());
    setCalendarOpen((o) => !o);
  }

  function handleDateClick(date: Date) {
    const todayMonday = getMonday(today);
    const clickedMonday = getMonday(date);
    const diff = Math.round(
      (clickedMonday.getTime() - todayMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    setWeekOffset(diff);
    setCalendarOpen(false);
  }


  function openEditor(emp: Employee, dayIndex: number, shift: Shift) {
    setEditing({
      employee_id: emp.id,
      dayIndex,
      employeeName: emp.name,
      dayLabel: `${DAYS[dayIndex]}`,
      start: shift.start,
      end: shift.end,
      breakStart: shift.breakStart ?? '',
      breakEnd: shift.breakEnd ?? '',
    });
  }

  function saveShift() {
    if (!editing) return;
    const exists = shifts.some(
      (s) => s.weekKey === weekKey && s.employee_id === editing.employee_id && s.dayIndex === editing.dayIndex
    );
    if (exists) {
      setShifts((prev) => prev.map((s) =>
        s.weekKey === weekKey && s.employee_id === editing.employee_id && s.dayIndex === editing.dayIndex
          ? {
              ...s,
              start: editing.start,
              end: editing.end,
              breakStart: editing.breakStart || undefined,
              breakEnd: editing.breakEnd || undefined,
            }
          : s
      ));
    } else {
      setShifts((prev) => [...prev, {
        weekKey,
        employee_id: editing.employee_id,
        dayIndex: editing.dayIndex,
        start: editing.start,
        end: editing.end,
        breakStart: editing.breakStart || undefined,
        breakEnd: editing.breakEnd || undefined,
      }]);
    }
    setEditing(null);
  }

  function openAdder(emp: Employee, dayIndex: number) {
    setEditing({
      employee_id: emp.id,
      dayIndex,
      employeeName: emp.name,
      dayLabel: DAYS[dayIndex],
      start: '08:00',
      end: '16:00',
      breakStart: '',
      breakEnd: '',
    });
  }

  const monday = getMonday(today);
  monday.setDate(monday.getDate() + weekOffset * 7);
  const weekDays = getWeekDays(monday);
  const weekKey = toLocalDateStr(monday);

  const shiftMap: Record<number, Record<number, Shift>> = {};
  for (const s of shifts.filter((s) => s.weekKey === weekKey)) {
    if (!shiftMap[s.employee_id]) shiftMap[s.employee_id] = {};
    shiftMap[s.employee_id][s.dayIndex] = s;
  }

  const roleFilter = (e: Employee) =>
    view === 'kitchen' ? e.role === 'cook' : e.role === 'waiter';

  const currentWeekIds: number[] = weeklyGridIds[weekKey] ?? [];

  // Pool: employees of current role not yet in this week's grid
  const poolEmployees = allEmployees.filter(
    (e) => roleFilter(e) && !currentWeekIds.includes(e.id)
  );

  // Grid rows: employees added to this specific week
  const visibleEmployees = allEmployees.filter(
    (e) => roleFilter(e) && currentWeekIds.includes(e.id)
  );

  function addNewEmployee() {
    const name = newEmployeeName.trim();
    if (!name) return;
    const newId = Math.max(...allEmployees.map((e) => e.id)) + 1;
    const newEmp: Employee = { id: newId, name, role: view === 'kitchen' ? 'cook' : 'waiter' };
    setAllEmployees((prev) => [...prev, newEmp]);
    setNewEmployeeName('');
    setAddingEmployee(false);
  }

  function addToGrid(emp: Employee) {
    setWeeklyGridIds((prev) => ({
      ...prev,
      [weekKey]: prev[weekKey] ? [...prev[weekKey], emp.id] : [emp.id],
    }));
    setDraggedEmployee(null);
    setStaffColumnDragOver(false);
  }

  function removeFromGrid(empId: number) {
    setWeeklyGridIds((prev) => ({
      ...prev,
      [weekKey]: (prev[weekKey] ?? []).filter((id: number) => id !== empId),
    }));
    setShifts((prev) => prev.filter((s) => s.employee_id !== empId));
  }

  function removeEmployeePermanently(empId: number) {
    setAllEmployees((prev) => prev.filter((e) => e.id !== empId));
    setWeeklyGridIds((prev) => {
      const next = { ...prev };
      for (const key in next) next[key] = next[key].filter((id: number) => id !== empId);
      return next;
    });
    setShifts((prev) => prev.filter((s) => s.employee_id !== empId));
    setViewingEmployee(null);
  }

  function duplicateLastWeek() {
    const prevMonday = new Date(monday);
    prevMonday.setDate(prevMonday.getDate() - 7);
    const prevWeekKey = toLocalDateStr(prevMonday);

    const prevShifts = shifts.filter((s) => s.weekKey === prevWeekKey);
    if (prevShifts.length === 0) {
      alert('No shifts found in the previous week to copy.');
      return;
    }

    const thisWeekShifts = shifts.filter((s) => s.weekKey === weekKey);
    if (thisWeekShifts.length > 0) {
      if (!confirm('This week already has shifts. Overwrite with last week\'s schedule?')) return;
      setShifts((prev) => prev.filter((s) => s.weekKey !== weekKey));
    }

    const copied = prevShifts.map((s) => ({ ...s, weekKey }));
    setShifts((prev) => [...prev.filter((s) => s.weekKey !== weekKey), ...copied]);

    // Also copy the staff roster from last week
    const prevRoster = weeklyGridIds[prevWeekKey] ?? [];
    if (prevRoster.length > 0) {
      setWeeklyGridIds((prev) => ({ ...prev, [weekKey]: [...prevRoster] }));
    }
  }

  function handleWheel(e: React.WheelEvent) {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    if (swipeLocked.current) return;
    if (Math.abs(e.deltaX) < 30) return;
    swipeLocked.current = true;
    setWeekOffset((o) => o + (e.deltaX > 0 ? 1 : -1));
    setTimeout(() => { swipeLocked.current = false; }, 600);
  }

  const todayStr = toLocalDateStr(today);
  const isCurrentWeek = weekOffset === 0;

  // For highlighting the selected week in the calendar
  const selectedWeekStart = getMonday(weekDays[0]);
  selectedWeekStart.setHours(0, 0, 0, 0);

  const calendarCells = buildCalendarGrid(calYear, calMonth);

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            ‹
          </button>

          {/* Clickable month label */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={openCalendar}
              className="text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[140px] text-center px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {weekDays[0].getMonth() === weekDays[6].getMonth()
                ? `${MONTHS[weekDays[0].getMonth()]} ${weekDays[0].getFullYear()}`
                : `${MONTHS[weekDays[0].getMonth()]} / ${MONTHS[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`
              }
            </button>

            {/* Calendar dropdown */}
            {calendarOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 w-72">
                {/* Calendar header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => {
                      if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
                      else setCalMonth((m) => m - 1);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                  >
                    ‹
                  </button>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {MONTHS[calMonth]} {calYear}
                  </span>
                  <button
                    onClick={() => {
                      if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
                      else setCalMonth((m) => m + 1);
                    }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                  >
                    ›
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i} className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Date cells */}
                <div className="grid grid-cols-7 gap-y-1">
                  {calendarCells.map((date, i) => {
                    if (!date) return <div key={i} />;

                    const dateStr = toLocalDateStr(date);
                    const isToday = dateStr === todayStr;
                    const cellMonday = getMonday(date);
                    cellMonday.setHours(0, 0, 0, 0);
                    const isInSelectedWeek =
                      cellMonday.getTime() === selectedWeekStart.getTime();

                    return (
                      <button
                        key={i}
                        onClick={() => handleDateClick(date)}
                        className={`
                          text-xs py-1.5 rounded-lg transition-colors font-medium
                          ${isToday
                            ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                            : isInSelectedWeek
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                        `}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            ›
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
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
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 font-medium"
          >
            {view === 'front' ? 'Kitchen (Cooks)' : 'Front (Waiters)'}
          </button>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

          <button
            onClick={duplicateLastWeek}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            title="Copy last week's shifts into this week"
          >
            Copy last week
          </button>

          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

          <button
            onClick={() => {
              const shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              const label = `${weekDays[0].getDate()}${shortMonths[weekDays[0].getMonth()]}-${weekDays[6].getDate()}${shortMonths[weekDays[6].getMonth()]}-${weekDays[6].getFullYear()}`;
              exportToExcel(visibleEmployees, shifts, weekDays, label);
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            Export Excel
          </button>
          <button
            onClick={() => {
              const shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              const label = `${weekDays[0].getDate()}${shortMonths[weekDays[0].getMonth()]}-${weekDays[6].getDate()}${shortMonths[weekDays[6].getMonth()]}-${weekDays[6].getFullYear()}`;
              exportToPdf(visibleEmployees, shifts, weekDays, label);
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Staff pool */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            <span className="hidden md:inline">Available Staff — drag to schedule</span>
            <span className="md:hidden">Available Staff — drag onto Staff column</span>
          </p>
          <button
            onClick={() => { setAddingEmployee(true); setNewEmployeeName(''); }}
            className="text-xs px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 font-medium"
          >
            + Add {view === 'kitchen' ? 'Cook' : 'Waiter'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {poolEmployees.map((emp) => (
            <div
              key={emp.id}
              draggable
              onDragStart={() => setDraggedEmployee(emp)}
              onDragEnd={() => { setDraggedEmployee(null); setStaffColumnDragOver(false); }}
              onTouchStart={(e) => handleTouchStart(emp, e)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium cursor-grab active:cursor-grabbing select-none transition-opacity touch-none ${
                draggedEmployee?.id === emp.id ? 'opacity-40' : 'opacity-100'
              } ${
                emp.role === 'cook'
                  ? 'border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-800/50 text-blue-900 dark:text-blue-200'
                  : 'border-cyan-300 dark:border-cyan-700 bg-cyan-100 dark:bg-cyan-800/50 text-cyan-900 dark:text-cyan-200'
              }`}
            >
              <span className="text-xs">{emp.role === 'cook' ? '👨‍🍳' : '🍽️'}</span>
              {emp.name}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Remove ${emp.name} permanently?`)) removeEmployeePermanently(emp.id);
                }}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-current hover:text-red-500 leading-none"
                title="Remove permanently"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto"
        onWheel={handleWheel}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th
                ref={staffColumnRef}
                onDragOver={(e) => { if (draggedEmployee) { e.preventDefault(); setStaffColumnDragOver(true); } }}
                onDragLeave={() => setStaffColumnDragOver(false)}
                onDrop={(e) => { e.preventDefault(); if (draggedEmployee) addToGrid(draggedEmployee); }}
                className={`text-left px-5 py-3 font-semibold w-48 transition-colors ${
                  staffColumnDragOver
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-dashed border-green-300 dark:border-green-700'
                    : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                {staffColumnDragOver ? 'Drop to add' : 'Staff'}
              </th>
              {weekDays.map((d, i) => {
                const dateStr = toLocalDateStr(d);
                const isToday = dateStr === todayStr;
                return (
                  <th
                    key={i}
                    className={`px-3 py-3 text-center font-semibold min-w-[110px] ${
                      isToday ? 'bg-gray-900 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <div className="text-xs font-medium tracking-wide">{DAYS[i]}</div>
                    <div className={`text-base font-bold mt-0.5 ${isToday ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                      {d.getDate()}
                    </div>
                    <div className={`text-xs font-normal ${isToday ? 'text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                      {d.toLocaleDateString('en-GB', { month: 'short' })}
                    </div>
                  </th>
                );
              })}
              <th className="px-3 py-3 text-center font-semibold min-w-[80px] bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((emp, rowIndex) => (
              <tr key={emp.id} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                <td className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between group">
                    <button
                      onClick={() => setViewingEmployee(emp)}
                      className="text-left hover:underline underline-offset-2"
                    >
                      <p className="font-medium text-gray-900 dark:text-gray-100">{emp.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-0.5">{emp.role}</p>
                    </button>
                    <button
                      onClick={() => removeFromGrid(emp.id)}
                      title="Remove from schedule"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-500 text-lg leading-none pl-2"
                    >
                      ×
                    </button>
                  </div>
                </td>
                {weekDays.map((d, i) => {
                  const dateStr = toLocalDateStr(d);
                  const isToday = dateStr === todayStr;
                  const shift = shiftMap[emp.id]?.[i];
                  return (
                    <td
                      key={i}
                      className={`px-3 py-3 text-center border-b border-gray-200 dark:border-gray-700 ${
                        isToday ? 'bg-yellow-50 dark:bg-yellow-900/30' : ''
                      }`}
                    >
                      {shift ? (
                        <button
                          onClick={() => openEditor(emp, i, shift)}
                          className={`inline-flex flex-col items-center rounded-lg px-3 py-1.5 gap-1 transition-opacity hover:opacity-75 ${
                            emp.role === 'cook'
                              ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                              : 'bg-cyan-100 dark:bg-cyan-800/50 text-cyan-900 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-700'
                          }`}
                        >
                          <span className="font-medium text-xs">{shift.start}–{shift.end}</span>
                          {shift.breakStart && shift.breakEnd && (
                            <span className="text-xs opacity-60 flex items-center gap-1">
                              <span>⏸</span>
                              <span>{shift.breakStart}–{shift.breakEnd}</span>
                            </span>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => openAdder(emp, i)}
                          className="text-gray-200 dark:text-gray-700 hover:text-gray-400 dark:hover:text-gray-500 transition-colors text-lg leading-none"
                          title="Add shift"
                        >
                          +
                        </button>
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-3 text-center border-b border-gray-200 dark:border-gray-700">
                  {(() => {
                    const totalMins = shifts
                      .filter((s) => s.weekKey === weekKey && s.employee_id === emp.id)
                      .reduce((acc, s) => {
                        const gross = timeToMinutes(s.end) - timeToMinutes(s.start);
                        const brk = s.breakStart && s.breakEnd
                          ? timeToMinutes(s.breakEnd) - timeToMinutes(s.breakStart)
                          : 0;
                        return acc + gross - brk;
                      }, 0);
                    return totalMins > 0 ? (
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatHours(totalMins)}
                      </span>
                    ) : (
                      <span className="text-gray-200 dark:text-gray-700">—</span>
                    );
                  })()}
                </td>
              </tr>
            ))}
            {visibleEmployees.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                  No staff scheduled — drag someone from the pool above
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Employee weekly summary modal */}
      {viewingEmployee && (() => {
        const empShifts = shifts
          .filter((s) => s.weekKey === weekKey && s.employee_id === viewingEmployee.id)
          .map((s) => {
            const shiftMins = timeToMinutes(s.end) - timeToMinutes(s.start);
            const breakMins = s.breakStart && s.breakEnd
              ? timeToMinutes(s.breakEnd) - timeToMinutes(s.breakStart)
              : 0;
            return { ...s, shiftMins, breakMins, netMins: shiftMins - breakMins };
          });
        const totalShift = empShifts.reduce((a, s) => a + s.shiftMins, 0);
        const totalBreak = empShifts.reduce((a, s) => a + s.breakMins, 0);
        const totalNet   = empShifts.reduce((a, s) => a + s.netMins, 0);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setViewingEmployee(null)}>
            <div
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{viewingEmployee.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{viewingEmployee.role} — weekly summary</p>
              </div>

              <div className="space-y-2">
                {empShifts.length === 0 ? (
                  <p className="text-sm text-gray-400 dark:text-gray-500">No shifts this week.</p>
                ) : (
                  empShifts.map((s) => (
                    <div key={s.dayIndex} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 w-10">{DAYS[s.dayIndex]}</span>
                      <span className="text-gray-500 dark:text-gray-500 text-xs">{s.start}–{s.end}</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium w-16 text-right">
                        {formatHours(s.netMins)}
                        {s.breakMins > 0 && (
                          <span className="text-gray-400 dark:text-gray-500 font-normal text-xs"> −{formatHours(s.breakMins)}</span>
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {empShifts.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Gross hours</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{formatHours(totalShift)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total break</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{formatHours(totalBreak)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-1 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-gray-900 dark:text-gray-100">Net hours</span>
                    <span className="text-gray-900 dark:text-gray-100">{formatHours(totalNet)}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setViewingEmployee(null)}
                  className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${viewingEmployee.name} permanently?`)) removeEmployeePermanently(viewingEmployee.id);
                  }}
                  className="flex-1 px-4 py-2 text-sm rounded-lg border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Shift editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditing(null)}>
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{editing.employeeName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {editing.dayLabel} — {shifts.some(s => s.weekKey === weekKey && s.employee_id === editing.employee_id && s.dayIndex === editing.dayIndex) ? 'Edit shift' : 'Add shift'}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Shift</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Start</label>
                  <TimeSelect value={editing.start} onChange={(v) => setEditing({ ...editing, start: v })} />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">End</label>
                  <TimeSelect value={editing.end} onChange={(v) => setEditing({ ...editing, end: v })} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Break</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Start</label>
                  <TimeSelect value={editing.breakStart || '12:00'} onChange={(v) => setEditing({ ...editing, breakStart: v })} />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">End</label>
                  <TimeSelect value={editing.breakEnd || '12:00'} onChange={(v) => setEditing({ ...editing, breakEnd: v })} />
                </div>
              </div>
              {(editing.breakStart || editing.breakEnd) && (
                <button
                  onClick={() => setEditing({ ...editing, breakStart: '', breakEnd: '' })}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove break
                </button>
              )}
            </div>

            {shifts.some(s => s.weekKey === weekKey && s.employee_id === editing.employee_id && s.dayIndex === editing.dayIndex) && (
              <button
                onClick={() => {
                  setShifts((prev) => prev.filter(
                    (s) => !(s.weekKey === weekKey && s.employee_id === editing.employee_id && s.dayIndex === editing.dayIndex)
                  ));
                  setEditing(null);
                }}
                className="w-full px-4 py-2 text-sm rounded-lg border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Remove shift
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveShift}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add employee modal */}
      {addingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setAddingEmployee(false)}>
          <div
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Add {view === 'kitchen' ? 'Cook' : 'Waiter'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                They will appear in the staff pool.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Name</label>
              <input
                type="text"
                autoFocus
                placeholder="Full name"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addNewEmployee(); if (e.key === 'Escape') setAddingEmployee(false); }}
                className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setAddingEmployee(false)}
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNewEmployee}
                disabled={!newEmployeeName.trim()}
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 transition-opacity font-medium disabled:opacity-40"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-blue-100 dark:bg-blue-800/50 border border-blue-300 dark:border-blue-700" />
          Cook
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-cyan-100 dark:bg-cyan-800/50 border border-cyan-300 dark:border-cyan-700" />
          Waiter
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800" />
          Today
        </span>
      </div>

      {/* Monthly Leaderboard */}
      {(() => {
        const { year, month } = leaderboardMonth;
        const medals = ['🥇', '🥈', '🥉'];

        const monthShifts = shifts.filter((s) => {
          const d = new Date(s.weekKey);
          d.setDate(d.getDate() + s.dayIndex);
          return d.getFullYear() === year && d.getMonth() === month;
        });

        const totals: Record<number, number> = {};
        for (const s of monthShifts) {
          const gross = timeToMinutes(s.end) - timeToMinutes(s.start);
          const breakMins = (s.breakStart && s.breakEnd)
            ? timeToMinutes(s.breakEnd) - timeToMinutes(s.breakStart)
            : 0;
          totals[s.employee_id] = (totals[s.employee_id] ?? 0) + gross - breakMins;
        }

        function RankList({ role, barColor }: { role: 'waiter' | 'cook'; barColor: string }) {
          const ranked = allEmployees
            .filter((e) => e.role === role && (totals[e.id] ?? 0) > 0)
            .map((e) => ({ ...e, minutes: totals[e.id] }))
            .sort((a, b) => b.minutes - a.minutes);
          const max = ranked[0]?.minutes ?? 1;

          return ranked.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">No shifts recorded.</p>
          ) : (
            <div className="space-y-2.5">
              {ranked.map((emp, i) => (
                <div key={emp.id} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center shrink-0">{medals[i] ?? <span className="text-xs text-gray-400">{i + 1}</span>}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{emp.name}</span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-2 shrink-0">{formatHours(emp.minutes)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          i === 0 ? 'bg-amber-400 dark:bg-amber-500' :
                          i === 1 ? 'bg-gray-400 dark:bg-gray-400' :
                          i === 2 ? 'bg-orange-400 dark:bg-orange-500' :
                          barColor
                        }`}
                        style={{ width: `${(emp.minutes / max) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        }

        return (
          <div className="space-y-3">
            {/* Month picker header */}
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Monthly Leaderboard</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLeaderboardMonth(({ year: y, month: m }) => {
                    const d = new Date(y, m - 1, 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  })}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[110px] text-center">
                  {MONTHS[month]} {year}
                </span>
                <button
                  onClick={() => setLeaderboardMonth(({ year: y, month: m }) => {
                    const d = new Date(y, m + 1, 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  })}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            {/* Single panel matching current view */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {view === 'kitchen' ? 'Cooks' : 'Waiters'}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Net hours worked</p>
              </div>
              <RankList
                role={view === 'kitchen' ? 'cook' : 'waiter'}
                barColor={view === 'kitchen' ? 'bg-blue-400 dark:bg-blue-500' : 'bg-cyan-400 dark:bg-cyan-500'}
              />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
