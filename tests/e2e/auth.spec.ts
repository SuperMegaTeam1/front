import { test, expect } from '@playwright/test';
import { slowStep } from './helpers/e2e';

test.describe('Авторизация', () => {
  test('Страница логина отображается', async ({ page }) => {
    await page.goto('/login');
    await slowStep(page);

    await expect(page.getByText('Мой ИВМиИТ')).toBeVisible();
    await expect(page.getByPlaceholder('ivanov.i')).toBeVisible();
    await expect(page.getByPlaceholder('••••••••')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ВОЙТИ' })).toBeVisible();
  });

  test('Показывает ошибку при пустых полях', async ({ page }) => {
    await page.goto('/login');
    await slowStep(page);
    await page.getByRole('button', { name: 'ВОЙТИ' }).click();
    await slowStep(page);

    await expect(page.getByText('Введите данные для входа')).toBeVisible();
  });
});
