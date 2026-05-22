import { describe, expect, it } from 'vitest';
import type { ScheduleLessonResult, WeekScheduleResult } from '@/lib/api/types';
import {
  buildEmptyScheduleWeek,
  formatScheduleHeadlineDate,
  formatScheduleLessonGroups,
  formatScheduleWeekRange,
  getScheduleLessonGroupNames,
  mapBackendWeekToScheduleDays,
  sortScheduleLessons,
} from '@/lib/utils/schedule';

function makeLesson(overrides: Partial<ScheduleLessonResult> = {}): ScheduleLessonResult {
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

describe('schedule utils', () => {
  it('builds an empty monday-saturday week around the anchor date', () => {
    expect(buildEmptyScheduleWeek('2026-05-22')).toEqual([
      { date: '2026-05-18', lessons: [] },
      { date: '2026-05-19', lessons: [] },
      { date: '2026-05-20', lessons: [] },
      { date: '2026-05-21', lessons: [] },
      { date: '2026-05-22', lessons: [] },
      { date: '2026-05-23', lessons: [] },
    ]);
  });

  it('sorts lessons by start time without mutating the source array', () => {
    const lessons = [
      makeLesson({ lessonsId: 'second', startsAt: '12:00' }),
      makeLesson({ lessonsId: 'first', startsAt: '08:30' }),
    ];

    expect(sortScheduleLessons(lessons).map((lesson) => lesson.lessonsId)).toEqual(['first', 'second']);
    expect(lessons.map((lesson) => lesson.lessonsId)).toEqual(['second', 'first']);
  });

  it('maps backend week days and keeps lessons sorted inside every day', () => {
    const weekSchedule: WeekScheduleResult = {
      dateStart: '2026-05-18',
      dateEnd: '2026-05-23',
      items: [
        {
          date: '2026-05-22',
          dayName: 'пятница',
          weekNumber: 21,
          lessonsCount: 2,
          items: [
            makeLesson({ lessonsId: 'late', startsAt: '13:40' }),
            makeLesson({ lessonsId: 'early', startsAt: '08:30' }),
          ],
        },
      ],
    };

    expect(mapBackendWeekToScheduleDays(weekSchedule, (lesson) => lesson.lessonsId)).toEqual([
      { date: '2026-05-22', lessons: ['early', 'late'] },
    ]);
  });

  it('formats schedule dates with the month form required by the day number', () => {
    expect(formatScheduleHeadlineDate('2026-05-22')).toBe('ПЯТНИЦА, 22 МАЯ');
    expect(formatScheduleWeekRange(buildEmptyScheduleWeek('2026-05-22'))).toBe('18-23 мая');
    expect(formatScheduleWeekRange([
      { date: '2026-01-30', lessons: [] },
      { date: '2026-02-04', lessons: [] },
    ])).toBe('30 января - 4 февраля');
  });

  it('deduplicates and formats teacher group names from schedule payloads', () => {
    const lesson = makeLesson({
      groups: [
        { groupId: 'group-1', groupName: '09-352' },
        { id: 'group-2', name: '09-353' },
        { groupId: 'group-3', groupName: '09-352' },
      ],
    });

    expect(getScheduleLessonGroupNames(lesson)).toEqual(['09-352', '09-353']);
    expect(formatScheduleLessonGroups(lesson)).toBe('09-352, 09-353');
  });
});
