const MIN_GRADE = 0;
const MAX_GRADE = 100;

export type JournalParsedValue =
  | { grade: number }
  | { attended: true }
  | { attended: false }
  | 'invalid';

export function getCellKey(studentId: string, lessonId: string) {
  return `${studentId}:${lessonId}`;
}

export function normalizeJournalValue(value: string) {
  const normalized = value.trim().toUpperCase();

  if (normalized === 'N' || normalized === 'Н') {
    return 'Н';
  }

  return normalized;
}

export function sanitizeJournalValue(value: string) {
  const normalized = normalizeJournalValue(value);

  if (!normalized) {
    return '';
  }

  if (normalized === 'Н') {
    return 'Н';
  }

  const digitsOnly = normalized.replace(/\D/g, '');

  if (digitsOnly) {
    return String(Math.min(MAX_GRADE, Math.max(MIN_GRADE, Number(digitsOnly))));
  }

  return '';
}

export function formatJournalDisplayValue(
  isAttended: boolean | null,
  grade: number | null
) {
  if (typeof grade === 'number') {
    return String(grade);
  }

  if (isAttended === false) {
    return 'Н';
  }

  return '';
}

export function parseJournalInput(value: string): JournalParsedValue {
  const normalized = normalizeJournalValue(value);

  if (!normalized) {
    return { attended: true };
  }

  if (/^\d+$/.test(normalized)) {
    return { grade: Number(normalized) };
  }

  if (normalized === 'Н') {
    return { attended: false };
  }

  return 'invalid';
}

export function getComparableJournalValue(value: string) {
  const parsed = parseJournalInput(value);

  if (parsed === 'invalid') {
    return `invalid:${normalizeJournalValue(value)}`;
  }

  if ('grade' in parsed) {
    return `grade:${parsed.grade}`;
  }

  return parsed.attended ? 'attendance:present' : 'attendance:absent';
}

export function getTotalPoints(values: string[]) {
  return values.reduce((sum, value) => {
    const parsed = parseJournalInput(value);

    if (parsed && parsed !== 'invalid' && 'grade' in parsed) {
      return sum + parsed.grade;
    }

    return sum;
  }, 0);
}
