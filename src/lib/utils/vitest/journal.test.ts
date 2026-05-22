import { describe, expect, it } from 'vitest';
import {
  formatJournalDisplayValue,
  getCellKey,
  getComparableJournalValue,
  getTotalPoints,
  normalizeJournalValue,
  parseJournalInput,
  sanitizeJournalValue,
} from '@/lib/utils/journal';

const ABSENT = '\u041d';

describe('journal utils', () => {
  describe('getCellKey', () => {
    it('builds a stable student/lesson key', () => {
      expect(getCellKey('student-1', 'lesson-7')).toBe('student-1:lesson-7');
    });
  });

  describe('normalizeJournalValue', () => {
    it('trims whitespace and uppercases values', () => {
      expect(normalizeJournalValue(' 42 ')).toBe('42');
    });

    it('normalizes latin N and cyrillic H into the absence marker', () => {
      expect(normalizeJournalValue('n')).toBe(ABSENT);
      expect(normalizeJournalValue(ABSENT.toLowerCase())).toBe(ABSENT);
    });
  });

  describe('sanitizeJournalValue', () => {
    it('returns an empty string for blank input', () => {
      expect(sanitizeJournalValue('')).toBe('');
      expect(sanitizeJournalValue('   ')).toBe('');
    });

    it('keeps the absence marker', () => {
      expect(sanitizeJournalValue('N')).toBe(ABSENT);
      expect(sanitizeJournalValue(ABSENT)).toBe(ABSENT);
    });

    it('keeps a valid numeric grade', () => {
      expect(sanitizeJournalValue('75')).toBe('75');
    });

    it('clamps grades above the max allowed value', () => {
      expect(sanitizeJournalValue('105')).toBe('100');
      expect(sanitizeJournalValue('999')).toBe('100');
    });

    it('extracts digits from mixed input', () => {
      expect(sanitizeJournalValue('12abc')).toBe('12');
    });

    it('returns an empty string for unsupported text', () => {
      expect(sanitizeJournalValue('abc')).toBe('');
    });
  });

  describe('formatJournalDisplayValue', () => {
    it('renders a numeric grade first', () => {
      expect(formatJournalDisplayValue(true, 88)).toBe('88');
      expect(formatJournalDisplayValue(false, 88)).toBe('88');
    });

    it('renders absence when the student did not attend', () => {
      expect(formatJournalDisplayValue(false, null)).toBe(ABSENT);
    });

    it('renders an empty string for attended without a grade', () => {
      expect(formatJournalDisplayValue(true, null)).toBe('');
      expect(formatJournalDisplayValue(null, null)).toBe('');
    });
  });

  describe('parseJournalInput', () => {
    it('treats a blank cell as attended without a grade', () => {
      expect(parseJournalInput('')).toEqual({ attended: true });
      expect(parseJournalInput('   ')).toEqual({ attended: true });
    });

    it('parses a numeric grade', () => {
      expect(parseJournalInput('45')).toEqual({ grade: 45 });
    });

    it('parses absence markers', () => {
      expect(parseJournalInput('N')).toEqual({ attended: false });
      expect(parseJournalInput(ABSENT)).toEqual({ attended: false });
    });

    it('marks unsupported text as invalid', () => {
      expect(parseJournalInput('abc')).toBe('invalid');
    });
  });

  describe('getComparableJournalValue', () => {
    it('compares blank cells as presence', () => {
      expect(getComparableJournalValue('')).toBe('attendance:present');
    });

    it('compares absence cells as absence', () => {
      expect(getComparableJournalValue(ABSENT)).toBe('attendance:absent');
    });

    it('compares numeric grades by their value', () => {
      expect(getComparableJournalValue('25')).toBe('grade:25');
    });

    it('preserves invalid values in comparison mode', () => {
      expect(getComparableJournalValue('abc')).toBe('invalid:ABC');
    });
  });

  describe('getTotalPoints', () => {
    it('sums only numeric grades', () => {
      expect(getTotalPoints(['10', ABSENT, '', '25'])).toBe(35);
    });

    it('returns zero when there are no grades', () => {
      expect(getTotalPoints(['', ABSENT, ''])).toBe(0);
    });
  });
});
