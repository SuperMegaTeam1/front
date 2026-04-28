'use client';

import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ruRU } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: {
        main: 'var(--color-brand)',
        light: 'var(--color-brand-light)',
        dark: 'var(--color-brand-dark)',
      },
      secondary: {
        main: 'var(--color-secondary)',
      },
      background: {
        default: 'var(--color-bg)',
        paper: 'var(--color-surface)',
      },
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
      },
      divider: 'var(--color-divider)',
    },
    typography: {
      fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', -apple-system, sans-serif",
      h1: { fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 800 },
      h2: { fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 800 },
      h3: { fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 },
      h4: { fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 700 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border-soft)',
          },
        },
      },
    },
  },
  ruRU
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
