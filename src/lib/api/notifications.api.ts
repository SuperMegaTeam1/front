import api from './axios';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Notification, SendNotificationPayload } from '@/types/notification';

/** Список уведомлений текущего пользователя */
export const getNotifications = (page = 1, pageSize = 20) =>
  api.get<PaginatedResponse<Notification>>('/notifications', {
    params: { page, pageSize },
  });

/** Количество непрочитанных */
export const getUnreadCount = () =>
  api.get<ApiResponse<number>>('/notifications/unread-count');

/** Отметить уведомление как прочитанное */
export const markAsRead = (id: number) =>
  api.patch(`/notifications/${id}/read`);

/** Отправить уведомление группе (преподаватель) */
export const sendNotification = (payload: SendNotificationPayload) =>
  api.post('/notifications/send', payload);
