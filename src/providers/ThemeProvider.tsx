'use client';

import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ruRU } from '@mui/material/locale';

/** Кастомная MUI-тема проекта */
const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#5ea9d8',
        light: '#c9e7fb',
        dark: '#35708a',
      },
      secondary: {
        main: '#7c4dff',
      },
      text: {
        primary: '#2f383c',
        secondary: '#8fa1b3',
      },
      divider: '#dde6ed',
      background: {
        default: '#fbfdfe',
        paper: '#fafcfd',
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', // Без CAPS
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
          },
        },
      },
    },
  },
  ruRU // Русская локализация MUI (подписи, пагинация и т.д.)
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
