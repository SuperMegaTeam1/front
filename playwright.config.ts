import { defineConfig, devices } from '@playwright/test';
import { STUDENT_AUTH_FILE, TEACHER_AUTH_FILE } from './tests/e2e/helpers/e2e';

const slowMo = Number(process.env.E2E_SLOW_MO_MS ?? 0);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: Number(process.env.E2E_WORKERS ?? 1),
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: Number.isFinite(slowMo) ? slowMo : 0,
    },
  },
  projects: [
    {
      name: 'public',
      testMatch: /auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'student',
      testMatch: /student.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STUDENT_AUTH_FILE,
      },
    },
    {
      name: 'teacher',
      testMatch: /teacher.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: TEACHER_AUTH_FILE,
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
