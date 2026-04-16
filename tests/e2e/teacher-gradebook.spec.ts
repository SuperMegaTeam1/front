import { test, expect } from '@playwright/test';

test.describe('Журнал преподавателя', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Добавить setup авторизации преподавателя
    await page.goto('/teacher/subjects');
  });

  test('Страница предметов отображается', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Мои предметы');
  });
});
