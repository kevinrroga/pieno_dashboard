import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Nav from '@/components/nav';
import ThemeProvider from '@/components/theme-provider';
import RoleProvider from '@/components/role-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Pieno Dashboard',
  description: 'Restaurant shift management',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          <RoleProvider>
            <div className="flex min-h-screen">
              <Nav />
              <main className="flex-1 p-4 md:p-8 overflow-auto pt-16 md:pt-8">{children}</main>
            </div>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
