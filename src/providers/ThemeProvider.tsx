'use client';

import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ruRU } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#2a657e',
        light: '#bfe8ff',
        dark: '#004b63',
      },
      secondary: {
        main: '#7c4dff',
      },
      background: {
        default: '#f8f9fa',
        paper: '#ffffff',
      },
      text: {
        primary: '#2b3437',
        secondary: '#94a3b8',
      },
    },
    typography: {
      fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      h1: { fontFamily: "'Manrope', sans-serif", fontWeight: 800 },
      h2: { fontFamily: "'Manrope', sans-serif", fontWeight: 800 },
      h3: { fontFamily: "'Manrope', sans-serif", fontWeight: 700 },
      h4: { fontFamily: "'Manrope', sans-serif", fontWeight: 600 },
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
            fontFamily: "'IBM Plex Sans', sans-serif",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid rgba(227,233,236,0.4)',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'filled' },
        styleOverrides: {
          root: {
            '& .MuiFilledInput-root': {
              backgroundColor: '#dbe4e7',
              borderRadius: '4px 4px 0 0',
              '&:hover': { backgroundColor: '#cfd8dc' },
              '&.Mui-focused': { backgroundColor: '#dbe4e7' },
            },
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
