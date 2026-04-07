'use client';

import { useRole } from './role-provider';

type Section = {
  icon: string;
  title: string;
  steps: string[];
  adminOnly?: boolean;
};

const sections: Section[] = [
  {
    icon: '📅',
    title: 'Navigating weeks',
    steps: [
      'Use the left and right arrows at the top to move between weeks.',
      'Click the date label to open a calendar and jump to any week.',
      'Click "Today" to return to the current week.',
    ],
  },
  {
    icon: '➕',
    title: 'Adding a shift',
    steps: [
      'Find the employee row and the day column you want.',
      'Click the + button in the empty cell.',
      'Set the start time, end time, and optionally a break.',
      'Click Save.',
    ],
    adminOnly: true,
  },
  {
    icon: '✏️',
    title: 'Editing or deleting a shift',
    steps: [
      'Click on any existing shift chip to open the editor.',
      'Adjust the times or break as needed and click Save.',
      'To delete the shift, click the Remove button inside the editor.',
    ],
    adminOnly: true,
  },
  {
    icon: '📋',
    title: 'Copying a shift',
    steps: [
      'Hover over any shift chip — a small copy icon appears in the top corner.',
      'Click it to copy the shift times.',
      'A green indicator appears in the toolbar confirming what was copied.',
      'Click the paste icon (clipboard) in any empty cell to apply it.',
      'The clipboard clears automatically after one paste.',
    ],
    adminOnly: true,
  },
  {
    icon: '👤',
    title: 'Adding staff to the schedule',
    steps: [
      'Find the staff pool below the toolbar.',
      'Drag an employee chip and drop it onto the "Staff" column header in the table.',
      'On mobile, press and hold an employee chip, then drag it to the Staff column.',
    ],
    adminOnly: true,
  },
  {
    icon: '🗑️',
    title: 'Removing staff from the schedule',
    steps: [
      'Hover over an employee name in the table — a × button appears.',
      'Click × to remove them from this week\'s roster.',
      'They remain in the staff pool and can be re-added next week.',
    ],
    adminOnly: true,
  },
  {
    icon: '👥',
    title: 'Adding a new employee',
    steps: [
      'Click the "+ Add Waiter" or "+ Add Cook" button in the staff pool.',
      'Enter their name and click Add.',
      'They appear in the staff pool and can be dragged into any week.',
    ],
    adminOnly: true,
  },
  {
    icon: '❌',
    title: 'Removing an employee permanently',
    steps: [
      'Hover over their chip in the staff pool — a × button appears.',
      'Click × and confirm to remove them from the system entirely.',
      'You can also click their name in the table, then click Remove.',
    ],
    adminOnly: true,
  },
  {
    icon: '🔁',
    title: 'Copying last week',
    steps: [
      'Click "Copy last week" in the toolbar.',
      'The previous week\'s shifts and roster are duplicated into the current week.',
      'You can then edit individual shifts as needed.',
    ],
    adminOnly: true,
  },
  {
    icon: '🏆',
    title: 'Monthly leaderboard',
    steps: [
      'Scroll to the bottom of the page to see the leaderboard.',
      'It shows who worked the most hours that month, net of breaks.',
      'Use the arrows to browse previous months.',
      'The leaderboard matches the current view — Waiters or Cooks.',
    ],
  },
  {
    icon: '👁️',
    title: 'Switching between Waiters and Cooks',
    steps: [
      'Click the "Kitchen (Cooks)" or "Front (Waiters)" button in the toolbar.',
      'Each view has its own schedule table and leaderboard.',
    ],
  },
  {
    icon: '📤',
    title: 'Exporting the schedule',
    steps: [
      'Click "Export Excel" to download a spreadsheet of the current week.',
      'Click "Export PDF" to download a printable PDF.',
      'Files are named Pieno_[date range] automatically.',
    ],
    adminOnly: true,
  },
];

export default function HelpDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { role, loading } = useRole();
  const isAdmin = !loading && role === 'admin';

  const visibleSections = sections.filter((s) => !s.adminOnly || isAdmin);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full z-50 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">How to use Pieno</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {isAdmin ? 'Admin guide' : 'Staff guide'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close help"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {visibleSections.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">{section.icon}</span>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{section.title}</h3>
              </div>
              <ol className="space-y-1 pl-1">
                {section.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    <span className="shrink-0 font-semibold text-gray-300 dark:text-gray-600">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">Pieno — Restaurant Schedule Manager</p>
        </div>
      </div>
    </>
  );
}
