# SplitEasy

**Split shared expenses with friends and settle up with the fewest payments.**

Live demo: _add your Vercel link here_

## What it does

1. **Create a group** for a trip, flat or event and add the members.
2. **Add expenses**: what it was for, how much, who paid, and who shares it.
3. **See balances**: who gets money back and who owes.
4. **Settle up**: the app suggests the fewest payments needed to clear every debt. Click "Mark as paid" when someone pays.
5. **Insights**: charts of spending by category and who paid how much.

A demo group ("Goa Trip") loads on the first visit so you can try it immediately.

## Tech stack

| Area | Technology |
|---|---|
| UI | React 18, TypeScript, Material UI |
| State | Redux Toolkit (slice + typed hooks) |
| Routing | React Router v6 |
| Charts | Recharts |
| Testing | Vitest (unit tests for the money logic) |
| Build / hosting | Vite, Vercel |

## How the settle-up works

All the money logic is in [`src/lib/settle.ts`](src/lib/settle.ts) as pure functions, so it is easy to test.

1. **Balances**: for every expense, the payer gets `+amount` and each person in the split gets `-share`.
   A positive balance means "gets money back"; a negative one means "owes". All balances add up to zero.
2. **Fewest payments (greedy)**: sort the people who owe and the people who are owed from largest to smallest.
   The biggest debtor pays the biggest creditor as much as possible; whoever reaches zero drops out. Repeat.
   With `n` people this needs at most `n - 1` payments.
3. **Mark as paid** is saved as a special expense ("Settlement") paid by the debtor and shared only by the creditor,
   so the same balance formula handles it with no extra logic.

## Project structure

```
src/
  types.ts              Data shapes: Group, Member, Expense, Settlement
  lib/
    settle.ts           Balance + settle-up logic (pure functions)
    settle.test.ts      Unit tests for the logic
    format.ts           Money and date formatting (en-IN, ₹)
    storage.ts          Save/load to localStorage
    demoData.ts         Sample "Goa Trip" group
  store/
    groupsSlice.ts      Redux Toolkit slice: create group, add expense, ...
    index.ts            Store setup, typed hooks, selectors
  pages/
    GroupsPage.tsx      List of groups
    GroupPage.tsx       One group: expenses, balances, insights tabs
  components/           Dialogs, lists, charts, avatars, layout
```

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # run unit tests
npm run build      # production build
```

## Roadmap

- [x] v1: React front end, Redux Toolkit state, settle-up algorithm, charts, unit tests
- [ ] v2: Node.js + Express + PostgreSQL REST API with JWT login (data saved on the server)
- [ ] Unequal splits (exact amounts / percentages)
- [ ] Playwright end-to-end test and GitHub Actions CI

## Author

**Amrita Bera** · Front-End / Full-Stack Developer · [LinkedIn](https://www.linkedin.com/in/amrita-bera-952993245)
