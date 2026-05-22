import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import api from '@/lib/api/axios';
import { getRoleFromToken, getStudentMe, getTeacherMe, login } from '@/lib/api/auth.api';

function makeJwt(payload: Record<string, unknown>) {
  const base64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `header.${base64}.signature`;
}

describe('auth api utils', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('maps the frontend login field into the backend email field', async () => {
      const response = { data: { token: 'jwt-token' } };
      vi.mocked(api.post).mockResolvedValue(response);

      await expect(login({
        login: 'student@example.com',
        password: 'secret',
      })).resolves.toBe(response);

      expect(api.post).toHaveBeenCalledWith('/login', {
        email: 'student@example.com',
        password: 'secret',
      });
    });
  });

  describe('getStudentMe', () => {
    it('adds the bearer token header when a token is provided', async () => {
      const response = { data: { id: 'student-1' } };
      vi.mocked(api.get).mockResolvedValue(response);

      await expect(getStudentMe('student-token')).resolves.toBe(response);

      expect(api.get).toHaveBeenCalledWith('/student/me', {
        headers: { Authorization: 'Bearer student-token' },
      });
    });

    it('omits authorization headers when no token is provided', async () => {
      const response = { data: { id: 'student-2' } };
      vi.mocked(api.get).mockResolvedValue(response);

      await expect(getStudentMe()).resolves.toBe(response);

      expect(api.get).toHaveBeenCalledWith('/student/me', {
        headers: undefined,
      });
    });
  });

  describe('getTeacherMe', () => {
    it('adds the bearer token header when a token is provided', async () => {
      const response = { data: { id: 'teacher-1' } };
      vi.mocked(api.get).mockResolvedValue(response);

      await expect(getTeacherMe('teacher-token')).resolves.toBe(response);

      expect(api.get).toHaveBeenCalledWith('/teacher/me', {
        headers: { Authorization: 'Bearer teacher-token' },
      });
    });

    it('omits authorization headers when no token is provided', async () => {
      const response = { data: { id: 'teacher-2' } };
      vi.mocked(api.get).mockResolvedValue(response);

      await expect(getTeacherMe()).resolves.toBe(response);

      expect(api.get).toHaveBeenCalledWith('/teacher/me', {
        headers: undefined,
      });
    });
  });

  describe('getRoleFromToken', () => {
    it('returns student when the token payload contains the student role', () => {
      expect(getRoleFromToken(makeJwt({ role: 'student' }))).toBe('student');
    });

    it('returns teacher when the token payload contains the teacher role', () => {
      expect(getRoleFromToken(makeJwt({ role: 'teacher' }))).toBe('teacher');
    });

    it('reads the Role claim and normalizes letter case', () => {
      expect(getRoleFromToken(makeJwt({ Role: 'Teacher' }))).toBe('teacher');
    });

    it('reads the Microsoft role claim', () => {
      expect(getRoleFromToken(makeJwt({
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Student',
      }))).toBe('student');
    });

    it('returns null for unknown roles', () => {
      expect(getRoleFromToken(makeJwt({ role: 'admin' }))).toBeNull();
    });

    it('returns null when the token is not a jwt', () => {
      expect(getRoleFromToken('not-a-jwt')).toBeNull();
    });

    it('returns null when the payload cannot be decoded', () => {
      expect(getRoleFromToken('header.invalid-payload.signature')).toBeNull();
    });

    it('returns null when the role claim is not a string', () => {
      expect(getRoleFromToken(makeJwt({ role: ['student'] }))).toBeNull();
    });
  });
});
