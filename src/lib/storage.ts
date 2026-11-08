import type { Group } from '../types';

// v1 stores data in the browser (localStorage).
// v2 will replace these two functions with calls to the Node.js + Express API.
const STORAGE_KEY = 'spliteasy:groups';

export function loadGroups(): Group[] | undefined {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Group[]) : undefined;
  } catch {
    return undefined; // storage blocked or data corrupted - start fresh
  }
}

export function saveGroups(groups: Group[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
  } catch {
    // ignore - the app still works, it just won't remember data
  }
}
