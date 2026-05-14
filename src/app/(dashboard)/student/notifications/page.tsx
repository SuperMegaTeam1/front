'use client';

import { useEffect, useRef } from 'react';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { NotificationItem } from '@/components/shared/NotificationItem/NotificationItem';
import { PageHero } from '@/components/ui';
import type { StudentNotificationResponse } from '@/lib/api/types';
import {
  useMarkAllStudentNotificationsAsRead,
  useStudentNotifications,
} from '@/lib/hooks/useNotifications';
import styles from './notifications.module.scss';

interface NotificationGroup {
  label: string;
  items: StudentNotificationResponse[];
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getGroupLabel(createdAt: string) {
  const date = new Date(createdAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (formatDateKey(date) === formatDateKey(today)) {
    return 'Сегодня';
  }

  if (formatDateKey(date) === formatDateKey(yesterday)) {
    return 'Вчера';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function formatTime(createdAt: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(createdAt));
}

function groupNotifications(notifications: StudentNotificationResponse[]) {
  return notifications.reduce<NotificationGroup[]>((groups, notification) => {
    const label = getGroupLabel(notification.createdAt);
    const existingGroup = groups.find((group) => group.label === label);

    if (existingGroup) {
      existingGroup.items.push(notification);
      return groups;
    }

    groups.push({ label, items: [notification] });
    return groups;
  }, []);
}

export default function StudentNotificationsPage() {
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useStudentNotifications();
  const { mutate: markAllAsRead } = useMarkAllStudentNotificationsAsRead();
  const groups = groupNotifications(notifications);
  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);
  const hasTriggeredMarkAllRef = useRef(false);

  useEffect(() => {
    if (isLoading || error || !hasUnreadNotifications || hasTriggeredMarkAllRef.current) {
      return;
    }

    hasTriggeredMarkAllRef.current = true;
    markAllAsRead();
  }, [error, hasUnreadNotifications, isLoading, markAllAsRead]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Уведомления" />

        {isLoading ? (
          <section className={styles.stateCard}>Загружаем уведомления...</section>
        ) : error ? (
          <section className={styles.stateCard}>Не удалось загрузить уведомления.</section>
        ) : groups.length === 0 ? (
          <section className={styles.stateCard}>Уведомлений пока нет.</section>
        ) : (
          <div className={styles.groups}>
            {groups.map((group) => (
              <section key={group.label} className={styles.group}>
                <p className={styles.groupLabel}>{group.label}</p>
                <div className={styles.groupItems}>
                  {group.items.map((item) => (
                    <NotificationItem
                      key={item.id}
                      title={item.title}
                      message={item.messageBody}
                      time={formatTime(item.createdAt)}
                      icon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 24 }} />}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
