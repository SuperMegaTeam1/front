'use client';

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ruRU } from '@mui/material/locale';
import { AppThemeMode, themeTokens } from '@/theme/tokens';

const THEME_STORAGE_KEY = 'theme-mode';
const THEME_CHANGE_EVENT = 'theme-mode-change';

type ThemeModeContextValue = {
  mode: AppThemeMode;
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const isThemeMode = (value: string | undefined): value is AppThemeMode => value === 'light' || value === 'dark';

const readThemeMode = (): AppThemeMode => {
  if (typeof document !== 'undefined') {
    const documentTheme = document.documentElement.dataset.theme;

    if (isThemeMode(documentTheme)) {
      return documentTheme;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme === 'dark') {
        return 'dark';
      }
    } catch {
      // Ignore storage access errors and fall back to light mode.
    }
  }

  return 'light';
};

const subscribeToThemeMode = (onStoreChange: () => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleThemeChange = () => {
    onStoreChange();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.removeEventListener('storage', handleStorage);
  };
};

const setThemeMode = (mode: AppThemeMode) => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = mode;
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // Ignore storage access errors and keep the in-memory theme update.
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }
};

const getServerThemeMode = (): AppThemeMode => 'light';

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeProvider');
  }

  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore<AppThemeMode>(subscribeToThemeMode, readThemeMode, getServerThemeMode);

  const toggleMode = () => {
    const nextMode: AppThemeMode = mode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  const currentTokens = themeTokens[mode];

  const theme = useMemo(
    () =>
      createTheme(
        {
          palette: {
            mode,
            primary: {
              main: currentTokens.colorBrand,
              light: currentTokens.colorBrandLight,
              dark: currentTokens.colorBrandDark,
            },
            secondary: {
              main: currentTokens.colorSecondary,
            },
            success: {
              main: currentTokens.colorSuccess,
            },
            warning: {
              main: currentTokens.colorWarning,
            },
            error: {
              main: currentTokens.colorError,
            },
            info: {
              main: currentTokens.colorInfo,
            },
            background: {
              default: currentTokens.colorBg,
              paper: currentTokens.colorSurface,
            },
            text: {
              primary: currentTokens.colorTextPrimary,
              secondary: currentTokens.colorTextSecondary,
            },
            divider: currentTokens.colorDivider,
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
      ),
    [currentTokens, mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}
