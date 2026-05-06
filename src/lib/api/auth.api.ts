import api from './axios';
import type {
  AuthResponse,
  AuthStudentMeResponse,
  AuthTeacherMeResponse,
  BackendLoginRequest,
  LoginPayload,
} from './types';
import type { Role } from '@/types/user';

export function login(payload: LoginPayload) {
  const request: BackendLoginRequest = {
    email: payload.login,
    password: payload.password,
  };

  return api.post<AuthResponse>('/login', request);
}

export function getStudentMe(token?: string) {
  return api.get<AuthStudentMeResponse>('/student/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export function getTeacherMe(token?: string) {
  return api.get<AuthTeacherMeResponse>('/teacher/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const payloadBase64Url = parts[1];
    const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): Role | null {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const roleClaim =
    payload.role ??
    payload.Role ??
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

  if (typeof roleClaim !== 'string') {
    return null;
  }

  const role = roleClaim.toLowerCase();
  if (role === 'teacher') {
    return 'teacher';
  }
  if (role === 'student') {
    return 'student';
  }

  return null;
}
