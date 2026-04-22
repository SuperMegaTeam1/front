import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import type { performanceSubjects, performanceSummary } from '../model/mock';

type PerformanceSectionProps = {
  summary: typeof performanceSummary;
  subjects: typeof performanceSubjects;
};

export function PerformanceSection({
  summary,
  subjects,
}: PerformanceSectionProps) {
  return (
    <Stack spacing={2.25}>
      <Typography variant="h4" sx={{ color: '#2F383C', fontSize: '2rem', fontWeight: 700 }}>
        Успеваемость и рейтинг
      </Typography>

      <Card
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: '#E8EEF1',
          borderRadius: 1,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 18px 34px rgba(159, 173, 194, 0.12)',
          width: { lg: 'calc(100% + 20px)' },
          ml: { lg: -1.25 },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ minHeight: 152 }}>
            <Stack
              spacing={2.5}
              sx={{
                flex: 1,
                p: 3,
                borderRight: { xs: 'none', md: '1px solid #EEF2F4' },
                borderBottom: { xs: '1px solid #EEF2F4', md: 'none' },
              }}
            >
              <Stack
                direction="row"
                alignItems="flex-end"
                justifyContent="space-between"
                spacing={3}
                sx={{ width: '100%' }}
              >
                <Stack spacing={0.5}>
                  <Typography
                    sx={{
                      color: '#35708A',
                      fontSize: { xs: '2rem', md: '3.05rem' },
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {summary.score}
                  </Typography>
                  <Typography sx={{ color: '#94A4BA', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    {summary.scoreLabel}
                  </Typography>
                </Stack>

                <Stack spacing={0.5} sx={{ minWidth: 88, mr: { md: -0.75 } }}>
                  <Typography sx={{ color: '#2F383C', fontSize: '1.7rem', fontWeight: 700, lineHeight: 1 }}>
                    {summary.position}
                  </Typography>
                  <Typography sx={{ color: '#94A4BA', fontSize: '0.8rem' }}>
                    {summary.positionLabel}
                  </Typography>
                </Stack>
              </Stack>

              <Box
                component="a"
                href={summary.actionHref}
                sx={{
                  color: '#35708A',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                {summary.actionLabel} →
              </Box>
            </Stack>

            <Stack spacing={2.3} sx={{ flex: 1, p: 3 }}>
              {subjects.map((subject) => (
                <Stack key={subject.title} direction="row" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ color: '#2F383C', fontWeight: 700 }}>
                    {subject.title}
                  </Typography>
                  <Typography sx={{ color: '#94A4BA', fontSize: '1.1rem', fontWeight: 700 }}>
                    {subject.score}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
