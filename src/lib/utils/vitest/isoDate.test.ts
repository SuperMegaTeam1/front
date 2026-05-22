import { describe, expect, it } from 'vitest';
import {
  getIsoWeekNumber,
  getLocalIsoDate,
  getWeekStart,
  parseIsoDate,
  shiftIsoDate,
  toIsoDate,
} from '@/lib/utils/isoDate';

describe('isoDate utils', () => {
  describe('getLocalIsoDate', () => {
    it('preserves the local calendar date for a local Date object', () => {
      expect(getLocalIsoDate(new Date(2026, 3, 16, 9, 30))).toBe('2026-04-16');
      expect(getLocalIsoDate(new Date(2026, 0, 1, 0, 30))).toBe('2026-01-01');
    });
  });

  describe('parseIsoDate', () => {
    it('parses an ISO date string at local noon', () => {
      const result = parseIsoDate('2026-04-16');

      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(3);
      expect(result.getDate()).toBe(16);
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(0);
    });
  });

  describe('toIsoDate', () => {
    it('converts a Date to an ISO yyyy-mm-dd string', () => {
      expect(toIsoDate(new Date('2026-04-16T12:00:00Z'))).toBe('2026-04-16');
    });
  });

  describe('shiftIsoDate', () => {
    it('shifts dates forward and backward across month and year boundaries', () => {
      expect(shiftIsoDate('2026-01-31', 1)).toBe('2026-02-01');
      expect(shiftIsoDate('2026-01-01', -1)).toBe('2025-12-31');
    });
  });

  describe('getWeekStart', () => {
    it('returns monday for a weekday date', () => {
      expect(getWeekStart('2026-01-07')).toBe('2026-01-05');
    });

    it('returns the same date when the input is already monday', () => {
      expect(getWeekStart('2026-01-05')).toBe('2026-01-05');
    });

    it('returns the monday of a week that starts in one year and continues into the next', () => {
      expect(getWeekStart('2026-01-01')).toBe('2025-12-29');
    });

    it('maps sunday to the monday of the same ISO week', () => {
      expect(getWeekStart('2026-01-11')).toBe('2026-01-05');
    });
  });

  describe('getIsoWeekNumber', () => {
    it('returns the week number for regular dates', () => {
      expect(getIsoWeekNumber('2026-01-01')).toBe(1);
      expect(getIsoWeekNumber('2026-01-05')).toBe(2);
    });

    it('handles year-boundary ISO weeks', () => {
      expect(getIsoWeekNumber('2026-12-31')).toBe(53);
      expect(getIsoWeekNumber('2027-01-01')).toBe(53);
    });
  });
});
