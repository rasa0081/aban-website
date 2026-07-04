'use client';

import { Box } from '@mui/material';
import { colors } from '../theme/theme';

export default function Loading() {
  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      bgcolor: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{
        position: 'absolute', inset: 0,
        background: 'url("/pattern.webp")',
        backgroundSize: '1200px 1200px',
        opacity: 0.04,
        pointerEvents: 'none',
      }} />
      <Box
        component="img"
        src="/Loading.gif"
        alt="loading"
        sx={{
          width: { xs: '70vw', md: '45vw' },
          height: { xs: '70vw', md: '45vw' },
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}