import { Stack, Typography } from '@mui/material';
import { StackCheckClient } from '@/components/stack-check/StackCheckClient';

export default function HomePage() {
  return (
    <main>
      <Stack
        spacing={3}
        sx={{
          minHeight: '100vh',
          maxWidth: 720,
          margin: '0 auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h3" component="h1">
            Мой ИВМИИТ
          </Typography>
          <Typography color="text.secondary">
            Страница для проверки.
          </Typography>
        </Stack>

        <StackCheckClient />
      </Stack>
    </main>
  );
}
