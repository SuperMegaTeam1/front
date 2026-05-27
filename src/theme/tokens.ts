const baseTokens = {
  spacingXs: '4px',
  spacingSm: '8px',
  spacingMd: '16px',
  spacingLg: '24px',
  spacingXl: '32px',
  spacing2xl: '48px',

  radiusSm: '4px',
  radiusMd: '8px',
  radiusLg: '12px',
  radiusXl: '16px',
  radiusFull: '9999px',

  transitionFast: '150ms ease',
  transitionNormal: '250ms ease',
  transitionSlow: '400ms ease',

  bpMobile: '480px',
  bpTablet: '768px',
  bpDesktop: '1024px',
  bpWide: '1280px',

  headerHeight: '73px',
  sidebarWidth: '260px',
  sidebarCollapsedWidth: '72px',
  contentMaxWidth: '1760px',
  contentPadding: '64px',
} as const;

type ThemeTokens = typeof baseTokens & {
  colorBrand: string;
  colorBrandDark: string;
  colorBrandLight: string;
  colorPrimary: string;
  colorPrimaryLight: string;
  colorPrimaryDark: string;
  colorAccentSoft: string;
  colorAccentMuted: string;
  colorAccentStrong: string;
  colorFocusRing: string;
  gradientLogin: string;
  colorSecondary: string;
  colorSuccess: string;
  colorWarning: string;
  colorError: string;
  colorInfo: string;
  colorBg: string;
  colorSurface: string;
  colorSurfaceAlt: string;
  colorTextPrimary: string;
  colorTextSecondary: string;
  colorTextLabel: string;
  colorBorder: string;
  colorBorderSoft: string;
  colorDivider: string;
  colorInputBg: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowBtn: string;
};

export const lightTokens = {
  ...baseTokens,

  colorBrand: '#2a657e',
  colorBrandDark: '#004b63',
  colorBrandLight: '#bfe8ff',
  colorPrimary: '#2a657e',
  colorPrimaryLight: '#bfe8ff',
  colorPrimaryDark: '#004b63',
  colorAccentSoft: 'rgba(191, 232, 255, 0.28)',
  colorAccentMuted: 'rgba(191, 232, 255, 0.42)',
  colorAccentStrong: 'rgba(191, 232, 255, 0.82)',
  colorFocusRing: 'rgba(42, 101, 126, 0.14)',
  gradientLogin: 'linear-gradient(135deg, #004b63 0%, #006686 100%)',

  colorSecondary: '#7c4dff',
  colorSuccess: '#2e7d32',
  colorWarning: '#f57f17',
  colorError: '#d32f2f',
  colorInfo: '#0288d1',

  colorBg: '#f8f9fa',
  colorSurface: '#ffffff',
  colorSurfaceAlt: '#f1f4f6',
  colorTextPrimary: '#2b3437',
  colorTextSecondary: '#94a3b8',
  colorTextLabel: '#586064',
  colorBorder: '#e3e9ec',
  colorBorderSoft: 'rgba(227, 233, 236, 0.4)',
  colorDivider: '#e3e9ec',
  colorInputBg: '#dbe4e7',

  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 24px rgba(43, 52, 55, 0.08)',
  shadowLg: '0 20px 40px rgba(25, 28, 30, 0.06)',
  shadowBtn: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
} satisfies ThemeTokens;

export const darkTokens = {
  ...baseTokens,

  colorBrand: '#5f90a4',
  colorBrandDark: '#4c7485',
  colorBrandLight: '#bfd3dc',
  colorPrimary: '#5f90a4',
  colorPrimaryLight: '#bfd3dc',
  colorPrimaryDark: '#4c7485',
  colorAccentSoft: 'rgba(95, 144, 164, 0.12)',
  colorAccentMuted: 'rgba(95, 144, 164, 0.18)',
  colorAccentStrong: 'rgba(95, 144, 164, 0.24)',
  colorFocusRing: 'rgba(95, 144, 164, 0.18)',
  gradientLogin: 'linear-gradient(135deg, #31434d 0%, #4c7485 100%)',

  colorSecondary: '#aa9ecf',
  colorSuccess: '#79b58a',
  colorWarning: '#d6b066',
  colorError: '#d68b8b',
  colorInfo: '#89b6c8',

  colorBg: '#11161c',
  colorSurface: '#171d24',
  colorSurfaceAlt: '#1d242c',
  colorTextPrimary: '#e6edf1',
  colorTextSecondary: '#a4b2bc',
  colorTextLabel: '#bcc8cf',
  colorBorder: '#2b353f',
  colorBorderSoft: 'rgba(164, 178, 188, 0.18)',
  colorDivider: '#27313a',
  colorInputBg: '#222a33',

  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.24)',
  shadowMd: '0 8px 24px rgba(0, 0, 0, 0.18)',
  shadowLg: '0 18px 38px rgba(0, 0, 0, 0.22)',
  shadowBtn: '0 4px 10px rgba(0, 0, 0, 0.16)',
} satisfies ThemeTokens;

