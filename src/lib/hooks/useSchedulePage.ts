'use client';

import { useMemo, useState } from 'react';
import type { ScheduleLessonResult } from '@/lib/api/types';
import { useDaySchedule, useWeekSchedule } from '@/lib/hooks/useSchedule';
import { getLocalIsoDate, shiftIsoDate } from '@/lib/utils/isoDate';
import { buildSchedulePageState } from '@/lib/utils/scheduleView';

export type ScheduleView = 'today' | 'week';

export const SCHEDULE_VIEW_OPTIONS: Array<{ value: ScheduleView; label: string }> = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
];

/**
 * Общее состояние страницы расписания (студент/преподаватель):
 * переключатель «Сегодня/Неделя», смещение недели, запросы дня и недели,
 * а также производные данные через buildSchedulePageState.
 * Вёрстку и рендер карточек страницы оставляют у себя — они различаются по ролям.
 */
export function useSchedulePage() {
  const [view, setView] = useState<ScheduleView>('today');
  const [weekOffset, setWeekOffset] = useState(0);
  const todayDate = getLocalIsoDate();
  const weekAnchorDate = useMemo(() => shiftIsoDate(todayDate, weekOffset * 7), [todayDate, weekOffset]);

  const {
    data: todaySchedule,
    isLoading: isTodayScheduleLoading,
    error: todayScheduleError,
  } = useDaySchedule(todayDate);

  const {
    data: weekSchedule,
    isLoading: isWeekScheduleLoading,
    error: weekScheduleError,
  } = useWeekSchedule(weekAnchorDate, view === 'week');

  const {
    todayLessons,
    displayWeekDays,
    headlineDate,
    isEvenWeek,
  } = useMemo(() => buildSchedulePageState<ScheduleLessonResult>({
    todaySchedule,
    weekSchedule,
    todayDate,
    weekAnchorDate,
    weekOffset,
    mapLesson: (lesson) => lesson,
  }), [todayDate, todaySchedule, weekAnchorDate, weekOffset, weekSchedule]);

  return {
    view,
    setView,
    weekOffset,
    goToPreviousWeek: () => setWeekOffset((offset) => offset - 1),
    goToNextWeek: () => setWeekOffset((offset) => offset + 1),
    todayDate,
    todayLessons,
    isTodayScheduleLoading,
    todayScheduleError,
    displayWeekDays,
    isWeekScheduleLoading,
    weekScheduleError,
    headlineDate,
    isEvenWeek,
  };
}
