'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getStudentNotifications,
  markAsRead,
  sendNotification,
  sendTeacherMessage,
} from '@/lib/api/notifications.api';
import type { SendNotificationPayload } from '@/types/notification';
import type { TeacherMessageRequest } from '@/lib/api/types';

export const unreadCountQueryKey = ['notifications', 'unread-count'] as const;

/** Хук: список уведомлений с пагинацией */
export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ['notifications', page],
    queryFn: () => getNotifications(page).then((res) => res.data),
  });
}

/** Хук: список уведомлений текущего студента */
export function useStudentNotifications() {
  return useQuery({
    queryKey: ['notifications', 'student', 'me'],
    queryFn: () => getStudentNotifications().then((res) => res.data),
  });
}

/** Хук: счётчик непрочитанных (обновляется каждые 30 сек) */
export function useUnreadCount() {
  return useQuery({
    queryKey: unreadCountQueryKey,
    // Временная заглушка, пока /notifications/unread-count не реализован на бэке.
    queryFn: async () => 0,
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

/** Хук: отправка сообщения преподавателя группе(ам) — по одному запросу на группу */
export function useSendTeacherMessage() {
  return useMutation({
    mutationFn: async (input: { groupIds: string[]; title: string; body: string }) => {
      const requests: TeacherMessageRequest[] = input.groupIds.map((groupId) => ({
        groupId,
        title: input.title,
        body: input.body,
      }));

      return Promise.all(requests.map((req) => sendTeacherMessage(req)));
    },
  });
}
