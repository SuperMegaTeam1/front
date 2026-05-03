export function getLocalIsoDate(date = new Date()) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function parseIsoDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`);
}

export function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function shiftIsoDate(dateStr: string, days: number) {
  const date = parseIsoDate(dateStr);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function getWeekStart(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return toIsoDate(date);
}

export function getIsoWeekNumber(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;

  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));

  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
}
