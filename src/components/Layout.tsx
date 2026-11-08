import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Box, Container, Link, Toolbar, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar>
          <Link component={RouterLink} to="/" underline="none" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptLongIcon color="primary" />
            <Typography variant="h6" color="text.primary">
              Split<Box component="span" sx={{ color: 'primary.main' }}>Easy</Box>
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 }, flex: 1 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: 'center', color: 'text.secondary', fontSize: 14 }}>
        Built by Amrita Bera with React, TypeScript, Redux Toolkit and Material UI
      </Box>
    </Box>
  );
}
