import type { Group } from '../types';

// A sample group so first-time visitors (and recruiters!) see the app working immediately.
export function createDemoGroup(): Group {
  const all = ['m1', 'm2', 'm3', 'm4'];
  return {
    id: 'demo-goa-trip',
    name: 'Goa Trip',
    createdAt: '2026-11-01',
    members: [
      { id: 'm1', name: 'Amrita' },
      { id: 'm2', name: 'Priya' },
      { id: 'm3', name: 'Rahul' },
      { id: 'm4', name: 'Sneha' },
    ],
    expenses: [
      { id: 'e1', description: 'Beach resort (2 nights)', amount: 12000, paidBy: 'm2', splitBetween: all, category: 'Stay', date: '2026-11-01' },
      { id: 'e2', description: 'Airport cab', amount: 1800, paidBy: 'm1', splitBetween: all, category: 'Travel', date: '2026-11-01' },
      { id: 'e3', description: 'Seafood dinner', amount: 3200, paidBy: 'm3', splitBetween: all, category: 'Food', date: '2026-11-01' },
      { id: 'e4', description: 'Scuba diving', amount: 6000, paidBy: 'm4', splitBetween: ['m2', 'm3', 'm4'], category: 'Other', date: '2026-11-02' },
      { id: 'e5', description: 'Souvenirs', amount: 950, paidBy: 'm1', splitBetween: ['m1', 'm2'], category: 'Shopping', date: '2026-11-02' },
      { id: 'e6', description: 'Breakfast cafe', amount: 1400, paidBy: 'm3', splitBetween: all, category: 'Food', date: '2026-11-03' },
    ],
  };
}