export type AppThemeMode = 'light' | 'dark';

export const themeTokens = {
  light: lightTokens,
  dark: darkTokens,
} as const;

export const tokens = lightTokens;

const createCssVariables = (themeTokens: ThemeTokens) => [
  ['--color-brand', themeTokens.colorBrand],
  ['--color-brand-dark', themeTokens.colorBrandDark],
  ['--color-brand-light', themeTokens.colorBrandLight],
  ['--color-primary', themeTokens.colorPrimary],
  ['--color-primary-light', themeTokens.colorPrimaryLight],
  ['--color-primary-dark', themeTokens.colorPrimaryDark],
  ['--color-accent-soft', themeTokens.colorAccentSoft],
  ['--color-accent-muted', themeTokens.colorAccentMuted],
  ['--color-accent-strong', themeTokens.colorAccentStrong],
  ['--color-focus-ring', themeTokens.colorFocusRing],
  ['--gradient-login', themeTokens.gradientLogin],
  ['--color-secondary', themeTokens.colorSecondary],
  ['--color-success', themeTokens.colorSuccess],
  ['--color-warning', themeTokens.colorWarning],
  ['--color-error', themeTokens.colorError],
  ['--color-info', themeTokens.colorInfo],
  ['--color-bg', themeTokens.colorBg],
  ['--color-surface', themeTokens.colorSurface],
  ['--color-surface-alt', themeTokens.colorSurfaceAlt],
  ['--color-text-primary', themeTokens.colorTextPrimary],
  ['--color-text-secondary', themeTokens.colorTextSecondary],
  ['--color-text-label', themeTokens.colorTextLabel],
  ['--color-border', themeTokens.colorBorder],
  ['--color-border-soft', themeTokens.colorBorderSoft],
  ['--color-divider', themeTokens.colorDivider],
  ['--color-input-bg', themeTokens.colorInputBg],
  ['--shadow-sm', themeTokens.shadowSm],
  ['--shadow-md', themeTokens.shadowMd],
  ['--shadow-lg', themeTokens.shadowLg],
  ['--shadow-btn', themeTokens.shadowBtn],
  ['--spacing-xs', themeTokens.spacingXs],
  ['--spacing-sm', themeTokens.spacingSm],
  ['--spacing-md', themeTokens.spacingMd],
  ['--spacing-lg', themeTokens.spacingLg],
  ['--spacing-xl', themeTokens.spacingXl],
  ['--spacing-2xl', themeTokens.spacing2xl],
  ['--radius-sm', themeTokens.radiusSm],
  ['--radius-md', themeTokens.radiusMd],
  ['--radius-lg', themeTokens.radiusLg],
  ['--radius-xl', themeTokens.radiusXl],
  ['--radius-full', themeTokens.radiusFull],
  ['--transition-fast', themeTokens.transitionFast],
  ['--transition-normal', themeTokens.transitionNormal],
  ['--transition-slow', themeTokens.transitionSlow],
  ['--bp-mobile', themeTokens.bpMobile],
  ['--bp-tablet', themeTokens.bpTablet],
  ['--bp-desktop', themeTokens.bpDesktop],
  ['--bp-wide', themeTokens.bpWide],
  ['--header-height', themeTokens.headerHeight],
  ['--sidebar-width', themeTokens.sidebarWidth],
  ['--sidebar-collapsed-width', themeTokens.sidebarCollapsedWidth],
  ['--content-max-width', themeTokens.contentMaxWidth],
  ['--content-padding', themeTokens.contentPadding],
] as const;

const renderCssVariables = (selector: string, values: ReturnType<typeof createCssVariables>) => `${selector} {
${values.map(([name, value]) => `  ${name}: ${value};`).join('\n')}
}`;

export const rootCssVariables = `
${renderCssVariables(':root, :root[data-theme="light"]', createCssVariables(lightTokens))}
${renderCssVariables(':root[data-theme="dark"]', createCssVariables(darkTokens))}
`;
