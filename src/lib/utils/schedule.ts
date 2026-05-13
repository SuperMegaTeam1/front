import type { ScheduleLessonResult, TeacherSubjectGroupListItem, WeekScheduleResult } from '@/lib/api/types';
import { getWeekDay } from './formatDate';
import { getWeekStart, parseIsoDate, shiftIsoDate } from './isoDate';

export type ScheduleDay<TLesson> = {
  date: string;
  lessons: TLesson[];
};

const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' });
const dayMonthFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
});
const monthFormatter = new Intl.DateTimeFormat('ru-RU', { month: 'long' });

export function buildEmptyScheduleWeek<TLesson>(anchorDate: string): ScheduleDay<TLesson>[] {
  const monday = getWeekStart(anchorDate);

  return Array.from({ length: 6 }, (_, index) => ({
    date: shiftIsoDate(monday, index),
    lessons: [],
  }));
}

export function sortScheduleLessons<T extends { startsAt: string }>(
  lessons: T[] | null | undefined
) {
  return (lessons ?? []).slice().sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function getScheduleLessonGroupNames(lesson: {
  studyGroups?: TeacherSubjectGroupListItem[];
}) {
  const uniqueNames = new Set<string>();

  for (const group of lesson.studyGroups ?? []) {
    const groupName = group.groupName ?? group.name;

    if (groupName) {
      uniqueNames.add(groupName);
    }
  }

  return Array.from(uniqueNames);
}

export function formatScheduleLessonGroups(lesson: {
  studyGroups?: TeacherSubjectGroupListItem[];
}) {
  const groups = getScheduleLessonGroupNames(lesson);

  return groups.length > 0 ? groups.join(', ') : undefined;
}

export function mapBackendWeekToScheduleDays<TLesson>(
  schedule: WeekScheduleResult | undefined,
  mapLesson: (lesson: ScheduleLessonResult) => TLesson
): ScheduleDay<TLesson>[] {
  return (schedule?.items ?? []).map((day) => ({
    date: day.date,
    lessons: sortScheduleLessons(day.items).map(mapLesson),
  }));
}

function formatDayMonth(date: Date) {
  return dayMonthFormatter.format(date);
}

function getMonthForDateContext(date: Date) {
  return dayMonthFormatter.formatToParts(date)
    .find((part) => part.type === 'month')?.value ?? monthFormatter.format(date);
}

export function formatScheduleHeadlineDate(dateStr: string) {
  const date = parseIsoDate(dateStr);
  return `${weekdayFormatter.format(date).toUpperCase()}, ${formatDayMonth(date).toUpperCase()}`;
}

export function formatScheduleDayTitle(dateStr: string) {
  const date = parseIsoDate(dateStr);
  return `${weekdayFormatter.format(date)}, ${formatDayMonth(date)}`.toUpperCase();
}

export function formatScheduleWeekRange<TLesson>(days: ScheduleDay<TLesson>[]) {
  const start = parseIsoDate(days[0].date);
  const end = parseIsoDate(days[days.length - 1].date);
  const isSameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();

  if (isSameMonth) {
    return `${start.getDate()}-${end.getDate()} ${getMonthForDateContext(end)}`;
  }

  return `${formatDayMonth(start)} - ${formatDayMonth(end)}`;
}

export function getRelativeScheduleDayLabel(offset: number, fallbackDate: string) {
  if (offset === 0) {
    return 'Сегодня';
  }

  if (offset === -1) {
    return 'Вчера';
  }

  if (offset === 1) {
    return 'Завтра';
  }

  return getWeekDay(fallbackDate);
}

export function getScheduleStageTag(index: number, todayIndex: number, date: string) {
  const offset = index - todayIndex;

  if (offset === 0) {
    return 'ПАРЫ СЕГОДНЯ';
  }

  if (offset === -1) {
    return 'ПАРЫ ВЧЕРА';
  }

  if (offset === 1) {
    return 'ПАРЫ ЗАВТРА';
  }

  return `РАСПИСАНИЕ НА ${getWeekDay(date).toUpperCase()}`;
}
