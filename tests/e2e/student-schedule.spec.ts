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

  test('Студент проходит основные разделы через навигацию', async ({ page }) => {
    await openProtectedPage(page, '/student/home');

    const mainNav = page.getByRole('navigation', { name: 'Основная навигация студента' });

    await mainNav.getByRole('link', { name: 'Расписание' }).click();
    await expect(page).toHaveURL(/\/student\/schedule/);
    await expect(page.getByRole('heading', { name: 'Расписание' })).toBeVisible();
    await slowStep(page);

    await mainNav.getByRole('link', { name: 'Рейтинг' }).click();
    await expect(page).toHaveURL(/\/student\/rating/);
    await expect(page.getByRole('heading', { name: /Рейтинг группы/ })).toBeVisible();
    await slowStep(page);

    await page.getByRole('link', { name: 'Уведомления' }).first().click();
    await expect(page).toHaveURL(/\/student\/notifications/);
    await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible();
    await slowStep(page);

    await page.locator('a[href="/student/profile"]').first().click();
    await expect(page).toHaveURL(/\/student\/profile/);
    await expect(page.getByRole('heading', { name: 'Профиль' })).toBeVisible();
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

  test('Студент листает расписание и открывает страницу предмета', async ({ page }) => {
    await openProtectedPage(page, '/student/schedule');

    const weekTab = page.getByRole('tab', { name: 'Неделя' });
    await weekTab.click();
    await expect(weekTab).toHaveAttribute('aria-selected', 'true');
    await slowStep(page);

    await page.getByRole('button', { name: 'Следующая неделя' }).click();
    await slowStep(page);
    await page.getByRole('button', { name: 'Предыдущая неделя' }).click();
    await slowStep(page);

    const subjectButton = page.getByRole('button', { name: /Перейти к / }).first();
    await expect(subjectButton).toBeVisible({ timeout: 15000 });
    await subjectButton.scrollIntoViewIfNeeded();
    await subjectButton.click();

    await expect(page).toHaveURL(/\/student\/subjects\/[^/]+/);
    await expect(page.getByText('Текущая успеваемость')).toBeVisible();
    await expect(page.getByText('Журнал баллов')).toBeVisible();
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

  test('Студент фильтрует рейтинг по предмету', async ({ page }) => {
    await openProtectedPage(page, '/student/rating');

    const filterCard = page.locator('article').filter({ hasText: 'Фильтр по предметам' });
    await expect(filterCard).toBeVisible();

    const subjectFilter = filterCard.getByRole('button').nth(1);
    await expect(subjectFilter).toBeVisible({ timeout: 15000 });

    const subjectName = (await subjectFilter.textContent())?.trim() ?? '';
    expect(subjectName.length).toBeGreaterThan(0);

    await subjectFilter.click();
    await slowStep(page);

    await expect(subjectFilter).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByText(/Рейтинг по предмету/)).toBeVisible();

    const showMoreButton = page.getByRole('button', { name: 'Показать больше' });
    if (await showMoreButton.count() > 0 && await showMoreButton.isVisible()) {
      await showMoreButton.click();
      await slowStep(page);
      await expect(page.getByRole('button', { name: 'Свернуть' })).toBeVisible();
    }
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
