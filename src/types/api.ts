/** Универсальный ответ API */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Ответ с пагинацией */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/** Ошибка API */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/** Данные для логина */
export interface LoginPayload {
  login: string;
  password: string;
}

/** Ответ на успешный логин */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: import('./user').User;
}
