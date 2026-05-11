'use client';

import { useMemo } from 'react';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { NotificationItem } from '@/components/shared/NotificationItem/NotificationItem';
import { PageHero } from '@/components/ui';
import { useStudentNotifications } from '@/lib/hooks/useNotifications';
import type { StudentNotificationResponse } from '@/lib/api/types';
import styles from './notifications.module.scss';

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function getGroupLabel(createdAt: string): string {
  const date = new Date(createdAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() === today.getTime()) return 'Сегодня';
  if (target.getTime() === yesterday.getTime()) return 'Вчера';
  return dateFormatter.format(date);
}

function groupByDay(notifications: StudentNotificationResponse[]) {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const groups = new Map<string, StudentNotificationResponse[]>();

  for (const notification of sorted) {
    const label = getGroupLabel(notification.createdAt);
    const bucket = groups.get(label) ?? [];
    bucket.push(notification);
    groups.set(label, bucket);
  }

  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

export default function StudentNotificationsPage() {
  const { data: notifications = [], isLoading, error } = useStudentNotifications();

  const groups = useMemo(() => groupByDay(notifications), [notifications]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Уведомления" />

        {isLoading ? (
          <p>Загружаем уведомления...</p>
        ) : error ? (
          <p>Не удалось загрузить уведомления</p>
        ) : groups.length === 0 ? (
          <p>Уведомлений пока нет</p>
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
                      time={timeFormatter.format(new Date(item.createdAt))}
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
