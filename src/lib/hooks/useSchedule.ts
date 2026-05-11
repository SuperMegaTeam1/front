'use client';

import { useQuery } from '@tanstack/react-query';
import { getTodaySchedule, getWeekSchedule, type ScheduleRole } from '@/lib/api/schedule.api';
import { useAuthStore } from '@/stores/useAuthStore';

function useScheduleRole(): ScheduleRole | null {
  const role = useAuthStore((state) => state.user?.role ?? null);
  return role === 'teacher' || role === 'student' ? role : null;
}

export function useDaySchedule(date: string) {
  const role = useScheduleRole();
  return useQuery({
    queryKey: ['schedule', role, 'today', date],
    queryFn: () => getTodaySchedule(role!, date).then((res) => res.data),
    enabled: !!role && !!date,
  });
}

export function useWeekSchedule(date: string, shouldFetch = true) {
  const role = useScheduleRole();
  return useQuery({
    queryKey: ['schedule', role, 'week', date],
    queryFn: () => getWeekSchedule(role!, date).then((res) => res.data),
    enabled: shouldFetch && !!role && !!date,
  });
}
