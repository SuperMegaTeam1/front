import { describe, expect, it } from 'vitest';
import type { ScheduleLessonResult } from '@/lib/api/types';
import {
  buildTeacherLessonHref,
  formatTeacherLessonGroupNames,
  normalizeTeacherLessonGroups,
  parseTeacherLessonGroups,
} from '@/lib/utils/teacherLesson';

function makeLesson(overrides: Partial<ScheduleLessonResult> = {}): Partial<ScheduleLessonResult> {
  return {
    lessonsId: 'lesson-1',
    subjectId: 'subject-1',
    subjectName: 'Математический анализ',
    cabinet: '401',
    type: 'Лекция',
    startsAt: '10:00',
    endsAt: '11:30',
    ...overrides,
  };
}

describe('teacherLesson utils', () => {
  describe('normalizeTeacherLessonGroups', () => {
    it('normalizes backend groups with both supported field shapes', () => {
      expect(normalizeTeacherLessonGroups(makeLesson({
        groups: [
          { groupId: 'group-1', groupName: '09-352' },
          { id: 'group-2', name: '09-353' },
          { groupId: 'group-3' },
          '09-354',
        ],
      }))).toEqual([
        { groupId: 'group-1', groupName: '09-352' },
        { groupId: 'group-2', groupName: '09-353' },
      ]);
    });

    it('uses studyGroups when the lesson has no groups array', () => {
      expect(normalizeTeacherLessonGroups(makeLesson({
        studyGroups: [{ id: 'group-4', name: '09-354' }],
      }))).toEqual([
        { groupId: 'group-4', groupName: '09-354' },
      ]);
    });

    it('falls back to groupNames and groupName for older schedule payloads', () => {
      expect(normalizeTeacherLessonGroups(makeLesson({
        groupNames: ['09-351', '', '09-352'],
      }))).toEqual([
        { groupId: '09-351', groupName: '09-351' },
        { groupId: '09-352', groupName: '09-352' },
      ]);

      expect(normalizeTeacherLessonGroups(makeLesson({
        groupName: '09-353',
      }))).toEqual([
        { groupId: '09-353', groupName: '09-353' },
      ]);
    });
  });

  describe('formatTeacherLessonGroupNames', () => {
    it('joins normalized group names for schedule cards', () => {
      expect(formatTeacherLessonGroupNames([
        { groupId: 'group-1', groupName: '09-352' },
        { groupId: 'group-2', groupName: '09-353' },
      ])).toBe('09-352, 09-353');
    });
  });

  describe('buildTeacherLessonHref', () => {
    it('builds a lesson link with only provided context fields', () => {
      expect(buildTeacherLessonHref({
        lessonId: 'lesson-1',
        subjectId: 'subject-1',
        subjectName: 'Математический анализ',
        date: '2026-05-22',
        groups: [{ groupId: 'group-1', groupName: '09-352' }],
      })).toBe('/teacher/lesson/lesson-1?subjectId=subject-1&subjectName=%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9+%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7&date=2026-05-22&groups=%5B%7B%22groupId%22%3A%22group-1%22%2C%22groupName%22%3A%2209-352%22%7D%5D');
    });

  });

  describe('parseTeacherLessonGroups', () => {
    it('parses serialized groups and filters malformed items', () => {
      const serialized = JSON.stringify([
        { groupId: 'group-1', groupName: '09-352' },
        { groupId: 'group-2' },
        null,
      ]);

      expect(parseTeacherLessonGroups(serialized)).toEqual([
        { groupId: 'group-1', groupName: '09-352' },
      ]);
    });

    it('returns an empty array for invalid serialized groups', () => {
      expect(parseTeacherLessonGroups(null)).toEqual([]);
      expect(parseTeacherLessonGroups('not-json')).toEqual([]);
      expect(parseTeacherLessonGroups('{"groupId":"group-1"}')).toEqual([]);
    });
  });
});
