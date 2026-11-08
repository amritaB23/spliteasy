import {
  Avatar, Card, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CategoryIcon from './CategoryIcon';
import { useAppDispatch } from '../store';
import { deleteExpense } from '../store/groupsSlice';
import { formatDate, formatMoney } from '../lib/format';
import type { Group } from '../types';

export default function ExpenseList({ group }: { group: Group }) {
  const dispatch = useAppDispatch();
  const nameOf = (id: string) => group.members.find((m) => m.id === id)?.name ?? 'Unknown';

  if (group.expenses.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No expenses yet. Click "Add expense" to get started.</Typography>
      </Card>
    );
  }

  return (
    <Card>
      <List disablePadding>
        {group.expenses.map((expense, index) => {
          const isSettlement = expense.category === 'Settlement';
          const secondary = isSettlement
            ? `${formatDate(expense.date)} · payment`
            : `Paid by ${nameOf(expense.paidBy)} · split ${expense.splitBetween.length} ways · ${formatDate(expense.date)}`;

          return (
            <ListItem key={expense.id} divider={index < group.expenses.length - 1}
              secondaryAction={
                <Tooltip title="Delete">
                  <IconButton edge="end" aria-label={`Delete ${expense.description}`}
                    onClick={() => dispatch(deleteExpense({ groupId: group.id, expenseId: expense.id }))}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              }>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: isSettlement ? 'success.light' : 'primary.light' }}>
                  <CategoryIcon category={expense.category} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={expense.description}
                secondary={secondary}
                sx={{ pr: 12 }}
              />
              <Typography fontWeight={600} sx={{ position: 'absolute', right: 64 }}>
                {formatMoney(expense.amount)}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}
