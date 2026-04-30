'use client';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import styles from './WeekNavigation.module.scss';

interface WeekNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
}

export function WeekNavigation({
  onPrevious,
  onNext,
  isPreviousDisabled = false,
  isNextDisabled = false,
}: WeekNavigationProps) {
  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.button}
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        aria-label="Предыдущая неделя"
      >
        <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
        Предыдущая
      </button>

      <span className={styles.divider} />

      <button
        type="button"
        className={styles.button}
        onClick={onNext}
        disabled={isNextDisabled}
        aria-label="Следующая неделя"
      >
        Следующая
        <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
      </button>
    </div>
  );
}
