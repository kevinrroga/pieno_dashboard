'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type EmployeeStat = {
  name: string;
  role: string;
  total_hours: number;
};

const ROLE_COLOR: Record<string, string> = {
  cook:   '#1d4ed8',
  waiter: '#0891b2',
};

export default function HoursChart({ data }: { data: EmployeeStat[] }) {
  const chartData = data
    .filter((e) => Number(e.total_hours) > 0)
    .map((e) => ({ name: e.name.split(' ')[0], hours: Number(e.total_hours), role: e.role }));

  if (chartData.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No scheduled shifts this week.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} unit="h" />
        <Tooltip
          formatter={(value) => [typeof value === 'number' ? `${value.toFixed(1)}h` : value, 'Hours']}
          cursor={{ fill: '#f3f4f6' }}
        />
        <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={ROLE_COLOR[entry.role] ?? '#6b7280'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
