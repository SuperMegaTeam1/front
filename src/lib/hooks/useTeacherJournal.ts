'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGroupJournal, saveLessonJournal } from '@/lib/api/journal.api';
import { getStudentsByGroup } from '@/lib/api/users.api';
import type { SaveLessonJournalPayload } from '@/lib/api/types';

export function useTeacherGroupJournal(subjectId: string, groupId: string) {
  return useQuery({
    queryKey: ['journal', subjectId, groupId],
    queryFn: () => getGroupJournal(subjectId, groupId).then((res) => res.data),
    enabled: Boolean(subjectId && groupId),
  });
}

export function useGroupStudents(groupId: string, isEnabled = true) {
  return useQuery({
    queryKey: ['groups', groupId, 'students'],
    queryFn: () => getStudentsByGroup(groupId).then((res) => res.data.items ?? []),
    enabled: isEnabled && Boolean(groupId),
  });
}

export function useSaveLessonJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, payload }: { lessonId: string; payload: SaveLessonJournalPayload }) =>
      saveLessonJournal(lessonId, payload),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.lessonId, 'journal'] });
    },
  });
}
