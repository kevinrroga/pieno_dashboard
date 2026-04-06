'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from './theme-provider';

const links = [
  { href: '/',          label: 'Dashboard' },
  { href: '/schedule',  label: 'Weekly Schedule' },
  { href: '/employees', label: 'Employees' },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const navContent = (
    <>
      <span className="text-lg font-bold text-gray-900 dark:text-white mb-6 px-2 block">Pieno</span>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setOpen(false)}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors block ${
            pathname === href
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {label}
        </Link>
      ))}
      <div className="mt-auto px-2 flex flex-col gap-1">
        <button
          onClick={() => { setOpen(false); toggle(); }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span>{dark ? 'Light mode' : 'Dark mode'}</span>
          <span>{dark ? '☀️' : '🌙'}</span>
        </button>
        <button
          onClick={() => { setOpen(false); handleLogout(); }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span>Sign out</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col py-6 px-4 gap-1">
        {navContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 py-3">
        <span className="text-base font-bold text-gray-900 dark:text-white">Pieno</span>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="5" x2="17" y2="5" />
            <line x1="3" y1="10" x2="17" y2="10" />
            <line x1="3" y1="15" x2="17" y2="15" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-64 bg-white dark:bg-gray-900 flex flex-col py-6 px-4 gap-1 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="14" y2="14" />
                <line x1="14" y1="2" x2="2" y2="14" />
              </svg>
            </button>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
