'use client';

import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { PageHero } from '@/components/ui';
import { GroupGradebook } from './GroupGradebook';
import { useLessonGradebook } from './useLessonGradebook';
import styles from './lesson.module.scss';

export default function TeacherLessonPage() {
  const {
    groupSections,
    isGroupsLoading,
    groupsError,
    isMarksLoading,
    hasGroups,
    isSaving,
    submitMessage,
    lessonTitle,
    lessonMeta,
    getScoreValue,
    handleScoreChange,
    handleSubmit,
  } = useLessonGradebook();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          title={lessonTitle}
          meta={(
            <>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
              <span>{lessonMeta}</span>
            </>
          )}
        />

        {!hasGroups ? (
          <section className={styles.stateCard}>
            Не удалось определить группы занятия. Откройте страницу пары из расписания преподавателя.
          </section>
        ) : groupsError ? (
          <section className={styles.stateCard}>
            Не удалось загрузить список студентов для этой пары.
          </section>
        ) : isGroupsLoading ? (
          <section className={styles.stateCard}>
            Загружаем студентов по группам…
          </section>
        ) : (
          groupSections.map((group) => (
            <GroupGradebook
              key={group.groupId}
              group={group}
              scores={Object.fromEntries(
                group.students.map((student) => [student.studentId, getScoreValue(group.groupId, student.studentId)])
              )}
              onScoreChange={(studentId, value) => handleScoreChange(group.groupId, studentId, value)}
            />
          ))
        )}

        <div className={styles.actions}>
          {submitMessage.type !== 'idle' && (
            <p
              className={`${styles.statusText} ${
                submitMessage.type === 'success'
                  ? styles.statusSuccess
                  : submitMessage.type === 'error'
                    ? styles.statusError
                    : ''
              }`}
            >
              {submitMessage.text}
            </p>
          )}
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!hasGroups || isGroupsLoading || isSaving || isMarksLoading}
          >
            <SendRoundedIcon sx={{ fontSize: 18 }} />
            {isSaving ? 'Сохраняем…' : 'Отправить баллы'}
          </button>
        </div>
      </div>
    </div>
  );
}
