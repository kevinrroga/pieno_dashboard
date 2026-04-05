'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './theme-provider';

const links = [
  { href: '/',          label: 'Dashboard' },
  { href: '/schedule',  label: 'Weekly Schedule' },
  { href: '/employees', label: 'Employees' },
];

export default function Nav() {
  const pathname = usePathname();
  const { dark, toggle } = useTheme();

  return (
    <aside className="w-52 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col py-6 px-4 gap-1">
      <span className="text-lg font-bold text-gray-900 dark:text-white mb-6 px-2">Pieno</span>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === href
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {label}
        </Link>
      ))}
      <div className="mt-auto px-2">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span>{dark ? 'Light mode' : 'Dark mode'}</span>
          <span>{dark ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </aside>
  );
}
