import type { Metadata } from 'next';
import { Manrope, IBM_Plex_Sans } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import './globals.scss';
import { Providers } from '@/providers/Providers';

// Шрифты из Figma подключены через next/font:
// — Next скачает их на этапе сборки, захостит локально (self-hosted),
//   свяжет имя с CSS-переменной, чтобы её можно было использовать в MUI-теме и SCSS.
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Мой ИВМиИТ',
  description: 'Цифровой кабинет студента и преподавателя ИВМиИТ КФУ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${ibmPlexSans.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
