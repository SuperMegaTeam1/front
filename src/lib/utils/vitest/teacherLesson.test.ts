import { describe, expect, it } from 'vitest';
import {
  buildTeacherLessonHref,
  formatTeacherLessonGroupNames,
  normalizeTeacherLessonGroups,
  parseTeacherLessonGroups,
} from '@/lib/utils/teacherLesson';

describe('teacherLesson utils', () => {
  describe('normalizeTeacherLessonGroups', () => {
    it('normalizes structured lesson groups from groups', () => {
      expect(normalizeTeacherLessonGroups({
        groups: [
          { groupId: 'g1', groupName: '09-352' },
          { id: 'g2', name: '09-353' },
          { groupId: 'g3' },
          'raw-string-group',
        ],
      })).toEqual([
        { groupId: 'g1', groupName: '09-352' },
        { groupId: 'g2', groupName: '09-353' },
      ]);
    });

    it('uses studyGroups when groups are missing', () => {
      expect(normalizeTeacherLessonGroups({
        studyGroups: [
          { groupId: 'g1', groupName: '09-352' },
          { id: 'g2', name: '09-353' },
        ],
      })).toEqual([
        { groupId: 'g1', groupName: '09-352' },
        { groupId: 'g2', groupName: '09-353' },
      ]);
    });

    it('falls back to groupNames when structured groups are absent', () => {
      expect(normalizeTeacherLessonGroups({
        groupNames: ['09-352', '  ', '09-353'],
      })).toEqual([
        { groupId: '09-352', groupName: '09-352' },
        { groupId: '09-353', groupName: '09-353' },
      ]);
    });

    it('falls back to groupName when it is the only available source', () => {
      expect(normalizeTeacherLessonGroups({
        groupName: '09-354',
      })).toEqual([
        { groupId: '09-354', groupName: '09-354' },
      ]);
    });

    it('returns an empty array when no valid group data exists', () => {
      expect(normalizeTeacherLessonGroups({
        groups: ['raw-group'],
        groupNames: [''],
        groupName: '   ',
      })).toEqual([]);
    });
  });

  describe('formatTeacherLessonGroupNames', () => {
    it('joins group names with commas for display', () => {
      expect(formatTeacherLessonGroupNames([
        { groupId: 'g1', groupName: '09-352' },
        { groupId: 'g2', groupName: '09-353' },
      ])).toBe('09-352, 09-353');
    });
  });

  describe('buildTeacherLessonHref', () => {
    it('builds a lesson href with all supported query params', () => {
      const href = buildTeacherLessonHref({
        lessonId: 'lesson-7',
        subjectId: 'subject-1',
        subjectName: 'TypeScript',
        lessonType: 'Практика',
        date: '2026-05-22',
        startsAt: '10:00',
        endsAt: '11:30',
        cabinet: '401',
        groups: [
          { groupId: 'g1', groupName: '09-352' },
          { groupId: 'g2', groupName: '09-353' },
        ],
      });

      const url = new URL(href, 'https://example.test');

      expect(url.pathname).toBe('/teacher/lesson/lesson-7');
      expect(url.searchParams.get('subjectId')).toBe('subject-1');
      expect(url.searchParams.get('subjectName')).toBe('TypeScript');
      expect(url.searchParams.get('lessonType')).toBe('Практика');
      expect(url.searchParams.get('date')).toBe('2026-05-22');
      expect(url.searchParams.get('startsAt')).toBe('10:00');
      expect(url.searchParams.get('endsAt')).toBe('11:30');
      expect(url.searchParams.get('cabinet')).toBe('401');
      expect(JSON.parse(url.searchParams.get('groups') ?? '[]')).toEqual([
        { groupId: 'g1', groupName: '09-352' },
        { groupId: 'g2', groupName: '09-353' },
      ]);
    });

    it('returns a plain lesson path when no optional params are provided', () => {
      expect(buildTeacherLessonHref({
        lessonId: 'lesson-8',
      })).toBe('/teacher/lesson/lesson-8');
    });
  });

  describe('parseTeacherLessonGroups', () => {
    it('parses valid serialized groups from the query string', () => {
      expect(parseTeacherLessonGroups(JSON.stringify([
        { groupId: 'g1', groupName: '09-352' },
        { groupId: 'g2', groupName: '09-353' },
      ]))).toEqual([
        { groupId: 'g1', groupName: '09-352' },
        { groupId: 'g2', groupName: '09-353' },
      ]);
    });

    it('filters out invalid group entries', () => {
      expect(parseTeacherLessonGroups(JSON.stringify([
        { groupId: 'g1', groupName: '09-352' },
        { groupId: 'g2' },
        'raw-group',
        null,
      ]))).toEqual([
        { groupId: 'g1', groupName: '09-352' },
      ]);
    });

    it('returns an empty array for empty or malformed input', () => {
      expect(parseTeacherLessonGroups(null)).toEqual([]);
      expect(parseTeacherLessonGroups('')).toEqual([]);
      expect(parseTeacherLessonGroups('{not-json}')).toEqual([]);
      expect(parseTeacherLessonGroups(JSON.stringify({ groupId: 'g1' }))).toEqual([]);
    });
  });
});
