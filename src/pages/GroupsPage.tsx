import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert, AvatarGroup, Box, Button, Card, CardActionArea, CardContent, Stack, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MemberAvatar from '../components/MemberAvatar';
import CreateGroupDialog from '../components/CreateGroupDialog';
import { selectGroups, useAppDispatch, useAppSelector } from '../store';
import { resetDemo } from '../store/groupsSlice';
import { formatMoney } from '../lib/format';

export default function GroupsPage() {
  const groups = useAppSelector(selectGroups);
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasDemo = groups.some((g) => g.id === 'demo-goa-trip');

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Split expenses. Settle up fast.</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Track shared costs with friends, see who owes whom, and clear every debt with the fewest payments.
        </Typography>
      </Box>

      <Alert severity="info" variant="outlined">
        Demo version: your data is saved in this browser only. A Node.js + Express + MySQL backend is in progress.
      </Alert>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Your groups</Typography>
        <Stack direction="row" spacing={1}>
          {!hasDemo && <Button onClick={() => dispatch(resetDemo())}>Load demo</Button>}
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>New group</Button>
        </Stack>
      </Stack>

      {groups.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No groups yet. Create one to start splitting.</Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {groups.map((group) => {
            const total = group.expenses
              .filter((e) => e.category !== 'Settlement')
              .reduce((sum, e) => sum + e.amount, 0);
            return (
              <Card key={group.id}>
                <CardActionArea component={RouterLink} to={`/groups/${group.id}`}>
                  <CardContent>
                    <Typography variant="h6">{group.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {group.members.length} members · {group.expenses.length} entries
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <AvatarGroup max={5}>
                        {group.members.map((m, i) => <MemberAvatar key={m.id} name={m.name} index={i} />)}
                      </AvatarGroup>
                      <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">Total spent</Typography>
                        <Typography fontWeight={700}>{formatMoney(total)}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      )}

      <CreateGroupDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Stack>
  );
}
