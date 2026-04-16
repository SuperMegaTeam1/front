'use client';

import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

/**
 * Обёртка всех клиентских провайдеров.
 * Подключается один раз в корневом layout.tsx.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
