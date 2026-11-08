// All the data shapes used in the app live here.

export interface Member {
  id: string;
  name: string;
}

export const CATEGORIES = ['Food', 'Travel', 'Stay', 'Shopping', 'Bills', 'Other'] as const;

// 'Settlement' is used when someone pays back a friend ("Mark as paid").
export type Category = (typeof CATEGORIES)[number] | 'Settlement';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // member id of the person who paid
  splitBetween: string[]; // member ids who share this expense equally
  category: Category;
  date: string; // YYYY-MM-DD
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
}

// One suggested payment: "from" pays "to" this amount.
export interface Settlement {
  from: string;
  to: string;
  amount: number;
}
