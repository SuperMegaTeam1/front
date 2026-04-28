'use client';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import styles from './RatingTable.module.scss';

export interface RatingTableRow {
  position: number;
  studentName: string;
  score: number;
  avatarLabel: string;
  avatarColor: string;
}

interface RatingTableProps {
  rows: RatingTableRow[];
  visibleCount: number;
  totalCount: number;
  onShowMore?: () => void;
}

function getPositionTone(position: number) {
  if (position === 1) {
    return styles.positionGold;
  }

  if (position === 2) {
    return styles.positionSilver;
  }

  if (position === 3) {
    return styles.positionBronze;
  }

  return '';
}

function getAwardIcon(position: number) {
  if (position === 1) {
    return <EmojiEventsRoundedIcon className={styles.awardIconGold} />;
  }

  if (position === 2) {
    return <WorkspacePremiumRoundedIcon className={styles.awardIconSilver} />;
  }

  if (position === 3) {
    return <EmojiEventsRoundedIcon className={styles.awardIconBronze} />;
  }

  return null;
}

export function RatingTable({
  rows,
  visibleCount,
  totalCount,
  onShowMore,
}: RatingTableProps) {
  const hiddenCount = Math.max(totalCount - visibleCount, 0);

  return (
    <section className={styles.card}>
      <div className={styles.tableHeader}>
        <span>Место</span>
        <span>Студент</span>
        <span>Средний балл</span>
      </div>

      <div className={styles.body}>
        {rows.map((row) => (
          <article key={`${row.position}-${row.studentName}`} className={styles.row}>
            <div className={styles.positionCell}>
              <span className={`${styles.positionBadge} ${getPositionTone(row.position)}`}>
                {row.position}
              </span>
              {getAwardIcon(row.position)}
            </div>

            <div className={styles.studentCell}>
              <span className={styles.avatar} style={{ background: row.avatarColor }}>
                {row.avatarLabel}
              </span>
              <span className={styles.studentName}>{row.studentName}</span>
            </div>

            <div className={styles.scoreCell}>{row.score.toFixed(1)}</div>
          </article>
        ))}
      </div>

      {hiddenCount > 0 && onShowMore ? (
        <button type="button" className={styles.showMoreButton} onClick={onShowMore}>
          Показать еще {hiddenCount} {hiddenCount === 1 ? 'студента' : hiddenCount < 5 ? 'студента' : 'студентов'}
          <KeyboardArrowDownRoundedIcon sx={{ fontSize: 20 }} />
        </button>
      ) : null}
    </section>
  );
}
