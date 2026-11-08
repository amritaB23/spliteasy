import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { Expense, Group } from '../types';
import { loadGroups } from '../lib/storage';
import { createDemoGroup } from '../lib/demoData';

interface GroupsState {
  groups: Group[];
}

// Load saved data; first-time visitors get the demo group.
const initialState: GroupsState = {
  groups: loadGroups() ?? [createDemoGroup()],
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    // "prepare" builds the full payload (ids, dates) so the reducer stays simple.
    createGroup: {
      prepare: (name: string, memberNames: string[]) => ({
        payload: {
          id: nanoid(),
          name,
          members: memberNames.map((memberName) => ({ id: nanoid(), name: memberName })),
          expenses: [],
          createdAt: new Date().toISOString().slice(0, 10),
        } satisfies Group,
      }),
      reducer: (state, action: PayloadAction<Group>) => {
        state.groups.unshift(action.payload);
      },
    },

    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
    },

    addMember: (state, action: PayloadAction<{ groupId: string; name: string }>) => {
      const group = state.groups.find((g) => g.id === action.payload.groupId);
      group?.members.push({ id: nanoid(), name: action.payload.name });
    },

    addExpense: {
      prepare: (groupId: string, expense: Omit<Expense, 'id'>) => ({
        payload: { groupId, expense: { ...expense, id: nanoid() } },
      }),
      reducer: (state, action: PayloadAction<{ groupId: string; expense: Expense }>) => {
        const group = state.groups.find((g) => g.id === action.payload.groupId);
        // Redux Toolkit uses Immer, so "mutating" here is safe - it creates a new state.
        group?.expenses.unshift(action.payload.expense);
      },
    },

    deleteExpense: (state, action: PayloadAction<{ groupId: string; expenseId: string }>) => {
      const group = state.groups.find((g) => g.id === action.payload.groupId);
      if (group) group.expenses = group.expenses.filter((e) => e.id !== action.payload.expenseId);
    },

    resetDemo: (state) => {
      state.groups = [createDemoGroup(), ...state.groups.filter((g) => g.id !== 'demo-goa-trip')];
    },
  },
});

export const { createGroup, deleteGroup, addMember, addExpense, deleteExpense, resetDemo } = groupsSlice.actions;
export default groupsSlice.reducer;
