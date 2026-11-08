import { describe, expect, it } from 'vitest';
import { calculateBalances, settleUp } from './settle';
import type { Expense, Member } from '../types';

const members: Member[] = [
  { id: 'a', name: 'Amrita' },
  { id: 'b', name: 'Priya' },
  { id: 'c', name: 'Rahul' },
];

// Small helper so each test only writes the fields it cares about.
const expense = (amount: number, paidBy: string, splitBetween: string[]): Expense => ({
  id: Math.random().toString(),
  description: 'test',
  amount,
  paidBy,
  splitBetween,
  category: 'Food',
  date: '2026-11-08',
});

describe('calculateBalances', () => {
  it('gives the payer credit and charges everyone their share', () => {
    const balances = calculateBalances(members, [expense(300, 'a', ['a', 'b', 'c'])]);
    expect(balances).toEqual({ a: 200, b: -100, c: -100 });
  });

  it('always adds up to zero', () => {
    const balances = calculateBalances(members, [
      expense(100, 'a', ['a', 'b', 'c']), // 33.33 each - not a round number
      expense(55.5, 'b', ['a', 'c']),
    ]);
    const total = Object.values(balances).reduce((sum, b) => sum + b, 0);
    expect(Math.abs(total)).toBeLessThan(0.02);
  });

  it('returns zero for everyone when there are no expenses', () => {
    expect(calculateBalances(members, [])).toEqual({ a: 0, b: 0, c: 0 });
  });
});

describe('settleUp', () => {
  it('suggests who pays whom', () => {
    const payments = settleUp({ a: 200, b: -100, c: -100 });
    expect(payments).toEqual([
      { from: 'b', to: 'a', amount: 100 },
      { from: 'c', to: 'a', amount: 100 },
    ]);
  });

  it('needs no payments when everyone is settled', () => {
    expect(settleUp({ a: 0, b: 0, c: 0 })).toEqual([]);
  });

  it('uses at most n - 1 payments', () => {
    const balances = { a: 500, b: -150, c: -250, d: 300, e: -400 };
    expect(settleUp(balances).length).toBeLessThanOrEqual(4);
  });
});
