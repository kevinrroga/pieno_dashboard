# Pieno — Restaurant Schedule Manager

A web-based staff scheduling dashboard built for restaurants. Manage weekly rosters, track hours, and keep your front-of-house and kitchen teams organised — all in one place.

## Features

- **Weekly schedule grid** — view and manage shifts for each employee across the week
- **Front of house & kitchen views** — separate timetables for waiters and cooks, switchable with one click
- **Shift management** — add, edit, and remove shifts directly from the grid, including break times
- **Staff pool** — drag and drop employees onto the weekly roster; add or remove staff permanently
- **Per-week rosters** — each week maintains its own roster independently
- **Duplicate last week** — copy the previous week's schedule and roster with one click
- **Total hours column** — net hours worked per employee (shift time minus breaks) shown inline
- **Monthly leaderboard** — ranks employees by hours worked per month, separated by role
- **Employee summary** — click any name to see a weekly breakdown of their hours
- **Export** — download the current week's schedule as Excel (`.xlsx`) or PDF
- **Dark mode** — full light/dark theme support
- **Mobile responsive** — works on phones and tablets with touch drag-and-drop support
- **Login system** — protected with JWT session authentication

## Tech Stack

- [Next.js 14](https://nextjs.org) — React framework with App Router
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling
- [jose](https://github.com/panva/jose) — JWT signing and verification
- [xlsx](https://github.com/SheetJS/sheetjs) — Excel export
- [pdfmake](http://pdfmake.org) — PDF export

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/your-username/pieno_dashboard.git
cd pieno_dashboard
npm install
```

### Environment Variables

Create a `.env.local` file in the root with the following:

```env
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
AUTH_SECRET=your-random-secret-at-least-32-characters
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> For production, set `NEXT_PUBLIC_APP_URL` to your deployed URL (e.g. `https://pieno.vercel.app`).

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Access on Mobile (same Wi-Fi)

```bash
npm run dev -- -H 0.0.0.0
```

Then open `http://<your-local-ip>:3000` on your phone.

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com). Connect your GitHub repository and add the environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

HTTPS is handled automatically by Vercel — no extra configuration needed.

## Project Structure

```
app/
  login/          # Login page
  api/auth/       # Login and logout API routes
  page.tsx        # Main dashboard page
  layout.tsx      # Root layout with nav
components/
  schedule-grid.tsx   # Main scheduling component
  nav.tsx             # Sidebar / mobile navigation
  theme-provider.tsx  # Dark mode context
  error-boundary.tsx  # React error boundary
lib/
  export.ts       # Excel and PDF export logic
middleware.ts     # JWT route protection
```
