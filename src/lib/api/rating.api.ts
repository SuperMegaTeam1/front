import api from './axios';
import type { StudentRatingResponse } from './types';

export function getMyStudentRating(subjectId?: string) {
  return api.get<StudentRatingResponse>('/students/me/rating', {
    params: subjectId ? { subjectId } : undefined,
  });
}

export const getOverallRating = () => getMyStudentRating();
export const getSubjectRating = (subjectId: string) => getMyStudentRating(subjectId);
