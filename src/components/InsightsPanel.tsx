import { useMemo } from 'react';
import { Box, Card, Typography } from '@mui/material';
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { CHART_COLORS } from '../theme';
import { formatMoney } from '../lib/format';
import type { Group } from '../types';

export default function InsightsPanel({ group }: { group: Group }) {
  // Payments between friends are not "spending", so leave them out of the charts.
  const spending = useMemo(() => group.expenses.filter((e) => e.category !== 'Settlement'), [group.expenses]);

  // Total per category, e.g. [{ name: 'Food', value: 4600 }, ...]
  const byCategory = useMemo(() => {
    const totals: Record<string, number> = {};
    spending.forEach((e) => (totals[e.category] = (totals[e.category] ?? 0) + e.amount));
    return Object.entries(totals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [spending]);

  // How much each member paid out of their own pocket.
  const byMember = useMemo(
    () => group.members.map((m) => ({
      name: m.name,
      paid: spending.filter((e) => e.paidBy === m.id).reduce((sum, e) => sum + e.amount, 0),
    })),
    [group.members, spending],
  );

  if (spending.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Add some expenses to see insights.</Typography>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6">Spending by category</Typography>
        <Box sx={{ height: 280 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                {byCategory.map((entry, i) => <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => formatMoney(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6">Who paid how much</Typography>
        <Box sx={{ height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={byMember} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis tickFormatter={(v: number) => `₹${v / 1000}k`} tickLine={false} axisLine={false} width={48} />
              <Tooltip formatter={(value: number) => formatMoney(value)} />
              <Bar dataKey="paid" name="Paid" radius={[6, 6, 0, 0]}>
                {byMember.map((entry, i) => <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
}
