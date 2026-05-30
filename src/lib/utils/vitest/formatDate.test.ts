import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatDateCompact,
  formatDateFull,
  formatDateShort,
  formatDateWithDay,
  getTodayISO,
  getWeekDay,
  getWeekDayAfterNa,
} from '@/lib/utils/formatDate';

describe('formatDate utils', () => {
  describe('formatDateFull', () => {
    it('formats a date in the full russian format', () => {
      expect(formatDateFull('2026-04-16')).toBe('16 апреля 2026 г.');
    });
  });

  describe('formatDateShort', () => {
    it('formats a date in the short russian format', () => {
      expect(formatDateShort('2026-04-16')).toBe('16 апр.');
    });
  });

  describe('formatDateCompact', () => {
    it('formats a date in the compact dd.mm format', () => {
      expect(formatDateCompact('2026-04-16')).toBe('16.04');
    });
  });

  describe('formatDateWithDay', () => {
    it('includes the weekday in the formatted date', () => {
      expect(formatDateWithDay('2026-04-16')).toBe('четверг, 16 апреля');
    });
  });

  describe('getWeekDay', () => {
    it('returns the weekday with an uppercase first letter', () => {
      expect(getWeekDay('2026-04-16')).toBe('Четверг');
    });
  });

  describe('getWeekDayAfterNa', () => {
    it('uses the correct form for feminine weekdays', () => {
      expect(getWeekDayAfterNa('2026-01-07')).toBe('Среду');
      expect(getWeekDayAfterNa('2026-01-09')).toBe('Пятницу');
      expect(getWeekDayAfterNa('2026-01-10')).toBe('Субботу');
    });

    it('keeps the original form for weekdays that do not change', () => {
      expect(getWeekDayAfterNa('2026-01-05')).toBe('Понедельник');
      expect(getWeekDayAfterNa('2026-01-08')).toBe('Четверг');
    });
  });

  describe('getTodayISO', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns the current date in ISO format', () => {
      vi.setSystemTime(new Date('2026-05-22T09:15:00Z'));

      expect(getTodayISO()).toBe('2026-05-22');
    });
  });
});
