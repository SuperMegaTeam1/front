'use client';

import { useQuery } from '@tanstack/react-query';
import { getScheduleByDate, getWeekSchedule } from '@/lib/api/schedule.api';

/** Хук: расписание на день */
export function useDaySchedule(date: string) {
  return useQuery({
    queryKey: ['schedule', 'day', date],
    queryFn: () => getScheduleByDate(date).then((res) => res.data.data),
    enabled: !!date,
  });
}

/** Хук: расписание на неделю */
export function useWeekSchedule(date: string) {
  return useQuery({
    queryKey: ['schedule', 'week', date],
    queryFn: () => getWeekSchedule(date).then((res) => res.data.data),
    enabled: !!date,
  });
}
