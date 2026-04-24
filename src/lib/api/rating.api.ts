import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { RatingEntry, SubjectRating } from '@/types/rating';

/** Общий рейтинг студента */
export const getOverallRating = () =>
  api.get<ApiResponse<RatingEntry[]>>('/rating/overall');

/** Рейтинг по конкретному предмету */
export const getSubjectRating = (subjectId: number) =>
  api.get<ApiResponse<SubjectRating>>(`/rating/subject/${subjectId}`);
