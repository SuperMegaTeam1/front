export type RelativeDayKind = 'today' | 'yesterday' | 'other';

/** Локальный ключ даты в формате YYYY-MM-DD (без UTC-сдвига). */
export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Относительный «возраст» даты: сегодня / вчера / прочее. */
export function getRelativeDayKind(date: Date, now: Date = new Date()): RelativeDayKind {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const key = getLocalDateKey(date);

  if (key === getLocalDateKey(now)) {
    return 'today';
  }

  if (key === getLocalDateKey(yesterday)) {
    return 'yesterday';
  }

  return 'other';
}

const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

/** Время в формате ЧЧ:ММ. */
export function formatTimeHM(date: Date): string {
  return timeFormatter.format(date);
}
