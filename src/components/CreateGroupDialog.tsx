import { useState } from 'react';
import {
  Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography,
} from '@mui/material';
import { useAppDispatch } from '../store';
import { createGroup } from '../store/groupsSlice';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateGroupDialog({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [error, setError] = useState('');

  const addMember = () => {
    const trimmed = memberInput.trim();
    if (!trimmed) return;
    if (members.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
      setError(`${trimmed} is already in the group`);
      return;
    }
    setMembers([...members, trimmed]);
    setMemberInput('');
    setError('');
  };

  const handleClose = () => {
    setName('');
    setMemberInput('');
    setMembers([]);
    setError('');
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) return setError('Please enter a group name');
    if (members.length < 2) return setError('Add at least 2 members');
    dispatch(createGroup(name.trim(), members));
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>New group</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Group name"
            placeholder="e.g. Flatmates, Goa Trip"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <Stack direction="row" spacing={1}>
            <TextField
              label="Member name"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMember();
                }
              }}
              fullWidth
            />
            <Button variant="outlined" onClick={addMember}>Add</Button>
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {members.map((m) => (
              <Chip key={m} label={m} onDelete={() => setMembers(members.filter((x) => x !== m))} />
            ))}
            {members.length === 0 && (
              <Typography variant="body2" color="text.secondary">Add yourself and your friends.</Typography>
            )}
          </Stack>

          {error && <Typography color="error" variant="body2">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Create group</Button>
      </DialogActions>
    </Dialog>
  );
}
