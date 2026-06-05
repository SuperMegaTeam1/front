import type { StudentNotificationResponse } from '@/lib/api/types';
import { formatTimeHM, getRelativeDayKind } from './relativeDate';

export interface NotificationGroup {
  label: string;
  items: StudentNotificationResponse[];
}

const longDateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' });
const shortDateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' });

/** Заголовок группы на странице уведомлений: «Сегодня» / «Вчера» / «d month». */
export function getNotificationGroupLabel(createdAt: string): string {
  const date = new Date(createdAt);
  const kind = getRelativeDayKind(date);

  if (kind === 'today') {
    return 'Сегодня';
  }

  if (kind === 'yesterday') {
    return 'Вчера';
  }

  return longDateFormatter.format(date);
}

/** Время уведомления в формате ЧЧ:ММ (для NotificationItem на странице уведомлений). */
export function formatNotificationTime(createdAt: string): string {
  return formatTimeHM(new Date(createdAt));
}

/** Относительная метка для ленты на главной: ЧЧ:ММ сегодня, «Вчера», иначе «d mon». */
export function formatNotificationTimestamp(createdAt: string): string {
  const date = new Date(createdAt);
  const kind = getRelativeDayKind(date);

  if (kind === 'today') {
    return formatTimeHM(date);
  }

  if (kind === 'yesterday') {
    return 'Вчера';
  }

  return shortDateFormatter.format(date);
}

/** Группирует уведомления по дню (Сегодня / Вчера / дата) с сохранением порядка. */
export function groupNotifications(notifications: StudentNotificationResponse[]): NotificationGroup[] {
  return notifications.reduce<NotificationGroup[]>((groups, notification) => {
    const label = getNotificationGroupLabel(notification.createdAt);
    const existingGroup = groups.find((group) => group.label === label);

    if (existingGroup) {
      existingGroup.items.push(notification);
      return groups;
    }

    groups.push({ label, items: [notification] });
    return groups;
  }, []);
}
