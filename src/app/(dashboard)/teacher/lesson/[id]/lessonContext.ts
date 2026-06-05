import type { QueryClient } from '@tanstack/react-query';
import type {
  ScheduleLessonResult,
  TodayScheduleResult,
  WeekScheduleResult,
} from '@/lib/api/types';
import {
  normalizeTeacherLessonGroups,
  type TeacherLessonRouteContext,
} from '@/lib/utils/teacherLesson';

/** Контекст занятия из элемента расписания. */
export function buildLessonContext(lesson: ScheduleLessonResult, date: string): TeacherLessonRouteContext {
  return {
    lessonId: lesson.lessonsId,
    subjectId: lesson.subjectId,
    subjectName: lesson.subjectName,
    lessonType: lesson.type,
    date,
    startsAt: lesson.startsAt,
    endsAt: lesson.endsAt,
    cabinet: lesson.cabinet,
    groups: normalizeTeacherLessonGroups(lesson),
  };
}

export function isTodayScheduleResult(value: unknown): value is TodayScheduleResult {
  return typeof value === 'object'
    && value !== null
    && Array.isArray((value as TodayScheduleResult).items)
    && typeof (value as TodayScheduleResult).date === 'string';
}

export function isWeekScheduleResult(value: unknown): value is WeekScheduleResult {
  return typeof value === 'object'
    && value !== null
    && Array.isArray((value as WeekScheduleResult).items)
    && typeof (value as WeekScheduleResult).dateStart === 'string';
}

/** Ищет занятие в уже закэшированных запросах расписания React Query. */
export function findLessonInScheduleCache(queryClient: QueryClient, lessonId: string) {
  const scheduleQueries = queryClient.getQueriesData<unknown>({ queryKey: ['schedule'] });

  for (const [, queryData] of scheduleQueries) {
    if (isTodayScheduleResult(queryData)) {
      const lesson = queryData.items.find((item) => item.lessonsId === lessonId);

      if (lesson) {
        return buildLessonContext(lesson, queryData.date);
      }
    }

    if (isWeekScheduleResult(queryData)) {
      for (const day of queryData.items) {
        const lesson = day.items.find((item) => item.lessonsId === lessonId);

        if (lesson) {
          return buildLessonContext(lesson, day.date);
        }
      }
    }
  }

  return null;
}
