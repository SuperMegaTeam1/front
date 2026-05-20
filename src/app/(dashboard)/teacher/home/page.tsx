'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHero } from '@/components/ui';
import { useWeekSchedule } from '@/lib/hooks/useSchedule';
import { useMyTeacherSubjects } from '@/lib/hooks/useSubjects';
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import { getIsoWeekNumber, getLocalIsoDate } from '@/lib/utils/isoDate';
import {
  buildScheduleHomeState,
  formatLessonsCountLabel,
  getCurrentScheduleDayLabel,
  mapLessonToTeacherHomeLesson,
} from '@/lib/utils/scheduleView';
import { getSubjectIconByName } from '@/lib/utils/subjectIcons';
import { buildTeacherLessonHref } from '@/lib/utils/teacherLesson';
import { useAuthStore } from '@/stores/useAuthStore';

import styles from './home.module.scss';

import { TeacherHomeScheduleSection } from './components/TeacherHomeScheduleSection';
import { TeacherHomeSubjectsSection } from './components/TeacherHomeSubjectsSection';

import type { TeacherHomeLesson, TeacherHomeSubject } from './components/TeacherHome.types';

const SUBJECT_CARD_VARIANTS: TeacherHomeSubject['iconVariant'][] = ['brand', 'violet', 'mint'];

export default function TeacherHomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const todayDate = getLocalIsoDate();

  const {
    data: weekSchedule,
    isLoading: isWeekScheduleLoading,
    error: weekScheduleError,
  } = useWeekSchedule(todayDate);

  const {
    todayIndex,
    currentDayIndex,
    currentDay,
    previousDay,
    nextDay,
    totalDays,
  } = useMemo(() => buildScheduleHomeState<TeacherHomeLesson>({
    weekSchedule,
    todayDate,
    selectedDayIndex,
    mapLesson: mapLessonToTeacherHomeLesson,
  }), [selectedDayIndex, todayDate, weekSchedule]);

  const {
    data: teacherSubjects = [],
    isLoading: isTeacherSubjectsLoading,
    error: teacherSubjectsError,
  } = useMyTeacherSubjects();

  const currentDateStr = formatDateFull(currentDay.date);
  const currentWeekDay = getWeekDay(currentDay.date);
  const currentDayLabel = getCurrentScheduleDayLabel(currentDayIndex, todayIndex, currentDay.date);
  const firstName = user?.firstName ?? 'Дмитрий';
  const patronymic = user?.patronymic ?? 'Александрович';
  const fullGreeting = `${firstName} ${patronymic}`.trim();
  const weekNumber = getIsoWeekNumber(currentDay.date);
  const lessonsCountLabel = useMemo(
    () => formatLessonsCountLabel(
      currentDay.lessons.length,
      isWeekScheduleLoading,
      Boolean(weekScheduleError),
    ),
    [currentDay.lessons.length, isWeekScheduleLoading, weekScheduleError],
  );

  const homeSubjects: TeacherHomeSubject[] = teacherSubjects.map((subject, index) => {
    const groups = Array.isArray(subject.groups) ? subject.groups : [];
    const SubjectIcon = getSubjectIconByName(subject.subjectName);

    return {
      id: subject.subjectId,
      name: subject.subjectName,
      groups: groups.map((group) => group.groupName),
      icon: <SubjectIcon sx={{ fontSize: 30, color: '#2a657e' }} />,
      iconVariant: SUBJECT_CARD_VARIANTS[index % SUBJECT_CARD_VARIANTS.length],
    };
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.homeHero}
          title={`Добрый день, ${fullGreeting}`}
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
            <Link href="#schedule" className={styles.greetingLink}>
              Перейти в расписание
              <ArrowForwardIcon sx={{ fontSize: 22 }} />
            </Link>
          )}
        />

        <TeacherHomeScheduleSection
          previousDay={previousDay}
          currentDay={currentDay}
          nextDay={nextDay}
          currentDayIndex={currentDayIndex}
          todayIndex={todayIndex}
          totalDays={totalDays}
          isLoading={isWeekScheduleLoading}
          hasError={Boolean(weekScheduleError)}
          onPrevious={() => {
            setSelectedDayIndex((index) => Math.max(0, (index ?? currentDayIndex) - 1));
          }}
          onNext={() => {
            setSelectedDayIndex((index) => Math.min(totalDays - 1, (index ?? currentDayIndex) + 1));
          }}
          onLessonOpen={(lesson, date) => {
            router.push(buildTeacherLessonHref({
              lessonId: lesson.id,
              subjectId: lesson.subjectId,
              subjectName: lesson.subjectName,
              lessonType: lesson.lessonType,
              date,
              startsAt: lesson.startTime,
              endsAt: lesson.endTime,
              cabinet: lesson.room?.replace(/^Ауд\.\s*/, '') ?? null,
              groups: lesson.groupInfos,
            }));
          }}
        />

        <TeacherHomeSubjectsSection
          subjects={homeSubjects}
          isLoading={isTeacherSubjectsLoading}
          hasError={!!teacherSubjectsError}
        />
      </div>
    </div>
  );
}
