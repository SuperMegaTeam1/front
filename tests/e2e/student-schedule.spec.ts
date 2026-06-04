import { test, expect } from '@playwright/test';
import { openProtectedPage, slowStep } from './helpers/e2e';

test.describe('Кабинет студента', () => {
  test('Главная страница открывается из сохраненной сессии', async ({ page }) => {
    await openProtectedPage(page, '/student/home');

    await expect(page).toHaveURL(/\/student\/home/);
    await expect(page.getByRole('heading', { name: /Добрый день/ })).toBeVisible();
  });

  test('Расписание студента отображается', async ({ page }) => {
    await openProtectedPage(page, '/student/schedule');

    await expect(page.getByRole('heading', { name: 'Расписание' })).toBeVisible();
    await expect(page.getByText('Не удалось загрузить расписание')).toHaveCount(0);
  });

  test('Переключатель расписания сегодня/неделя работает', async ({ page }) => {
    await openProtectedPage(page, '/student/schedule');

    const todayTab = page.getByRole('tab', { name: 'Сегодня' });
    const weekTab = page.getByRole('tab', { name: 'Неделя' });

    await expect(todayTab).toHaveAttribute('aria-selected', 'true');
    await weekTab.click();
    await slowStep(page);
    await expect(weekTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Не удалось загрузить неделю')).toHaveCount(0);
  });

  test('Уведомления студента открываются', async ({ page }) => {
    await openProtectedPage(page, '/student/notifications');

    await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible();
    await expect(page.getByText('Не удалось загрузить уведомления.')).toHaveCount(0);
  });

  test('Рейтинг группы открывается', async ({ page }) => {
    await openProtectedPage(page, '/student/rating');

    await expect(page.getByRole('heading', { name: /Рейтинг группы/ })).toBeVisible();
    await expect(page.getByText('Не удалось загрузить рейтинг')).toHaveCount(0);
  });

  test('Профиль студента открывается и выход переводит на логин', async ({ page }) => {
    await openProtectedPage(page, '/student/profile');

    await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
    await expect(page.getByText('Университетская почта')).toBeVisible();

    await page.getByRole('button', { name: 'Выйти из аккаунта' }).click();
    await page.waitForURL(/\/login/);
    await slowStep(page);

    await page.goto('/student/home');
    await expect(page).toHaveURL(/\/login/);
  });
});
