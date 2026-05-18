'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PageHero } from '@/components/ui';
import { useMyTeacherSubjects } from '@/lib/hooks/useSubjects';
import { useAuthStore } from '@/stores/useAuthStore';

import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';

import { useWeekSchedule } from '@/lib/hooks/useSchedule';
import type { ScheduleLessonResult } from '@/lib/api/types';
import { getIsoWeekNumber, getLocalIsoDate } from '@/lib/utils/isoDate';
import {
  buildEmptyScheduleWeek,
  getScheduleLessonGroupNames,
  mapBackendWeekToScheduleDays,
} from '@/lib/utils/schedule';
import { buildTeacherLessonHref, normalizeTeacherLessonGroups } from '@/lib/utils/teacherLesson';

import styles from './home.module.scss';

import { TeacherHomeScheduleSection } from './components/TeacherHomeScheduleSection';
import { TeacherHomeSubjectsSection } from './components/TeacherHomeSubjectsSection';

import type { TeacherHomeDay, TeacherHomeLesson, TeacherHomeSubject } from './components/TeacherHome.types';

const SUBJECT_CARD_VARIANTS: TeacherHomeSubject['iconVariant'][] = ['brand', 'violet', 'mint'];

function mapLessonToHomeLesson(lesson: ScheduleLessonResult): TeacherHomeLesson {
  const groupInfos = normalizeTeacherLessonGroups(lesson);

  return {
    id: lesson.lessonsId,
    subjectId: lesson.subjectId,
    startTime: lesson.startsAt,
    endTime: lesson.endsAt,
    subjectName: lesson.subjectName,
    meta: lesson.type ?? undefined,
    groups: getScheduleLessonGroupNames(lesson),
    groupInfos,
    room: lesson.cabinet ? `Ауд. ${lesson.cabinet}` : undefined,
  };
}

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

  const weekDays = useMemo<TeacherHomeDay[]>(() => {
    const backendDays = mapBackendWeekToScheduleDays(weekSchedule, mapLessonToHomeLesson);
    return backendDays.length > 0 ? backendDays : buildEmptyScheduleWeek<TeacherHomeLesson>(todayDate);
  }, [todayDate, weekSchedule]);

  const todayIndex = Math.max(0, weekDays.findIndex((day) => day.date === todayDate));
  const currentDayIndex = Math.min(
    selectedDayIndex ?? todayIndex,
    Math.max(weekDays.length - 1, 0)
  );
  const currentDay = weekDays[currentDayIndex];
  const previousDay = weekDays[currentDayIndex - 1];
  const nextDay = weekDays[currentDayIndex + 1];
  const {
    data: teacherSubjects = [],
    isLoading: isTeacherSubjectsLoading,
    error: teacherSubjectsError,
  } = useMyTeacherSubjects();

  const currentDateStr = formatDateFull(currentDay.date);
  const currentWeekDay = getWeekDay(currentDay.date);
  const currentDayLabel =
    currentDayIndex === todayIndex
      ? 'Сегодня'
      : currentDayIndex === todayIndex - 1
        ? 'Вчера'
        : currentDayIndex === todayIndex + 1
          ? 'Завтра'
          : getWeekDay(currentDay.date);
  const firstName = user?.firstName ?? 'Дмитрий';
  const patronymic = user?.patronymic ?? 'Александрович';
  const fullGreeting = `${firstName} ${patronymic}`.trim();
  const weekNumber = getIsoWeekNumber(currentDay.date);

  const lessonsCountLabel = useMemo(() => {
    if (isWeekScheduleLoading) {
      return 'загружаем расписание';
    }

    if (weekScheduleError) {
      return 'расписание недоступно';
    }

    const count = currentDay.lessons.length;

    if (count === 1) {
      return '1 занятие';
    }

    if (count >= 2 && count <= 4) {
      return `${count} занятия`;
    }

    return `${count} занятий`;
  }, [currentDay.lessons.length, isWeekScheduleLoading, weekScheduleError]);

  const homeSubjects: TeacherHomeSubject[] = teacherSubjects.map((subject, index) => {
    const groups = Array.isArray(subject.groups) ? subject.groups : [];

    return {
      id: subject.subjectId,
      name: subject.subjectName,
      groups: groups.map((group) => group.groupName),
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
          totalDays={weekDays.length}
          isLoading={isWeekScheduleLoading}
          hasError={Boolean(weekScheduleError)}
          onPrevious={() => {
            setSelectedDayIndex((index) => Math.max(0, (index ?? currentDayIndex) - 1));
          }}
          onNext={() => {
            setSelectedDayIndex((index) => Math.min(weekDays.length - 1, (index ?? currentDayIndex) + 1));
          }}
          onLessonOpen={(lesson, date) => {
            router.push(buildTeacherLessonHref({
              lessonId: lesson.id,
              subjectId: lesson.subjectId,
              subjectName: lesson.subjectName,
              lessonType: lesson.meta,
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
