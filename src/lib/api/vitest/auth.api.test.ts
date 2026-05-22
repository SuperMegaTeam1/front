import { describe, expect, it } from 'vitest';
import { getRoleFromToken } from '@/lib/api/auth.api';

function makeJwt(payload: Record<string, unknown>) {
  const base64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `header.${base64}.signature`;
}

describe('auth api utils', () => {
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
