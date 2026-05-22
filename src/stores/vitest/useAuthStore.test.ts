import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { User } from '@/types/user';
import { useAuthStore } from '@/stores/useAuthStore';

const AUTH_STORAGE_KEY = 'auth-storage';

const TEST_USER: User = {
  id: 'user-1',
  login: 'student@example.com',
  firstName: 'Ivan',
  lastName: 'Petrov',
  patronymic: 'Sergeevich',
  role: 'student',
  email: 'student@example.com',
  studentId: 'student-1',
  teacherId: null,
  groupId: 'group-1',
  groupName: '09-352',
};

function resetAuthStore() {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    hasHydrated: false,
  });
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

describe('useAuthStore', () => {
  beforeEach(() => {
    resetAuthStore();
  });

  afterEach(() => {
    resetAuthStore();
  });

  it('starts with an unauthenticated state', () => {
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,
    });
  });

  it('stores the authenticated user and tokens via setAuth', () => {
    useAuthStore.getState().setAuth(TEST_USER, 'access-token', 'refresh-token');

    expect(useAuthStore.getState()).toMatchObject({
      user: TEST_USER,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      isAuthenticated: true,
    });
  });

  it('clears the auth session on logout', () => {
    useAuthStore.getState().setAuth(TEST_USER, 'access-token', 'refresh-token');

    useAuthStore.getState().logout();

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  });

  it('updates only the access token via setAccessToken', () => {
    useAuthStore.getState().setAuth(TEST_USER, 'old-token', 'refresh-token');

    useAuthStore.getState().setAccessToken('new-token');

    expect(useAuthStore.getState()).toMatchObject({
      user: TEST_USER,
      accessToken: 'new-token',
      refreshToken: 'refresh-token',
      isAuthenticated: true,
    });
  });

  it('returns the current role through getRole', () => {
    expect(useAuthStore.getState().getRole()).toBeNull();

    useAuthStore.getState().setAuth(TEST_USER, 'access-token', 'refresh-token');

    expect(useAuthStore.getState().getRole()).toBe('student');
  });

  it('marks the store as hydrated via setHasHydrated', () => {
    useAuthStore.getState().setHasHydrated(true);

    expect(useAuthStore.getState().hasHydrated).toBe(true);
  });
});
