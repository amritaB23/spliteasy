import type { Expense, Member, Settlement } from '../types';

// Money is rounded to 2 decimals to avoid floating point issues (0.1 + 0.2 !== 0.3).
export const roundMoney = (value: number) => Math.round(value * 100) / 100;

// Anything smaller than 1 paisa is treated as zero.
const EPSILON = 0.01;

/**
 * Step 1: work out each member's balance.
 *  - Positive balance  => the group owes them money (they paid more than their share).
 *  - Negative balance  => they owe money to the group.
 * The balances of a group always add up to 0.
 */
export function calculateBalances(members: Member[], expenses: Expense[]): Record<string, number> {
  const balances: Record<string, number> = {};
  members.forEach((m) => (balances[m.id] = 0));

  for (const expense of expenses) {
    const share = expense.amount / expense.splitBetween.length;

    // The payer gets credit for the full amount...
    balances[expense.paidBy] += expense.amount;

    // ...and everyone in the split (payer included, if they are in it) owes their share.
    for (const memberId of expense.splitBetween) {
      balances[memberId] -= share;
    }
  }

  for (const id in balances) balances[id] = roundMoney(balances[id]);
  return balances;
}

/**
 * Step 2: turn balances into a short list of payments ("settle up").
 *
 * Greedy approach:
 *  1. Split members into debtors (owe money) and creditors (are owed money).
 *  2. Sort both lists from largest to smallest amount.
 *  3. The biggest debtor pays the biggest creditor as much as possible.
 *  4. Whoever reaches zero is removed; repeat until everyone is settled.
 *
 * With n people this needs at most n - 1 payments.
 */
export function settleUp(balances: Record<string, number>): Settlement[] {
  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < -EPSILON)
    .map(([id, balance]) => ({ id, amount: -balance }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > EPSILON)
    .map(([id, balance]) => ({ id, amount: balance }))
    .sort((a, b) => b.amount - a.amount);

  const payments: Settlement[] = [];
  let d = 0;
  let c = 0;

  while (d < debtors.length && c < creditors.length) {
    const amount = Math.min(debtors[d].amount, creditors[c].amount);
    payments.push({ from: debtors[d].id, to: creditors[c].id, amount: roundMoney(amount) });

    debtors[d].amount -= amount;
    creditors[c].amount -= amount;

    if (debtors[d].amount < EPSILON) d++;
    if (creditors[c].amount < EPSILON) c++;
  }

  return payments;
}
