'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',           label: 'Dashboard' },
  { href: '/schedule',   label: 'Weekly Schedule' },
  { href: '/employees',  label: 'Employees' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col py-6 px-4 gap-1">
      <span className="text-lg font-bold text-gray-900 mb-6 px-2">Pieno</span>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === href
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </Link>
      ))}
    </aside>
  );
}
