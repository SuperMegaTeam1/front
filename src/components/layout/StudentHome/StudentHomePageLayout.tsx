import { Box, Stack } from '@mui/material';
import {
  performanceSubjects,
  performanceSummary,
  previousLessons,
  recentUpdates,
  studentHomeGreeting,
  todayLessons,
  nextLessons,
} from './model/mock';
import { GreetingCard } from './ui/GreetingCard';
import { PerformanceSection } from './ui/PerformanceSection';
import { RecentChangesSection } from './ui/RecentChangesSection';
import { TodayLessonsSection } from './ui/TodayLessonsSection';

export function StudentHomePageLayout() {
  return (
    <Box
      sx={{
        maxWidth: 1320,
        mx: 'auto',
        px: { xs: 0, lg: 1.5 },
        pt: { xs: 1, md: 2 },
        pb: { xs: 3, md: 5 },
      }}
    >
      <Stack spacing={{ xs: 3.5, md: 4.5 }}>
        <GreetingCard greeting={studentHomeGreeting} />
        <TodayLessonsSection lessons={todayLessons} previous={previousLessons} next={nextLessons} />
        <PerformanceSection summary={performanceSummary} subjects={performanceSubjects} />
        <RecentChangesSection updates={recentUpdates} />
      </Stack>
    </Box>
  );
}
