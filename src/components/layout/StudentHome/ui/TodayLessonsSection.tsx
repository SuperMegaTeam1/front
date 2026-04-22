import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { previousLessons, todayLessons } from '../model/mock';

type Lesson = (typeof todayLessons)[number];
type SideLesson = (typeof previousLessons)[number];

type TodayLessonsSectionProps = {
  lessons: Lesson[];
  previous: SideLesson[];
  next: SideLesson[];
};

function CompactLessonCard({
  label,
  lessons,
  align,
}: {
  label: string;
  lessons: SideLesson[];
  align: 'left' | 'right';
}) {
  return (
    <Stack
      spacing={1.25}
      sx={{
        width: 182,
        opacity: 0.5,
        display: { xs: 'none', xl: 'flex' },
      }}
    >
      <Chip
        label={label}
        size="small"
        sx={{
          alignSelf: align === 'left' ? 'flex-start' : 'flex-end',
          height: 22,
          borderRadius: 1,
          bgcolor: '#B7DDF5',
          color: '#94A4BA',
          fontSize: '0.62rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      />

      {lessons.map((lesson) => (
        <Card
          key={`${label}-${lesson.time}-${lesson.title}`}
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: '#E8EEF1',
            borderRadius: 2,
            backgroundColor: '#FBFCFD',
            boxShadow: '0 12px 24px rgba(159, 173, 194, 0.12)',
            minHeight: 84,
          }}
        >
          <CardContent sx={{ px: 1.75, py: 1.6 }}>
            <Typography variant="caption" sx={{ color: '#B0BBC8' }}>
              {lesson.time}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: '#667076',
                fontSize: '0.95rem',
                lineHeight: 1.25,
              }}
            >
              {lesson.title}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

function MainLessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: '#E8EEF1',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 20px 35px rgba(159, 173, 194, 0.16)',
      }}
    >
      <CardContent sx={{ px: { xs: 2, md: 2.5 }, py: { xs: 2.25, md: 2.5 } }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Typography
            variant="body2"
            sx={{
              minWidth: 112,
              color: '#94A4BA',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            {lesson.time}
          </Typography>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 0.35,
                color: '#2F383C',
                fontSize: '1.08rem',
                fontWeight: 700,
              }}
            >
              {lesson.title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0BBC8', fontSize: '0.82rem' }}>
              {lesson.description}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              minWidth: 82,
              textAlign: 'right',
              color: '#94A4BA',
              fontSize: '0.9rem',
            }}
          >
            {lesson.room}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function TodayLessonsSection({
  lessons,
  previous,
  next,
}: TodayLessonsSectionProps) {
  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Chip
          label="Пары сегодня"
          sx={{
            height: 34,
            px: 1.75,
            borderRadius: 1,
            bgcolor: '#B7DDF5',
            color: '#35708A',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        />
      </Box>

      <Stack direction="row" spacing={2.5} alignItems="center" justifyContent="center">
        <CompactLessonCard label="Вчера" lessons={previous} align="left" />

        <IconButton
          size="small"
          sx={{
            width: 30,
            height: 30,
            bgcolor: '#B7DDF5',
            color: '#35708A',
            borderRadius: 1,
            boxShadow: '0 8px 18px rgba(183, 221, 245, 0.42)',
            display: { xs: 'none', md: 'inline-flex' },
          }}
        >
          <ChevronLeftRoundedIcon />
        </IconButton>

        <Stack spacing={2} sx={{ width: '100%', maxWidth: 720 }}>
          {lessons.map((lesson) => (
            <MainLessonCard key={`${lesson.time}-${lesson.title}`} lesson={lesson} />
          ))}
        </Stack>

        <IconButton
          size="small"
          sx={{
            width: 30,
            height: 30,
            bgcolor: '#B7DDF5',
            color: '#35708A',
            borderRadius: 1,
            boxShadow: '0 8px 18px rgba(183, 221, 245, 0.42)',
            display: { xs: 'none', md: 'inline-flex' },
          }}
        >
          <ChevronRightRoundedIcon />
        </IconButton>

        <CompactLessonCard label="Завтра" lessons={next} align="right" />
      </Stack>
    </Stack>
  );
}
