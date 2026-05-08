'use client';

import { useQuery } from '@tanstack/react-query';
import { getTodaySchedule, getWeekSchedule } from '@/lib/api/schedule.api';
import { useAuthStore } from '@/stores/useAuthStore';

export function useDaySchedule(date: string) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['schedule', 'today', date, user?.role],
    queryFn: () => getTodaySchedule(date, user!.role).then(res => res.data),
    enabled: !!date && !!user?.role,
  });
}

export function useWeekSchedule(date: string, shouldFetch = true) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['schedule', 'week', date, user?.role],
    queryFn: () => getWeekSchedule(date, user!.role).then(res => res.data),
    enabled: shouldFetch && !!date && !!user?.role,
  });
}