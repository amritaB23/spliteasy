import { useMemo } from 'react';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MemberAvatar from './MemberAvatar';
import { useAppDispatch } from '../store';
import { addExpense } from '../store/groupsSlice';
import { calculateBalances, settleUp } from '../lib/settle';
import { formatMoney, todayISO } from '../lib/format';
import type { Group, Settlement } from '../types';

export default function BalancesPanel({ group }: { group: Group }) {
  const dispatch = useAppDispatch();

  // useMemo: only recalculate when the group's members or expenses change.
  const balances = useMemo(() => calculateBalances(group.members, group.expenses), [group.members, group.expenses]);
  const payments = useMemo(() => settleUp(balances), [balances]);

  const indexOf = (id: string) => group.members.findIndex((m) => m.id === id);
  const nameOf = (id: string) => group.members[indexOf(id)]?.name ?? 'Unknown';

  // Recording a payment is just an expense: the debtor "pays" an amount that only the creditor shares.
  // That moves both balances towards zero, so no special logic is needed.
  const markAsPaid = (payment: Settlement) =>
    dispatch(addExpense(group.id, {
      description: `${nameOf(payment.from)} paid ${nameOf(payment.to)}`,
      amount: payment.amount,
      paidBy: payment.from,
      splitBetween: [payment.to],
      category: 'Settlement',
      date: todayISO(),
    }));

  return (
    <Stack spacing={3}>
      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Balances</Typography>
        <Stack spacing={1.5}>
          {group.members.map((member, index) => {
            const balance = balances[member.id] ?? 0;
            const color = balance > 0 ? 'success.main' : balance < 0 ? 'error.main' : 'text.secondary';
            const label = balance > 0 ? 'gets back' : balance < 0 ? 'owes' : 'settled up';
            return (
              <Stack key={member.id} direction="row" alignItems="center" spacing={1.5}>
                <MemberAvatar name={member.name} index={index} />
                <Typography sx={{ flex: 1 }}>{member.name}</Typography>
                <Box textAlign="right">
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography fontWeight={600} color={color}>{formatMoney(Math.abs(balance))}</Typography>
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6">Settle up</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The fewest payments needed to clear all debts.
        </Typography>

        {payments.length === 0 ? (
          <Stack direction="row" alignItems="center" spacing={1} color="success.main">
            <CheckCircleIcon />
            <Typography>Everyone is settled up.</Typography>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {payments.map((p) => (
              <Stack key={`${p.from}-${p.to}`} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}
                spacing={1.5} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                  <MemberAvatar name={nameOf(p.from)} index={indexOf(p.from)} sx={{ width: 30, height: 30, fontSize: 14 }} />
                  <Typography fontWeight={500}>{nameOf(p.from)}</Typography>
                  <ArrowForwardIcon fontSize="small" color="action" />
                  <MemberAvatar name={nameOf(p.to)} index={indexOf(p.to)} sx={{ width: 30, height: 30, fontSize: 14 }} />
                  <Typography fontWeight={500}>{nameOf(p.to)}</Typography>
                </Stack>
                <Typography fontWeight={700}>{formatMoney(p.amount)}</Typography>
                <Button size="small" variant="outlined" onClick={() => markAsPaid(p)}>Mark as paid</Button>
              </Stack>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
}
