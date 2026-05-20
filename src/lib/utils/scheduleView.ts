import type {
  ScheduleLessonResult,
  TodayScheduleResult,
  WeekScheduleResult,
} from '@/lib/api/types';
import { getWeekDay } from './formatDate';
import { getIsoWeekNumber } from './isoDate';
import {
  buildEmptyScheduleWeek,
  getScheduleLessonGroupNames,
  mapBackendWeekToScheduleDays,
  sortScheduleLessons,
  type ScheduleDay,
} from './schedule';
import { normalizeTeacherLessonGroups, type TeacherLessonGroupInfo } from './teacherLesson';

export interface StudentHomeLessonView {
  id: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  lessonType?: string;
  teacherName?: string;
  room?: string;
  isActive?: boolean;
}

export interface TeacherHomeLessonView {
  id: string;
  subjectId: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  lessonType?: string;
  groups?: string[];
  groupInfos?: TeacherLessonGroupInfo[];
  room?: string;
  isActive?: boolean;
}

interface SchedulePageStateOptions<TLesson> {
  todaySchedule?: TodayScheduleResult;
  weekSchedule?: WeekScheduleResult;
  todayDate: string;
  weekAnchorDate: string;
  weekOffset: number;
  mapLesson: (lesson: ScheduleLessonResult) => TLesson;
}

interface ScheduleHomeStateOptions<TLesson> {
  weekSchedule?: WeekScheduleResult;
  todayDate: string;
  selectedDayIndex: number | null;
  mapLesson: (lesson: ScheduleLessonResult) => TLesson;
}

export function formatScheduleTeacherName(lesson: Pick<
  ScheduleLessonResult,
  'teacherLastName' | 'teacherFirstName' | 'teacherFatherName'
>) {
  return [lesson.teacherLastName, lesson.teacherFirstName, lesson.teacherFatherName]
    .filter(Boolean)
    .join(' ');
}

export function formatScheduleRoom(cabinet: string | null) {
  return cabinet ? `Ауд. ${cabinet}` : undefined;
}

export function mapLessonToStudentHomeLesson(lesson: ScheduleLessonResult): StudentHomeLessonView {
  return {
    id: lesson.lessonsId,
    startTime: lesson.startsAt,
    endTime: lesson.endsAt,
    subjectName: lesson.subjectName,
    lessonType: lesson.type ?? undefined,
    teacherName: formatScheduleTeacherName(lesson) || undefined,
    room: formatScheduleRoom(lesson.cabinet),
  };
}

export function mapLessonToTeacherHomeLesson(lesson: ScheduleLessonResult): TeacherHomeLessonView {
  return {
    id: lesson.lessonsId,
    subjectId: lesson.subjectId,
    startTime: lesson.startsAt,
    endTime: lesson.endsAt,
    subjectName: lesson.subjectName,
    lessonType: lesson.type ?? undefined,
    groups: getScheduleLessonGroupNames(lesson),
    groupInfos: normalizeTeacherLessonGroups(lesson),
    room: formatScheduleRoom(lesson.cabinet),
  };
}

export function buildScheduleWeekDays<TLesson>(
  weekSchedule: WeekScheduleResult | undefined,
  anchorDate: string,
  mapLesson: (lesson: ScheduleLessonResult) => TLesson,
): ScheduleDay<TLesson>[] {
  const backendDays = mapBackendWeekToScheduleDays(weekSchedule, mapLesson);
  return backendDays.length > 0 ? backendDays : buildEmptyScheduleWeek<TLesson>(anchorDate);
}

export function buildSchedulePageState<TLesson>({
  todaySchedule,
  weekSchedule,
  todayDate,
  weekAnchorDate,
  weekOffset,
  mapLesson,
}: SchedulePageStateOptions<TLesson>) {
  const todayLessons = sortScheduleLessons(todaySchedule?.items).map(mapLesson);
  const displayWeekDays = buildScheduleWeekDays(weekSchedule, weekAnchorDate, mapLesson);
  const weekNumber = weekOffset === 0 && todaySchedule?.weekNumber
    ? todaySchedule.weekNumber
    : getIsoWeekNumber(weekAnchorDate);

  return {
    todayLessons,
    displayWeekDays,
    headlineDate: todaySchedule?.date ?? todayDate,
    weekNumber,
    isEvenWeek: weekNumber % 2 === 0,
  };
}

export function buildScheduleHomeState<TLesson>({
  weekSchedule,
  todayDate,
  selectedDayIndex,
  mapLesson,
}: ScheduleHomeStateOptions<TLesson>) {
  const weekDays = buildScheduleWeekDays(weekSchedule, todayDate, mapLesson);
  const todayIndex = Math.max(0, weekDays.findIndex((day) => day.date === todayDate));
  const currentDayIndex = Math.min(
    selectedDayIndex ?? todayIndex,
    Math.max(weekDays.length - 1, 0),
  );
  const currentDay = weekDays[currentDayIndex];

  return {
    weekDays,
    todayIndex,
    currentDayIndex,
    currentDay,
    previousDay: weekDays[currentDayIndex - 1],
    nextDay: weekDays[currentDayIndex + 1],
    totalDays: weekDays.length,
  };
}

export function getCurrentScheduleDayLabel(
  currentDayIndex: number,
  todayIndex: number,
  date: string,
) {
  if (currentDayIndex === todayIndex) {
    return 'Сегодня';
  }

  if (currentDayIndex === todayIndex - 1) {
    return 'Вчера';
  }

  if (currentDayIndex === todayIndex + 1) {
    return 'Завтра';
  }

  return getWeekDay(date);
}

export function formatLessonsCountLabel(
  count: number,
  isLoading: boolean,
  hasError: boolean,
) {
  if (isLoading) {
    return 'загружаем расписание';
  }

  if (hasError) {
    return 'расписание недоступно';
  }

  if (count === 1) {
    return '1 занятие';
  }

  if (count >= 2 && count <= 4) {
    return `${count} занятия`;
  }

  return `${count} занятий`;
}
