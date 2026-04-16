/**
 * Форматирование даты в русском формате.
 */

/** "16 апреля 2026" */
export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** "16 апр" */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  });
}

/** "Среда, 16 апреля" */
export function formatDateWithDay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Получить ISO-строку текущей даты: "2026-04-16" */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}
