import { describe, expect, it } from 'vitest';
import type {
  ScheduleLessonResult,
  TodayScheduleResult,
  WeekScheduleResult,
} from '@/lib/api/types';
import {
  buildScheduleHomeState,
  buildSchedulePageState,
  buildScheduleWeekDays,
  formatLessonsCountLabel,
  formatScheduleRoom,
  formatScheduleTeacherName,
  getCurrentScheduleDayLabel,
  mapLessonToStudentHomeLesson,
  mapLessonToTeacherHomeLesson,
} from '@/lib/utils/scheduleView';

function makeLesson(overrides: Partial<ScheduleLessonResult> = {}): ScheduleLessonResult {
  return {
    lessonsId: 'lesson-1',
    subjectId: 'subject-1',
    subjectName: 'Математический анализ',
    cabinet: '401',
    type: 'Лекция',
    startsAt: '10:00',
    endsAt: '11:30',
    teacherFirstName: 'Иван',
    teacherLastName: 'Петров',
    teacherFatherName: 'Сергеевич',
    ...overrides,
  };
}

describe('scheduleView utils', () => {
  describe('formatScheduleTeacherName', () => {
    it('joins available teacher name parts', () => {
      expect(formatScheduleTeacherName(makeLesson())).toBe('Петров Иван Сергеевич');
    });

    it('skips empty teacher name parts', () => {
      expect(formatScheduleTeacherName(makeLesson({
        teacherLastName: 'Петров',
        teacherFirstName: undefined,
        teacherFatherName: undefined,
      }))).toBe('Петров');
    });
  });

  describe('formatScheduleRoom', () => {
    it('formats a cabinet label', () => {
      expect(formatScheduleRoom('401')).toBe('Ауд. 401');
    });

    it('returns undefined when cabinet is missing', () => {
      expect(formatScheduleRoom(null)).toBeUndefined();
    });
  });

  describe('mapLessonToStudentHomeLesson', () => {
    it('maps backend lessons to the student home card shape', () => {
      expect(mapLessonToStudentHomeLesson(makeLesson())).toEqual({
        id: 'lesson-1',
        startTime: '10:00',
        endTime: '11:30',
        subjectName: 'Математический анализ',
        lessonType: 'Лекция',
        teacherName: 'Петров Иван Сергеевич',
        room: 'Ауд. 401',
      });
    });
  });

  describe('mapLessonToTeacherHomeLesson', () => {
    it('maps backend lessons to the teacher home card shape', () => {
      expect(mapLessonToTeacherHomeLesson(makeLesson({
        groups: [
          { groupId: 'g1', groupName: '09-352' },
          { id: 'g2', name: '09-353' },
        ],
      }))).toEqual({
        id: 'lesson-1',
        subjectId: 'subject-1',
        startTime: '10:00',
        endTime: '11:30',
        subjectName: 'Математический анализ',
        lessonType: 'Лекция',
        groups: ['09-352', '09-353'],
        groupInfos: [
          { groupId: 'g1', groupName: '09-352' },
          { groupId: 'g2', groupName: '09-353' },
        ],
        room: 'Ауд. 401',
      });
    });
  });

  describe('buildScheduleWeekDays', () => {
    it('maps backend week data into schedule days', () => {
      const weekSchedule: WeekScheduleResult = {
        dateStart: '2026-01-05',
        dateEnd: '2026-01-10',
        items: [
          {
            date: '2026-01-05',
            dayName: 'Понедельник',
            weekNumber: 2,
            lessonsCount: 2,
            items: [
              makeLesson({ lessonsId: 'lesson-2', startsAt: '12:00' }),
              makeLesson({ lessonsId: 'lesson-1', startsAt: '08:30' }),
            ],
          },
        ],
      };

      const result = buildScheduleWeekDays(weekSchedule, '2026-01-05', (lesson) => lesson.lessonsId);

      expect(result).toEqual([
        {
          date: '2026-01-05',
          lessons: ['lesson-1', 'lesson-2'],
        },
      ]);
    });

    it('falls back to an empty monday-saturday week when backend data is missing', () => {
      const result = buildScheduleWeekDays(undefined, '2026-01-07', (lesson) => lesson.lessonsId);

      expect(result).toEqual([
        { date: '2026-01-05', lessons: [] },
        { date: '2026-01-06', lessons: [] },
        { date: '2026-01-07', lessons: [] },
        { date: '2026-01-08', lessons: [] },
        { date: '2026-01-09', lessons: [] },
        { date: '2026-01-10', lessons: [] },
      ]);
    });
  });

  describe('buildSchedulePageState', () => {
    it('prepares today and week state for the schedule page', () => {
      const todaySchedule: TodayScheduleResult = {
        date: '2026-01-05',
        dayName: 'Понедельник',
        weekNumber: 8,
        lessonsCount: 2,
        items: [
          makeLesson({ lessonsId: 'lesson-2', startsAt: '12:00' }),
          makeLesson({ lessonsId: 'lesson-1', startsAt: '08:30' }),
        ],
      };

      const weekSchedule: WeekScheduleResult = {
        dateStart: '2026-01-05',
        dateEnd: '2026-01-10',
        items: [todaySchedule],
      };

      const result = buildSchedulePageState({
        todaySchedule,
        weekSchedule,
        todayDate: '2026-01-05',
        weekAnchorDate: '2026-01-05',
        weekOffset: 0,
        mapLesson: (lesson) => lesson.lessonsId,
      });

      expect(result).toEqual({
        todayLessons: ['lesson-1', 'lesson-2'],
        displayWeekDays: [{ date: '2026-01-05', lessons: ['lesson-1', 'lesson-2'] }],
        headlineDate: '2026-01-05',
        weekNumber: 8,
        isEvenWeek: true,
      });
    });

    it('uses the anchor week number when the user browses another week', () => {
      const result = buildSchedulePageState({
        todaySchedule: {
          date: '2026-01-05',
          dayName: 'Понедельник',
          weekNumber: 99,
          lessonsCount: 0,
          items: [],
        },
        weekSchedule: undefined,
        todayDate: '2026-01-05',
        weekAnchorDate: '2026-01-05',
        weekOffset: 1,
        mapLesson: (lesson) => lesson.lessonsId,
      });

      expect(result.weekNumber).toBe(2);
      expect(result.isEvenWeek).toBe(true);
      expect(result.displayWeekDays).toHaveLength(6);
    });
  });

  describe('buildScheduleHomeState', () => {
    it('returns the current, previous, and next day around today by default', () => {
      const weekSchedule: WeekScheduleResult = {
        dateStart: '2026-01-05',
        dateEnd: '2026-01-10',
        items: [
          {
            date: '2026-01-05',
            dayName: 'Понедельник',
            weekNumber: 2,
            lessonsCount: 1,
            items: [makeLesson({ lessonsId: 'lesson-1' })],
          },
          {
            date: '2026-01-06',
            dayName: 'Вторник',
            weekNumber: 2,
            lessonsCount: 1,
            items: [makeLesson({ lessonsId: 'lesson-2' })],
          },
          {
            date: '2026-01-07',
            dayName: 'Среда',
            weekNumber: 2,
            lessonsCount: 1,
            items: [makeLesson({ lessonsId: 'lesson-3' })],
          },
        ],
      };

      const result = buildScheduleHomeState({
        weekSchedule,
        todayDate: '2026-01-06',
        selectedDayIndex: null,
        mapLesson: (lesson) => lesson.lessonsId,
      });

      expect(result.todayIndex).toBe(1);
      expect(result.currentDayIndex).toBe(1);
      expect(result.previousDay).toEqual({ date: '2026-01-05', lessons: ['lesson-1'] });
      expect(result.currentDay).toEqual({ date: '2026-01-06', lessons: ['lesson-2'] });
      expect(result.nextDay).toEqual({ date: '2026-01-07', lessons: ['lesson-3'] });
      expect(result.totalDays).toBe(3);
    });

    it('clamps an out-of-range selected day index to the last available day', () => {
      const result = buildScheduleHomeState({
        weekSchedule: undefined,
        todayDate: '2026-01-07',
        selectedDayIndex: 99,
        mapLesson: (lesson) => lesson.lessonsId,
      });

      expect(result.currentDayIndex).toBe(5);
      expect(result.currentDay.date).toBe('2026-01-10');
      expect(result.nextDay).toBeUndefined();
    });
  });

  describe('getCurrentScheduleDayLabel', () => {
    it('returns relative labels near today', () => {
      expect(getCurrentScheduleDayLabel(2, 2, '2026-01-07')).toBe('Сегодня');
      expect(getCurrentScheduleDayLabel(1, 2, '2026-01-06')).toBe('Вчера');
      expect(getCurrentScheduleDayLabel(3, 2, '2026-01-08')).toBe('Завтра');
    });

    it('falls back to the weekday name for non-adjacent days', () => {
      expect(getCurrentScheduleDayLabel(0, 2, '2026-01-05')).toBe('Понедельник');
    });
  });

  describe('formatLessonsCountLabel', () => {
    it('returns loading and error labels first', () => {
      expect(formatLessonsCountLabel(3, true, false)).toBe('загружаем расписание');
      expect(formatLessonsCountLabel(3, false, true)).toBe('расписание недоступно');
    });

    it('formats russian plural forms for lessons', () => {
      expect(formatLessonsCountLabel(1, false, false)).toBe('1 занятие');
      expect(formatLessonsCountLabel(3, false, false)).toBe('3 занятия');
      expect(formatLessonsCountLabel(5, false, false)).toBe('5 занятий');
    });
  });
});
