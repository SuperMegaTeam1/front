'use client';

import { useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { HUB_URL } from '@/lib/api/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { studentNotificationsQueryKey } from './useNotifications';

export function useNotificationsHub() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated || !user || user.role !== 'student' || !accessToken) {
      return;
    }

    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => useAuthStore.getState().accessToken ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on('ReceiveNotification', () => {
      queryClient.invalidateQueries({ queryKey: studentNotificationsQueryKey });
    });

    // В dev (Strict Mode / Fast Refresh) эффект монтируется дважды,
    // и cleanup может вызвать stop() до завершения negotiate.
    // Чтобы не словить "The connection was stopped during negotiation",
    // стопаем коннект уже после успешного start().
    let isCancelled = false;

    connection
      .start()
      .then(() => {
        if (isCancelled) {
          void connection.stop().catch(() => undefined);
        }
      })
      .catch(() => undefined);

    return () => {
      isCancelled = true;
      if (connection.state === 'Connected') {
        void connection.stop().catch(() => undefined);
      }
    };
  }, [accessToken, hasHydrated, user, queryClient]);
}
