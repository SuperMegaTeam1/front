'use client';

import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ruRU } from '@mui/material/locale';

/**
 * MUI-тема проекта.
 *
 * ВАЖНО: значения здесь должны ПО ЗНАЧЕНИЯМ совпадать с `src/styles/_variables.scss`.
 * Если меняешь цвет — правь оба места. Иначе SCSS-блоки и MUI-компоненты
 * разойдутся по оттенку.
 */
// TODO: Не стоит дублировать токены и в MUI, и в SCSS: цвета/радиусы разъедутся.
//  Как вариант, можно вынести токены в CSS variables и читать их и в theme, и в SCSS.
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
      divider: '#e3e9ec',
    },
    typography: {
      // Основной шрифт — IBM Plex Sans (тело, инпуты, подписи)
      fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', -apple-system, sans-serif",
      // Заголовки — Manrope
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
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid rgba(227,233,236,0.4)',
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
