'use client';

import type { ReactNode } from 'react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { Typography } from '@mui/material';
import { NotificationItem } from '@/components/shared/NotificationItem/NotificationItem';
import styles from './notifications.module.scss';

interface NotificationEntry {
  id: number;
  title: string;
  message: string;
  time: string;
  icon: ReactNode;
}

interface NotificationGroup {
  label: string;
  items: NotificationEntry[];
}

const NOTIFICATION_GROUPS: NotificationGroup[] = [
  {
    label: 'Сегодня',
    items: [
      {
        id: 1,
        title: 'Матанализ, Дубровин В.Д.',
        message: 'Вам выставили 10 баллов',
        time: '10:24',
        icon: <DescriptionOutlinedIcon sx={{ fontSize: 24 }} />,
      },
    ],
  },
  {
    label: 'Вчера',
    items: [
      {
        id: 2,
        title: 'Матанализ, Дубровин В.Д.',
        message: 'Пара будет в 901 кабинете',
        time: '10:32',
        icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 24 }} />,
      },
    ],
  },
];

export default function StudentNotificationsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <Typography component="h1" className={styles.title}>
            Уведомления
          </Typography>
        </section>

        <div className={styles.groups}>
          {NOTIFICATION_GROUPS.map((group) => (
            <section key={group.label} className={styles.group}>
              <p className={styles.groupLabel}>{group.label}</p>
              <div className={styles.groupItems}>
                {group.items.map((item) => (
                  <NotificationItem
                    key={item.id}
                    title={item.title}
                    message={item.message}
                    time={item.time}
                    icon={item.icon}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
