/** Тип уведомления */
export type NotificationType = 'grade' | 'message';

/** Уведомление */
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO 8601
}

/** Данные для отправки уведомления группе (преподаватель) */
export interface SendNotificationPayload {
  groupId: number;
  title: string;
  message: string;
}
