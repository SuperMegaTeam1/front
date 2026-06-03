import { describe, expect, it } from 'vitest';
import type { ScheduleLessonResult, WeekScheduleResult } from '@/lib/api/types';
import {
  buildEmptyScheduleWeek,
  formatScheduleDayTitle,
  formatScheduleHeadlineDate,
  formatScheduleLessonGroups,
  formatScheduleWeekRange,
  getRelativeScheduleDayLabel,
  getScheduleLessonGroupNames,
  getScheduleStageTag,
  mapBackendWeekToScheduleDays,
  sortScheduleLessons,
} from '@/lib/utils/schedule';

function makeLesson(overrides: Partial<ScheduleLessonResult> = {}): ScheduleLessonResult {
  return {
    lessonsId: 'lesson-1',
    subjectId: 'subject-1',
    subjectName: 'Математика',
    cabinet: '401',
    type: 'Лекция',
    startsAt: '10:00',
    endsAt: '11:30',
    ...overrides,
  };
}

describe('schedule utils', () => {
  describe('buildEmptyScheduleWeek', () => {
    it('builds a monday-to-saturday week around the anchor date', () => {
      expect(buildEmptyScheduleWeek('2026-01-07')).toEqual([
        { date: '2026-01-05', lessons: [] },
        { date: '2026-01-06', lessons: [] },
        { date: '2026-01-07', lessons: [] },
        { date: '2026-01-08', lessons: [] },
        { date: '2026-01-09', lessons: [] },
        { date: '2026-01-10', lessons: [] },
      ]);
    });

    it('keeps cross-year weeks intact when the anchor date is in january', () => {
      expect(buildEmptyScheduleWeek('2026-01-01')).toEqual([
        { date: '2025-12-29', lessons: [] },
        { date: '2025-12-30', lessons: [] },
        { date: '2025-12-31', lessons: [] },
        { date: '2026-01-01', lessons: [] },
        { date: '2026-01-02', lessons: [] },
        { date: '2026-01-03', lessons: [] },
      ]);
    });
  });

  describe('sortScheduleLessons', () => {
    it('sorts lessons by start time without mutating the input array', () => {
      const lessons = [
        makeLesson({ lessonsId: 'lesson-2', startsAt: '12:30' }),
        makeLesson({ lessonsId: 'lesson-1', startsAt: '08:00' }),
        makeLesson({ lessonsId: 'lesson-3', startsAt: '10:15' }),
      ];

      const result = sortScheduleLessons(lessons);

      expect(result.map((lesson) => lesson.lessonsId)).toEqual([
        'lesson-1',
        'lesson-3',
        'lesson-2',
      ]);
      expect(lessons.map((lesson) => lesson.lessonsId)).toEqual([
        'lesson-2',
        'lesson-1',
        'lesson-3',
      ]);
    });

    it('returns an empty array for nullish input', () => {
      expect(sortScheduleLessons(undefined)).toEqual([]);
      expect(sortScheduleLessons(null)).toEqual([]);
    });
  });

  describe('getScheduleLessonGroupNames', () => {
    it('collects unique group names from lesson groups in sorted order', () => {
      expect(getScheduleLessonGroupNames({
        groups: [
          { groupId: 'g1', groupName: '09-352' },
          { id: 'g2', name: '09-353' },
          { groupId: 'g4', groupName: '09-351' },
          { groupId: 'g3', groupName: '09-352' },
        ],
      })).toEqual(['09-351', '09-352', '09-353']);
    });

    it('falls back to groupNames and groupName when structured groups are missing', () => {
      expect(getScheduleLessonGroupNames({
        groupNames: ['09-352', '09-353'],
      })).toEqual(['09-352', '09-353']);

      expect(getScheduleLessonGroupNames({
        groupName: '09-354',
      })).toEqual(['09-354']);
    });
  });

  describe('formatScheduleLessonGroups', () => {
    it('joins group names with commas for display', () => {
      expect(formatScheduleLessonGroups({
        groups: [
          { groupId: 'g1', groupName: '09-352' },
          { id: 'g2', name: '09-353' },
        ],
      })).toBe('09-352, 09-353');
    });

    it('returns undefined when there are no valid groups', () => {
      expect(formatScheduleLessonGroups({
        groups: ['raw-group-name'],
      })).toBeUndefined();
    });
  });

  describe('mapBackendWeekToScheduleDays', () => {
    it('maps backend week items into sorted schedule days', () => {
      const schedule: WeekScheduleResult = {
        dateStart: '2026-01-05',
        dateEnd: '2026-01-10',
        items: [
          {
            date: '2026-01-05',
            dayName: 'Понедельник',
            weekNumber: 2,
            lessonsCount: 2,
            items: [
              makeLesson({ lessonsId: 'lesson-2', startsAt: '12:30' }),
              makeLesson({ lessonsId: 'lesson-1', startsAt: '08:00' }),
            ],
          },
        ],
      };

      expect(mapBackendWeekToScheduleDays(schedule, (lesson) => lesson.lessonsId)).toEqual([
        {
          date: '2026-01-05',
          lessons: ['lesson-1', 'lesson-2'],
        },
      ]);
    });

    it('returns an empty array when the backend week is missing', () => {
      expect(mapBackendWeekToScheduleDays(undefined, (lesson) => lesson.lessonsId)).toEqual([]);
    });
  });

  describe('formatScheduleHeadlineDate', () => {
    it('formats the headline date in uppercase', () => {
      expect(formatScheduleHeadlineDate('2026-01-07')).toBe('СРЕДА, 7 ЯНВАРЯ');
    });
  });

  describe('formatScheduleDayTitle', () => {
    it('formats the day title in uppercase', () => {
      expect(formatScheduleDayTitle('2026-01-07')).toBe('СРЕДА, 7 ЯНВАРЯ');
    });
  });

  describe('formatScheduleWeekRange', () => {
    it('uses a compact range when the week stays in the same month', () => {
      expect(formatScheduleWeekRange([
        { date: '2026-01-05', lessons: [] },
        { date: '2026-01-10', lessons: [] },
      ])).toBe('5-10 января');
    });

    it('uses full day-month bounds when the range spans different months', () => {
      expect(formatScheduleWeekRange([
        { date: '2026-01-29', lessons: [] },
        { date: '2026-02-03', lessons: [] },
      ])).toBe('29 января - 3 февраля');
    });
  });

  describe('getRelativeScheduleDayLabel', () => {
    it('returns relative labels for today, yesterday, and tomorrow', () => {
      expect(getRelativeScheduleDayLabel(0, '2026-01-07')).toBe('Сегодня');
      expect(getRelativeScheduleDayLabel(-1, '2026-01-06')).toBe('Вчера');
      expect(getRelativeScheduleDayLabel(1, '2026-01-08')).toBe('Завтра');
    });

    it('falls back to the weekday name for other offsets', () => {
      expect(getRelativeScheduleDayLabel(3, '2026-01-05')).toBe('Понедельник');
    });
  });

  describe('getScheduleStageTag', () => {
    it('returns special tags around the current day', () => {
      expect(getScheduleStageTag(2, 2, '2026-01-07')).toBe('ПАРЫ СЕГОДНЯ');
      expect(getScheduleStageTag(1, 2, '2026-01-06')).toBe('ПАРЫ ВЧЕРА');
      expect(getScheduleStageTag(3, 2, '2026-01-08')).toBe('ПАРЫ ЗАВТРА');
    });

    it('uses the correct weekday form after "на"', () => {
      expect(getScheduleStageTag(5, 2, '2026-01-05')).toBe('РАСПИСАНИЕ НА ПОНЕДЕЛЬНИК');
      expect(getScheduleStageTag(5, 2, '2026-01-07')).toBe('РАСПИСАНИЕ НА СРЕДУ');
      expect(getScheduleStageTag(5, 2, '2026-01-09')).toBe('РАСПИСАНИЕ НА ПЯТНИЦУ');
      expect(getScheduleStageTag(5, 2, '2026-01-10')).toBe('РАСПИСАНИЕ НА СУББОТУ');
    });
  });
});
