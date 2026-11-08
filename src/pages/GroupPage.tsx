import { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, Card, Chip, Dialog, DialogActions, DialogTitle, IconButton, Stack, Tab, Tabs, TextField,
  Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddExpenseDialog from '../components/AddExpenseDialog';
import ExpenseList from '../components/ExpenseList';
import BalancesPanel from '../components/BalancesPanel';
import InsightsPanel from '../components/InsightsPanel';
import MemberAvatar from '../components/MemberAvatar';
import { selectGroupById, useAppDispatch, useAppSelector } from '../store';
import { addMember, deleteGroup } from '../store/groupsSlice';
import { formatMoney } from '../lib/format';

type TabName = 'expenses' | 'balances' | 'insights';

export default function GroupPage() {
  const { groupId = '' } = useParams();
  const group = useAppSelector(selectGroupById(groupId));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [tab, setTab] = useState<TabName>('expenses');
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newMember, setNewMember] = useState('');

  if (!group) return <Navigate to="/" replace />;

  const spending = group.expenses.filter((e) => e.category !== 'Settlement');
  const total = spending.reduce((sum, e) => sum + e.amount, 0);

  const stats = [
    { label: 'Total spent', value: formatMoney(total) },
    { label: 'Expenses', value: String(spending.length) },
    { label: 'Per person', value: formatMoney(total / group.members.length) },
  ];

  const handleAddMember = () => {
    const name = newMember.trim();
    if (!name || group.members.some((m) => m.name.toLowerCase() === name.toLowerCase())) return;
    dispatch(addMember({ groupId: group.id, name }));
    setNewMember('');
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 1, ml: -1 }}>All groups</Button>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Typography variant="h4">{group.name}</Typography>
          <Tooltip title="Delete group">
            <IconButton aria-label="Delete group" onClick={() => setConfirmDelete(true)}><DeleteOutlineIcon /></IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center" sx={{ mt: 1.5 }}>
          {group.members.map((m, i) => (
            <Chip key={m.id} label={m.name} avatar={<MemberAvatar name={m.name} index={i} />} variant="outlined" />
          ))}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <TextField size="small" placeholder="Add member" value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddMember()} sx={{ width: 140 }} />
            <IconButton aria-label="Add member" onClick={handleAddMember} color="primary"><PersonAddAlt1Icon /></IconButton>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ display: 'grid', gap: { xs: 1, sm: 2 }, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {stats.map((s) => (
          <Card key={s.label} sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12, sm: 14 } }}>{s.label}</Typography>
            <Typography variant="h5" sx={{ fontSize: { xs: 16, sm: 24 } }}>{s.value}</Typography>
          </Card>
        ))}
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, value: TabName) => setTab(value)} variant="scrollable">
          <Tab label="Expenses" value="expenses" />
          <Tab label="Balances" value="balances" />
          <Tab label="Insights" value="insights" />
        </Tabs>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExpenseOpen(true)}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
          Add expense
        </Button>
      </Stack>

      {/* On phones the button sits below the tabs so it never gets squeezed. */}
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setExpenseOpen(true)}
        sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        Add expense
      </Button>

      {tab === 'expenses' && <ExpenseList group={group} />}
      {tab === 'balances' && <BalancesPanel group={group} />}
      {tab === 'insights' && <InsightsPanel group={group} />}

      <AddExpenseDialog group={group} open={expenseOpen} onClose={() => setExpenseOpen(false)} />

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Delete "{group.name}" and all its expenses?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained"
            onClick={() => { dispatch(deleteGroup(group.id)); navigate('/'); }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
