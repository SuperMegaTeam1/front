'use client';

import { useQuery } from '@tanstack/react-query';
import { getTeacherGroups } from '@/lib/api/groups.api';

export function useTeacherGroups() {
  return useQuery({
    queryKey: ['teachers', 'me', 'groups'],
    queryFn: () =>
      getTeacherGroups().then((res) =>
        res.data
          .map((group) => ({
            groupId: group.groupId,
            groupName: group.groupName ?? group.name ?? '',
          }))
          .filter((group) => group.groupId && group.groupName),
      ),
  });
}
