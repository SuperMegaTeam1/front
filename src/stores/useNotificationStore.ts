import { create } from 'zustand';

interface NotificationState {
  /** Количество непрочитанных уведомлений */
  unreadCount: number;
  /** Установить счётчик */
  setUnreadCount: (count: number) => void;
  /** Уменьшить на 1 (при прочтении) */
  decrementUnread: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  unreadCount: 0,

  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: () =>
    set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
}));
