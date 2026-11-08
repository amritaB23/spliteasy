import { useEffect, useState } from 'react';
import {
  Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup,
  FormLabel, InputAdornment, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { useAppDispatch } from '../store';
import { addExpense } from '../store/groupsSlice';
import { CATEGORIES, type Category, type Group } from '../types';
import { formatMoney, todayISO } from '../lib/format';

interface Props {
  group: Group;
  open: boolean;
  onClose: () => void;
}

export default function AddExpenseDialog({ group, open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const allIds = group.members.map((m) => m.id);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(allIds[0] ?? '');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(todayISO());
  const [splitBetween, setSplitBetween] = useState<string[]>(allIds);
  const [error, setError] = useState('');

  // Reset the form every time the dialog opens.
  useEffect(() => {
    if (open) {
      setDescription('');
      setAmount('');
      setPaidBy(allIds[0] ?? '');
      setCategory('Food');
      setDate(todayISO());
      setSplitBetween(allIds);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleMember = (id: string) =>
    setSplitBetween((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const amountNumber = Number(amount);
  const share = splitBetween.length > 0 && amountNumber > 0 ? amountNumber / splitBetween.length : 0;

  const handleSubmit = () => {
    if (!description.trim()) return setError('Please enter a description');
    if (!(amountNumber > 0)) return setError('Amount must be more than 0');
    if (splitBetween.length === 0) return setError('Select at least one person to split with');

    dispatch(
      addExpense(group.id, {
        description: description.trim(),
        amount: Math.round(amountNumber * 100) / 100,
        paidBy,
        splitBetween,
        category,
        date,
      }),
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add expense</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Description" placeholder="e.g. Dinner" value={description}
            onChange={(e) => setDescription(e.target.value)} autoFocus />

          <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> },
              htmlInput: { min: 0, step: '0.01' },
            }} />

          <Stack direction="row" spacing={2}>
            <TextField select label="Paid by" value={paidBy} onChange={(e) => setPaidBy(e.target.value)} fullWidth>
              {group.members.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
            </TextField>
            <TextField select label="Category" value={category}
              onChange={(e) => setCategory(e.target.value as Category)} fullWidth>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Stack>

          <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }} />

          <div>
            <FormLabel>Split equally between</FormLabel>
            <FormGroup row>
              {group.members.map((m) => (
                <FormControlLabel key={m.id} label={m.name}
                  control={<Checkbox checked={splitBetween.includes(m.id)} onChange={() => toggleMember(m.id)} />} />
              ))}
            </FormGroup>
            {share > 0 && (
              <Typography variant="body2" color="text.secondary">
                {formatMoney(share)} per person
              </Typography>
            )}
          </div>

          {error && <Typography color="error" variant="body2">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save expense</Button>
      </DialogActions>
    </Dialog>
  );
}
