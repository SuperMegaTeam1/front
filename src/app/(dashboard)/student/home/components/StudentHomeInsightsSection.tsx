import Link from 'next/link';
import { Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from '../home.module.scss';

interface StudentHomeInsightsGrade {
  subject: string;
  score: number | null;
}

interface StudentHomeInsightsSectionProps {
  avgScore: number | null;
  ratingPos: number | null;
  totalStudents: number | null;
  groupName: string;
  grades: StudentHomeInsightsGrade[];
}

function formatScore(score: number | null) {
  if (score === null) {
    return '—';
  }

  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function formatAverageScore(score: number | null) {
  if (score === null) {
    return '—';
  }

  return score.toFixed(1);
}

export function StudentHomeInsightsSection({
  avgScore,
  ratingPos,
  totalStudents,
  groupName,
  grades,
}: StudentHomeInsightsSectionProps) {
  return (
    <section className={styles.insightsSection}>
      <Typography className={styles.sectionTitle}>Успеваемость и рейтинг</Typography>

      <div className={styles.insightsCard}>
        <div className={styles.primaryStat}>
          <div className={styles.primaryScore}>{formatAverageScore(avgScore)}</div>
          <div className={styles.primaryLabel}>СРЕДНИЙ БАЛЛ</div>
          <Link href="/student/rating" className={styles.primaryLink}>
            Смотреть подробный рейтинг <ArrowForwardIcon sx={{ fontSize: 22 }} />
          </Link>
        </div>

        <div className={styles.secondaryStat}>
          <div className={styles.secondaryValue}>{ratingPos ?? '—'} из {totalStudents ?? '—'}</div>
          <div className={styles.secondaryLabel}>Группа {groupName}</div>
        </div>

        <div className={styles.subjectScores}>
          {grades.map((grade) => (
            <div
              key={grade.subject}
              className={`${styles.subjectScoreRow} ${grade.score !== null && grade.score < 70 ? styles.subjectScoreRowDim : ''}`}
            >
              <span>{grade.subject}</span>
              <strong>{formatScore(grade.score)}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
