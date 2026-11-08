import { Avatar, type SxProps } from '@mui/material';
import { CHART_COLORS } from '../theme';

// A coloured circle with the first letter of the member's name.
// The colour is picked from the member's position so it stays the same everywhere.
export default function MemberAvatar({ name, index, sx }: { name: string; index: number; sx?: SxProps }) {
  return (
    <Avatar sx={{ bgcolor: CHART_COLORS[index % CHART_COLORS.length], width: 36, height: 36, fontSize: 16, ...sx }}>
      {name.charAt(0).toUpperCase()}
    </Avatar>
  );
}
