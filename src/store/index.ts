import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import groupsReducer from './groupsSlice';
import { saveGroups } from '../lib/storage';

export const store = configureStore({
  reducer: {
    groups: groupsReducer,
  },
});

// Save to localStorage whenever the state changes.
store.subscribe(() => saveGroups(store.getState().groups.groups));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed versions of the hooks, so components get autocomplete and type checks.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const selectGroups = (state: RootState) => state.groups.groups;
export const selectGroupById = (id: string) => (state: RootState) =>
  state.groups.groups.find((g) => g.id === id);
