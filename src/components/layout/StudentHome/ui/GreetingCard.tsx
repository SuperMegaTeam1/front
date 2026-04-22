import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Box, Card, CardContent, Link as MuiLink, Stack, Typography } from '@mui/material';
import type { studentHomeGreeting } from '../model/mock';

type GreetingCardProps = {
  greeting: typeof studentHomeGreeting;
};

export function GreetingCard({ greeting }: GreetingCardProps) {
  const highlightedText = '3 занятия сегодня';
  const highlightedIndex = greeting.subtitle.indexOf(highlightedText);
  const beforeHighlight = highlightedIndex >= 0
    ? greeting.subtitle.slice(0, highlightedIndex)
    : greeting.subtitle;
  const afterHighlight = highlightedIndex >= 0
    ? greeting.subtitle.slice(highlightedIndex + highlightedText.length)
    : '';

  return (
    <Card
      elevation={0}
      sx={{
        border: 'none',
        borderRadius: 1,
        backgroundColor: '#E9EEF2',
        boxShadow: '0 10px 24px rgba(159, 173, 194, 0.08)',
      }}
    >
      <CardContent sx={{ px: { xs: 2.5, md: 3.5 }, py: { xs: 2.5, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 0.5,
                color: '#2F383C',
                fontSize: { xs: '2rem', md: '2.2rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              {greeting.title}
            </Typography>
            <Typography sx={{ color: '#94A4BA', fontSize: '0.95rem' }}>
              {beforeHighlight}
              {highlightedIndex >= 0 ? (
                <Box component="span" sx={{ color: '#35708A', fontWeight: 700 }}>
                  {highlightedText}
                </Box>
              ) : null}
              {afterHighlight}
            </Typography>
          </Box>

          <MuiLink
            href={greeting.actionHref}
            underline="none"
            sx={{
              alignSelf: { xs: 'flex-start', md: 'center' },
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: '#35708A',
              fontSize: '0.95rem',
              fontWeight: 700,
            }}
          >
            {greeting.actionLabel}
            <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
          </MuiLink>
        </Stack>
      </CardContent>
    </Card>
  );
}
