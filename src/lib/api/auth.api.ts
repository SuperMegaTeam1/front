import api from './axios';
import type {
  AuthResponse,
  AuthUserResponse,
  BackendLoginRequest,
  LoginPayload,
} from './types';

export function login(payload: LoginPayload) {
  const request: BackendLoginRequest = {
    email: payload.login,
    password: payload.password,
  };

  return api.post<AuthResponse>('/login', request);
}

export function getMe(token?: string) {
  return api.get<AuthUserResponse>('/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
