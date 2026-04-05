import ScheduleGrid from '@/components/schedule-grid';
import ErrorBoundary from '@/components/error-boundary';

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
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Weekly Schedule</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{fmtDate(today)}</p>
      </div>
      <ErrorBoundary>
        <ScheduleGrid />
      </ErrorBoundary>
    </div>
  );
}
