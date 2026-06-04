import { test as setup } from '@playwright/test';
import { authFileFor, loginAs } from './helpers/e2e';

setup.describe.configure({ mode: 'serial' });

setup('сохраняет сессию студента', async ({ page }) => {
  await loginAs(page, 'student');
  await page.context().storageState({ path: authFileFor('student') });
});

setup('сохраняет сессию преподавателя', async ({ page }) => {
  await loginAs(page, 'teacher');
  await page.context().storageState({ path: authFileFor('teacher') });
});
