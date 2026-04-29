export type {
  AuthResponse,
  AuthUserResponse,
  BackendLoginRequest,
  BackendRoleName,
  BackendStatusResponse,
  LoginPayload,
  ScheduleLessonResult,
  StudentRatingResponse,
  TodayScheduleResult,
  TopStudentDto,
} from '@/lib/api/types';

/**
 * Legacy-тип для старых моковых API-файлов.
 * Реальный новый бэк возвращает плоский JSON без обертки { data }.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
