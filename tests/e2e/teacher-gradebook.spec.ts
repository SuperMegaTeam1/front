import { test, expect } from '@playwright/test';
import { openProtectedPage, slowStep } from './helpers/e2e';

test.describe('Кабинет преподавателя', () => {
  test('Главная страница открывается из сохраненной сессии', async ({ page }) => {
    await openProtectedPage(page, '/teacher/home');

    await expect(page).toHaveURL(/\/teacher\/home/);
    await expect(page.getByRole('heading', { name: /Добрый день/ })).toBeVisible();
  });

  test('Расписание преподавателя отображается', async ({ page }) => {
    await openProtectedPage(page, '/teacher/schedule');

    await expect(page.getByRole('heading', { name: 'Расписание' })).toBeVisible();
    await expect(page.getByText('Не удалось загрузить расписание')).toHaveCount(0);

    const weekTab = page.getByRole('tab', { name: 'Неделя' });
    await weekTab.click();
    await slowStep(page);
    await expect(weekTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByText('Не удалось загрузить неделю')).toHaveCount(0);
  });

  test('Страница предметов отображается', async ({ page }) => {
    await openProtectedPage(page, '/teacher/subjects');

    await expect(page.getByRole('heading', { name: 'Мои предметы' })).toBeVisible();
    await expect(page.getByText('Не удалось загрузить предметы преподавателя.')).toHaveCount(0);
    await expect(page.getByRole('link')).not.toHaveCount(0);
  });

  test('Страница отправки уведомлений открывается', async ({ page }) => {
    await openProtectedPage(page, '/teacher/messages');

    await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible();
    await expect(page.getByText('Не удалось загрузить группы')).toHaveCount(0);
    await expect(page.getByPlaceholder('Введите важное уведомление для студентов...')).toBeVisible();
  });

  test('Профиль преподавателя открывается', async ({ page }) => {
    await openProtectedPage(page, '/teacher/profile');

    await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
    await expect(page.getByText('Преподаватель')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Выйти из аккаунта' })).toBeVisible();
  });
});
