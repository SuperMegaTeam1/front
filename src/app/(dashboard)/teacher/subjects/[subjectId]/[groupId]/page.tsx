'use client';

import { useParams, useSearchParams } from 'next/navigation';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { PageHero } from '@/components/ui';
import { GradebookTable } from './GradebookTable';
import { GradebookMobileTable } from './GradebookMobileTable';
import { useGradebook } from './useGradebook';
import styles from './gradebook.module.scss';

export default function TeacherGroupGradebookPage() {
  const params = useParams<{ subjectId: string; groupId: string }>();
  const searchParams = useSearchParams();
  const subjectId = params.subjectId ?? '';
  const groupId = params.groupId ?? '';
  const groupName = searchParams.get('groupName') ?? groupId;
  const subjectTitle = searchParams.get('subjectName') ?? 'Предмет';

  const {
    lessonColumns,
    rows,
    gridStyle,
    isLoading,
    hasError,
    hasRows,
    isSaving,
    submitMessage,
    handleGradeChange,
    handleSubmit,
    visibleColumns,
    visibleDateStart,
    mobilePageIndex,
    mobilePageCount,
    goToPreviousDates,
    goToNextDates,
  } = useGradebook(subjectId, groupId);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.gradebookHero}
          title={`Журнал группы ${groupName}`}
          subtitle={subjectTitle}
        />

        {isLoading ? (
          <section className={styles.stateCard}>Загружаем журнал группы и список студентов…</section>
        ) : hasError ? (
          <section className={styles.stateCard}>Не удалось загрузить журнал группы.</section>
        ) : !hasRows ? (
          <section className={styles.stateCard}>По этому предмету пока нет записей в журнале.</section>
        ) : (
          <>
            <GradebookTable
              groupId={groupId}
              lessonColumns={lessonColumns}
              rows={rows}
              gridStyle={gridStyle}
              onGradeChange={handleGradeChange}
            />

            <GradebookMobileTable
              groupId={groupId}
              rows={rows}
              visibleColumns={visibleColumns}
              visibleDateStart={visibleDateStart}
              mobilePageIndex={mobilePageIndex}
              mobilePageCount={mobilePageCount}
              onPreviousDates={goToPreviousDates}
              onNextDates={goToNextDates}
              onGradeChange={handleGradeChange}
            />

            <div className={styles.actions}>
              {submitMessage.type !== 'idle' ? (
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
              ) : null}

              <button
                type="button"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={isSaving}
              >
                <SendRoundedIcon sx={{ fontSize: 18 }} />
                {isSaving ? 'Сохраняем…' : 'Отправить баллы'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
