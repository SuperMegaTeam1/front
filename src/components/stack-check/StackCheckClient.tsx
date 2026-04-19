'use client';

import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useNotificationStore } from '@/stores/useNotificationStore';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function StackCheckClient() {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const decrementUnread = useNotificationStore((state) => state.decrementUnread);

  const demoQuery = useQuery({
    queryKey: ['stack-check'],
    queryFn: async () => {
      await wait(150);

      return {
        status: 'ok',
        source: 'react-query mock',
      };
    },
  });

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">Проверка подключения</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip color="primary" label="App Router" />
            <Chip color="primary" label="MUI theme" />
            <Chip color="primary" label="React Query" />
            <Chip color="primary" label="Zustand" />
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle1">React Query</Typography>
            <Typography color="text.secondary">
              Статус: {demoQuery.isLoading ? 'loading' : demoQuery.data?.status ?? 'idle'}
            </Typography>
            <Typography color="text.secondary">
              Источник: {demoQuery.data?.source ?? 'ожидание'}
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle1">Zustand</Typography>
            <Typography color="text.secondary">
              Непрочитанных уведомлений в сторе: {unreadCount}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={() => setUnreadCount(3)}>
                set 3
              </Button>
              <Button variant="outlined" onClick={decrementUnread}>
                minus 1
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
