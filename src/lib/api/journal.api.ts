import axios from 'axios';
import api from './axios';
import type {
  GroupJournalResponse,
  SaveLessonJournalPayload,
  SaveLessonJournalResponse,
} from './types';

export async function getGroupJournal(subjectId: string, groupId: string) {
  try {
    return await api.get<GroupJournalResponse>(`/journal/${subjectId}/${groupId}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        data: {
          subjectId,
          groupId,
          items: [],
        },
      };
    }

    throw error;
  }
}

export function saveLessonJournal(lessonId: string, payload: SaveLessonJournalPayload) {
  return api.put<SaveLessonJournalResponse>(`/lessons/${lessonId}/journal`, payload);
}
