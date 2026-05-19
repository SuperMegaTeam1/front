'use client';

import { useStudentNotifications } from '@/lib/hooks/useNotifications';

export function StudentNotificationsBootstrap() {
  useStudentNotifications();

  return null;
}
