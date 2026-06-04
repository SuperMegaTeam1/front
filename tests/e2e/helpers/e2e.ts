import type { Page } from '@playwright/test';
import type { Role } from '../../../src/types/user';

const DEFAULT_PASSWORD = 'Password123!';

export const STUDENT_AUTH_FILE = 'tests/e2e/.auth/student.json';
export const TEACHER_AUTH_FILE = 'tests/e2e/.auth/teacher.json';

const TEST_USERS = {
  student: {
    email: process.env.E2E_STUDENT_EMAIL ?? 'student_09-352_1@test.com',
    password: process.env.E2E_STUDENT_PASSWORD ?? DEFAULT_PASSWORD,
    homeUrl: /\/student\/home/,
  },
  teacher: {
    email: process.env.E2E_TEACHER_EMAIL ?? 'teacher1@test.com',
    password: process.env.E2E_TEACHER_PASSWORD ?? DEFAULT_PASSWORD,
    homeUrl: /\/teacher\/home/,
  },
} as const;

const stepDelayMs = Number(process.env.E2E_STEP_DELAY_MS ?? 500);

export function authFileFor(role: Role) {
  return role === 'student' ? STUDENT_AUTH_FILE : TEACHER_AUTH_FILE;
}

export async function slowStep(page: Page) {
  if (Number.isFinite(stepDelayMs) && stepDelayMs > 0) {
    await page.waitForTimeout(stepDelayMs);
  }
}

export async function loginAs(page: Page, role: Role) {
  const user = TEST_USERS[role];

  await page.goto('/login');
  await slowStep(page);

  await page.getByPlaceholder('ivanov.i').fill(user.email);
  await slowStep(page);

  await page.getByPlaceholder('••••••••').fill(user.password);
  await slowStep(page);

  await page.getByRole('button', { name: 'ВОЙТИ' }).click();
  await page.waitForURL(user.homeUrl, { timeout: 15000 });
  await slowStep(page);
}

export async function openProtectedPage(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await slowStep(page);
}
