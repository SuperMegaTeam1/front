'use client';

import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import { useUiStore } from '@/stores/useUiStore';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function StackCheckClient() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

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
              Sidebar в сторе: {isSidebarOpen ? 'open' : 'closed'}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={toggleSidebar}>
                toggle
              </Button>
              <Button variant="outlined" onClick={() => setSidebarOpen(true)}>
                open
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
