import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { recentUpdates } from '../model/mock';

type RecentChangesSectionProps = {
  updates: typeof recentUpdates;
};

function getIconTone(index: number) {
  const tones = [
    { background: '#bfe6fb', color: '#4f91ba' },
    { background: '#d8e4e9', color: '#6f8590' },
    { background: '#cfddf8', color: '#5f77a8' },
    { background: '#bfe2fb', color: '#4e8fb5' },
  ];

  return tones[index] ?? tones[0];
}

export function RecentChangesSection({ updates }: RecentChangesSectionProps) {
  return (
    <Stack spacing={2.25}>
      <Typography variant="h4" sx={{ color: '#2F383C', fontSize: '2rem', fontWeight: 700 }}>
        Последние изменения
      </Typography>

      <Card
        elevation={0}
        sx={{
          border: 'none',
          borderRadius: 1,
          backgroundColor: '#E9EEF2',
          boxShadow: '0 18px 34px rgba(159, 173, 194, 0.12)',
          width: { lg: 'calc(100% + 20px)' },
          ml: { lg: -1.25 },
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.75 } }}>
          <Stack spacing={2.25}>
            {updates.map((update, index) => {
              const Icon = update.icon;
              const iconTone = getIconTone(index);
              const iconSize = 30;

              return (
                <Stack key={update.title} direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: iconSize,
                      height: iconSize,
                      borderRadius: '10px',
                      backgroundColor: iconTone.background,
                      color: iconTone.color,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    <Icon sx={{ fontSize: 20, mt: '-1px' }} />
                  </Box>

                  <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.1}>
                    <Typography sx={{ color: '#2F383C', fontWeight: 700, lineHeight: 1.2 }}>
                      {update.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94A4BA',
                        fontSize: '0.82rem',
                        lineHeight: 1.15,
                      }}
                    >
                      {update.description}
                    </Typography>
                  </Stack>

                  <Typography variant="caption" sx={{ whiteSpace: 'nowrap', pt: 0.5, color: '#94A4BA' }}>
                    {update.time}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
