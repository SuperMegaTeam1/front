'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudentNotifications,
  getNotifications,
  markAllStudentNotificationsAsRead,
  markAsRead,
  sendNotification,
  sendTeacherMessage,
} from '@/lib/api/notifications.api';
import type { StudentNotificationResponse, TeacherMessageRequest } from '@/lib/api/types';
import type { SendNotificationPayload } from '@/types/notification';

export const studentNotificationsQueryKey = ['notifications', 'student', 'me'] as const;

/** Хук: список уведомлений с пагинацией */
export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ['notifications', page],
    queryFn: () => getNotifications(page).then((res) => res.data),
  });
}

export function useStudentNotifications() {
  return useQuery({
    queryKey: studentNotificationsQueryKey,
    queryFn: () => getStudentNotifications().then((res) => res.data),
  });
}

/** Хук: счётчик непрочитанных (обновляется каждые 30 сек) */
export function useUnreadCount() {
  const notificationsQuery = useStudentNotifications();

  return {
    ...notificationsQuery,
    data: notificationsQuery.data?.filter((notification) => !notification.isRead).length ?? 0,
  };
}

export function useMarkAllStudentNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllStudentNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData<StudentNotificationResponse[]>(
        studentNotificationsQueryKey,
        (notifications) => notifications?.map((notification) => ({
          ...notification,
          isRead: true,
        })) ?? notifications,
      );
    },
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

export function useSendTeacherMessage() {
  return useMutation({
    mutationFn: async (input: { groupIds: string[]; title: string; body: string }) => {
      const requests: TeacherMessageRequest[] = input.groupIds.map((groupId) => ({
        groupId,
        title: input.title,
        body: input.body,
      }));

      return Promise.all(requests.map((request) => sendTeacherMessage(request)));
    },
  });
}
