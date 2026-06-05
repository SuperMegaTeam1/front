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

  test('Преподаватель открывает занятие из расписания', async ({ page }) => {
    await openProtectedPage(page, '/teacher/schedule');

    const weekTab = page.getByRole('tab', { name: 'Неделя' });
    await weekTab.click();
    await expect(weekTab).toHaveAttribute('aria-selected', 'true');
    await slowStep(page);

    const lessonButton = page.getByRole('button', { name: /Открыть занятие:/ }).first();
    await expect(lessonButton).toBeVisible({ timeout: 15000 });
    await lessonButton.scrollIntoViewIfNeeded();
    await lessonButton.click();

    await expect(page).toHaveURL(/\/teacher\/lesson\/[^/?]+/);
    await expect(page.getByText('Не удалось определить группы занятия')).toHaveCount(0);
    await expect(page.getByText('Не удалось загрузить данные занятия')).toHaveCount(0);
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('Страница предметов отображается', async ({ page }) => {
    await openProtectedPage(page, '/teacher/subjects');

    await expect(page.getByRole('heading', { name: 'Мои предметы' })).toBeVisible();
    await expect(page.getByText('Не удалось загрузить предметы преподавателя.')).toHaveCount(0);
    await expect(page.getByRole('link')).not.toHaveCount(0);
  });

  test('Преподаватель открывает журнал и готовит уведомление без отправки', async ({ page }) => {
    await openProtectedPage(page, '/teacher/subjects');

    const subjectsGrid = page.locator('section[aria-label="Выбор группы по предмету"]');
    await expect(subjectsGrid).toBeVisible({ timeout: 15000 });

    const groupLink = subjectsGrid.locator('a').first();
    await expect(groupLink).toBeVisible();
    await groupLink.click();

    await expect(page).toHaveURL(/\/teacher\/subjects\/[^/]+\/[^/?]+/);
    await expect(page.getByRole('heading', { name: /Журнал группы/ })).toBeVisible();
    await expect(page.getByText('Не удалось загрузить журнал группы.')).toHaveCount(0);

    const gradeInput = page.getByLabel(/Оценка студента/).first();
    if (await gradeInput.count() > 0 && await gradeInput.isVisible()) {
      const currentValue = await gradeInput.inputValue();
      await gradeInput.fill(currentValue);
      await slowStep(page);
    }

    await page.getByRole('link', { name: 'Сообщения' }).first().click();
    await expect(page).toHaveURL(/\/teacher\/messages/);
    await expect(page.getByRole('heading', { name: 'Уведомления' })).toBeVisible();

    const composer = page.locator('section[aria-label="Отправить уведомление студентам"]');
    const groupButton = composer.getByRole('button').filter({ hasText: /^\d{2}-\d{3}$/ }).first();
    const messageInput = page.getByLabel('Текст уведомления');
    const sendButton = composer.getByRole('button', { name: /Отправить/ });

    await expect(sendButton).toBeDisabled();
    await expect(groupButton).toBeVisible({ timeout: 15000 });
    await groupButton.click();
    await expect(groupButton).toHaveAttribute('aria-pressed', 'true');
    await slowStep(page);

    await messageInput.fill('Тестовое уведомление для проверки e2e. Не отправляем.');
    await expect(sendButton).toBeEnabled();
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
