import { Stack, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <main>
      <Stack
        spacing={1}
        sx={{
          minHeight: '100vh',
          maxWidth: 720,
          margin: '0 auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Typography variant="h3" component="h1">
          Мой ИВМиИТ
        </Typography>
        <Typography color="text.secondary">
          Главная страница.
        </Typography>
      </Stack>
    </main>
  );
}
