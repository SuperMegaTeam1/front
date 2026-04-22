import Link from 'next/link';
import styles from './SubjectCard.module.scss';

interface SubjectCardProps {
  id: number;
  name: string;
  groups: string;
  examType: 'ЭКЗАМЕН' | 'ЗАЧЕТ' | string;
  iconUrl: string;
  iconBg: string;
}

export function SubjectCard({ id, name, groups, examType, iconUrl, iconBg }: SubjectCardProps) {
  return (
    <Link href={`/teacher/subjects/${id}`} className={styles.root}>
      <div className={styles.top}>
        <div className={styles.icon} style={{ backgroundColor: iconBg }}>
          <img src={iconUrl} alt="" />
        </div>
        <span className={styles.badge}>{examType}</span>
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.groups}>{groups}</p>
    </Link>
  );
}
