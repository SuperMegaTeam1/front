import api from './axios';
import type { LoginPayload, LoginResponse, ApiResponse } from '@/types/api';

/** Логин пользователя */
export const login = (payload: LoginPayload) =>
  api.post<ApiResponse<LoginResponse>>('/auth/login', payload);

/** Выход */
export const logout = () =>
  api.post('/auth/logout');

/** Обновление токена */
export const refreshToken = (token: string) =>
  api.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken: token });
