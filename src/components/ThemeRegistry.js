'use client';

import * as React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';
import { SidebarProvider } from '../contexts/SidebarContext';
import { getTheme } from '../theme/theme';
import { CacheProvider } from '@emotion/react';
import { createEmotionCache } from '../lib/emotionCache';

const emotionCache = createEmotionCache();

export default function ThemeRegistry({ children }) {
  const theme = getTheme('light');

  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <CustomThemeProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </CustomThemeProvider>
      </MuiThemeProvider>
    </CacheProvider>
  );
}