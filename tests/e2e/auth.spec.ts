import { test, expect } from '@playwright/test';

test.describe('Авторизация', () => {
  test('Страница логина отображается', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h4')).toContainText('Мой ИВМиИТ');
    await expect(page.locator('input[name="login"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('Показывает ошибку при пустых полях', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Введите логин')).toBeVisible();
  });
});
