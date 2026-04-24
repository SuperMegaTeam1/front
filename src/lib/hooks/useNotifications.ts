'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  sendNotification,
} from '@/lib/api/notifications.api';
import { useNotificationStore } from '@/stores/useNotificationStore';
import type { SendNotificationPayload } from '@/types/notification';

/** Хук: список уведомлений с пагинацией */
export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ['notifications', page],
    queryFn: () => getNotifications(page).then((res) => res.data),
  });
}

/** Хук: счётчик непрочитанных (обновляется каждые 30 сек) */
export function useUnreadCount() {
  const { setUnreadCount } = useNotificationStore();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const res = await getUnreadCount();
      setUnreadCount(res.data.data);
      return res.data.data;
    },
    refetchInterval: 30_000, // каждые 30 секунд
  });
}

/** Хук: отметить как прочитанное */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/** Хук: отправить уведомление группе (преподаватель) */
export function useSendNotification() {
  return useMutation({
    mutationFn: (payload: SendNotificationPayload) => sendNotification(payload),
  });
}
