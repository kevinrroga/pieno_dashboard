import ScheduleGrid from '@/components/schedule-grid';

function fmtDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function DashboardPage() {
  const today = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">{fmtDate(today)}</p>
      </div>
      <ScheduleGrid />
    </div>
  );
}
