import api from './axios';
import type {
  StudentNotificationResponse,
  TeacherMessageRequest,
  TeacherMessageResponse,
} from './types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Notification, SendNotificationPayload } from '@/types/notification';

export const getStudentNotifications = () =>
  api.get<StudentNotificationResponse[]>('/notification');

export const markAllStudentNotificationsAsRead = () =>
  api.patch('/read-all');

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

export const sendTeacherMessage = (payload: TeacherMessageRequest) =>
  api.post<TeacherMessageResponse>('/teacher-message', payload);
