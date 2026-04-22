import { Box } from '@mui/material';
import { Header } from '@/components/layout/Header/Header';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #fbfdfe 0%, #f6f9fb 100%)',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
