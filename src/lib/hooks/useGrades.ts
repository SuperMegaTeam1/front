'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGradesBySubject, getGradebook, setGrades } from '@/lib/api/grades.api';
import type { SetGradePayload } from '@/types/grade';

/** Хук: оценки студента по предмету */
export function useGradesBySubject(subjectId: number) {
  return useQuery({
    queryKey: ['grades', 'subject', subjectId],
    queryFn: () => getGradesBySubject(subjectId).then((res) => res.data.data),
    enabled: !!subjectId,
  });
}

/** Хук: журнал группы (для преподавателя) */
export function useGradebook(subjectId: number, groupId: number) {
  return useQuery({
    queryKey: ['gradebook', subjectId, groupId],
    queryFn: () => getGradebook(subjectId, groupId).then((res) => res.data.data),
    enabled: !!subjectId && !!groupId,
  });
}

/** Хук: выставление оценок (мутация) */
export function useSetGrades() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SetGradePayload[]) => setGrades(payload),
    onSuccess: () => {
      // Инвалидируем кэш журнала — данные обновятся автоматически
      queryClient.invalidateQueries({ queryKey: ['gradebook'] });
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
}
