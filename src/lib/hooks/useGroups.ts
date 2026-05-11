'use client';

import { useQuery } from '@tanstack/react-query';
import { getTeacherGroups } from '@/lib/api/groups.api';

export function useTeacherGroups() {
  return useQuery({
    queryKey: ['groups', 'teacher', 'me'],
    queryFn: () => getTeacherGroups().then((res) => res.data),
  });
}
