'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { PageHero } from '@/components/ui';
import { useStudentNotifications } from '@/lib/hooks/useNotifications';
import { useOverallRating, useSubjectRatings } from '@/lib/hooks/useRating';
import { useWeekSchedule } from '@/lib/hooks/useSchedule';
import { useMyStudentSubjects } from '@/lib/hooks/useSubjects';
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import { getIsoWeekNumber, getLocalIsoDate } from '@/lib/utils/isoDate';
import {
  buildScheduleHomeState,
  formatLessonsCountLabel,
  getCurrentScheduleDayLabel,
  mapLessonToStudentHomeLesson,
} from '@/lib/utils/scheduleView';
import { formatNotificationTimestamp } from '@/lib/utils/notificationGroups';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  StudentHomeInsightsSection,
  StudentHomeRecentChangesSection,
  StudentHomeScheduleSection,
  type StudentHomeScheduleDay,
} from '@/components/dashboard/student-home';
import styles from './home.module.scss';

type HomeLesson = StudentHomeScheduleDay['lessons'][number];

export default function StudentHomePage() {
  const { user } = useAuthStore();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const todayDate = getLocalIsoDate();

  const {
    data: weekSchedule,
    isLoading: isWeekScheduleLoading,
    error: weekScheduleError,
  } = useWeekSchedule(todayDate);
  const {
    data: overallRating,
  } = useOverallRating();
  const {
    data: subjects = [],
  } = useMyStudentSubjects();
  const {
    data: notifications = [],
  } = useStudentNotifications();

  const topSubjects = useMemo(() => subjects.slice(0, 3), [subjects]);
  const subjectRatingQueries = useSubjectRatings(topSubjects.map((subject) => subject.subjectId));

  const {
    todayIndex,
    currentDayIndex,
    currentDay,
    previousDay,
    nextDay,
    totalDays,
  } = useMemo(() => buildScheduleHomeState<HomeLesson>({
    weekSchedule,
    todayDate,
    selectedDayIndex,
    mapLesson: mapLessonToStudentHomeLesson,
  }), [selectedDayIndex, todayDate, weekSchedule]);

  const currentDateStr = formatDateFull(currentDay.date);
  const currentWeekDay = getWeekDay(currentDay.date);
  const currentDayLabel = getCurrentScheduleDayLabel(currentDayIndex, todayIndex, currentDay.date);

  const ratingGrades = useMemo(() => {
    return topSubjects.map((subject, index) => {
      const rating = subjectRatingQueries[index]?.data;

      return {
        subject: rating?.subjectName ?? subject.subjectName,
        score: rating?.totalGrade ?? null,
      };
    });
  }, [subjectRatingQueries, topSubjects]);

  const groupName = overallRating?.groupName
    ?? (user as { groupName?: string })?.groupName
    ?? '—';
  const firstName = user?.firstName ?? 'Тимур';
  const weekNumber = getIsoWeekNumber(currentDay.date);
  const lessonsCountLabel = useMemo(
    () => formatLessonsCountLabel(
      currentDay.lessons.length,
      isWeekScheduleLoading,
      Boolean(weekScheduleError),
    ),
    [currentDay.lessons.length, isWeekScheduleLoading, weekScheduleError],
  );

  const recentNotifications = useMemo(() => {
    return notifications.slice(0, 4).map((notification) => ({
      id: notification.id,
      icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 28, color: 'var(--color-brand)' }} />,
      title: notification.title,
      subtitle: notification.messageBody,
      time: formatNotificationTimestamp(notification.createdAt),
    }));
  }, [notifications]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.homeHero}
          title={`Добрый день, ${firstName}`}
          meta={(
            <>
              <span className={styles.heroMetaItem}>{currentWeekDay}, {currentDateStr}</span>
              <span className={styles.heroMetaDot}>·</span>
              <span className={styles.heroMetaItem}>Неделя {weekNumber}</span>
              <span className={styles.heroMetaDot}>·</span>
              <strong className={styles.heroMetaStrong}>
                {lessonsCountLabel} {currentDayLabel.toLowerCase()}
              </strong>
            </>
          )}
          action={(
            <Link href="/student/schedule" className={styles.greetingLink}>
              Перейти в расписание <ArrowForwardIcon sx={{ fontSize: 22 }} />
            </Link>
          )}
        />

        <StudentHomeScheduleSection
          previousDay={previousDay}
          currentDay={currentDay}
          nextDay={nextDay}
          currentDayIndex={currentDayIndex}
          todayIndex={todayIndex}
          isLoading={isWeekScheduleLoading}
          hasError={Boolean(weekScheduleError)}
          onPrevious={() => {
            setSelectedDayIndex((index) => Math.max(0, (index ?? currentDayIndex) - 1));
          }}
          onNext={() => {
            setSelectedDayIndex((index) => Math.min(totalDays - 1, (index ?? currentDayIndex) + 1));
          }}
        />

        <StudentHomeInsightsSection
          avgScore={overallRating?.totalGrade ?? null}
          ratingPos={overallRating?.ratingPosition ?? null}
          totalStudents={overallRating?.topStudents.length ?? null}
          groupName={groupName}
          grades={ratingGrades}
        />

        <StudentHomeRecentChangesSection notifications={recentNotifications} />
      </div>
    </div>
  );
}
