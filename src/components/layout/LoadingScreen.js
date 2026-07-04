'use client';

import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { colors } from '../../theme/theme';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const removeTimer = setTimeout(() => setVisible(false), 2700);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, []);

  if (!visible) return null;

  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      bgcolor: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
      pointerEvents: fading ? 'none' : 'all',
    }}>
      <Box sx={{
        position: 'absolute',
        inset: 0,
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