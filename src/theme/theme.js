// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

export const colors = {
  background: '#f3f5f7',
  dark: '#1a1e24',
  primary: '#0c2b29',
  gold: '#c5a56c',
};

export const getTheme = (mode = 'light') => {
  return createTheme({
    direction: 'rtl',
    palette: {
      mode,
      primary: {
        main: colors.primary,
        light: '#1a3f3a',
        dark: '#051715',
      },
      secondary: {
        main: colors.gold,
        light: '#d4b88c',
        dark: '#a88954',
      },
      background: {
        default: colors.background,
        paper: '#ffffff',
      },
      text: {
        primary: colors.dark,
      },
    },
    typography: {
      fontFamily: 'Veno, Roboto, Arial, sans-serif',
      // Veno renders thin at 400, so the default ("regular") weight is set to
      // DemiBold (600) for more substantial body text across the site.
      fontWeightLight: 400,
      fontWeightRegular: 600,
      fontWeightMedium: 700,
      fontWeightBold: 800,
      // Designed at 75% browser zoom — set htmlFontSize to 12px (75% of 16px)
      // This scales all MUI rem-based spacing and typography proportionally
      htmlFontSize: 13,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.background,
          },
        },
      },
    },
  });
};