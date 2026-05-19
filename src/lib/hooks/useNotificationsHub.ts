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

    connection.start().catch(() => undefined);

    return () => {
      connection.stop().catch(() => undefined);
    };
  }, [accessToken, hasHydrated, user, queryClient]);
}
