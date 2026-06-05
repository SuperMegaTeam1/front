'use client';

import { useEffect, useRef } from 'react';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { NotificationItem } from '@/components/shared/NotificationItem/NotificationItem';
import { PageHero } from '@/components/ui';
import {
  useMarkAllStudentNotificationsAsRead,
  useStudentNotifications,
} from '@/lib/hooks/useNotifications';
import { formatNotificationTime, groupNotifications } from '@/lib/utils/notificationGroups';
import styles from './notifications.module.scss';

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
                      time={formatNotificationTime(item.createdAt)}
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
