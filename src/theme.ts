import { createTheme } from '@mui/material/styles';

// One place for colours, fonts and shapes - every MUI component uses this theme.
export const theme = createTheme({
  palette: {
    primary: { main: '#0f766e' }, // teal
    secondary: { main: '#f59e0b' }, // amber
    success: { main: '#16a34a' },
    error: { main: '#dc2626' },
    background: { default: '#f6f8f7', paper: '#ffffff' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: '1px solid #e5e7eb' } },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
  },
});

// Colours used for member avatars and chart slices.
export const CHART_COLORS = ['#0f766e', '#f59e0b', '#6366f1', '#ec4899', '#0ea5e9', '#84cc16', '#a855f7'];
