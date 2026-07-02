'use client';

import { Box } from '@mui/material';

export default function PageWrapper({ children }) {
  return (
    <Box sx={{ width: '100%' }}>
      {children}
    </Box>
  );
}