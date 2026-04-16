import { test, expect } from '@playwright/test';

test.describe('Расписание студента', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Добавить setup авторизации (inject token)
    await page.goto('/student/schedule');
  });

  test('Страница расписания отображается', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Расписание');
  });

  test('Переключатель день/неделя работает', async ({ page }) => {
    const dayButton = page.locator('button:has-text("День")');
    const weekButton = page.locator('button:has-text("Неделя")');
    await expect(dayButton).toBeVisible();
    await expect(weekButton).toBeVisible();
  });
});
