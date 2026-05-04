import Link from 'next/link';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import styles from './SubjectCard.module.scss';

export interface SubjectCardProps {
  id: number;
  name: string;
  examType: 'ЭКЗАМЕН' | 'ЗАЧЕТ' | 'ЗАЧЁТ';
  groups?: string[];
  href?: string;
  icon?: React.ReactNode;
  iconVariant?: 'brand' | 'violet' | 'mint';
}

const ICON_VARIANT_CLASS = {
  brand: styles.iconBrand,
  violet: styles.iconViolet,
  mint: styles.iconMint,
};

export function SubjectCard({
  name,
  examType,
  groups = [],
  href,
  icon,
  iconVariant = 'brand',
}: SubjectCardProps) {
  const linkHref = href ?? '/teacher/subjects';
  const groupsLabel = groups.length > 1 ? 'Группы' : 'Группа';

  return (
    <Link href={linkHref} className={styles.root}>
      <div className={styles.topRow}>
        <div className={`${styles.iconWrap} ${ICON_VARIANT_CLASS[iconVariant]}`}>
          {icon ?? <MenuBookOutlinedIcon sx={{ fontSize: 30, color: '#2a657e' }} />}
        </div>
        <span className={styles.examPill}>{examType}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.name}>{name}</p>
        {groups.length > 0 && (
          <p className={styles.groups}>
            {groupsLabel}: {groups.join(', ')}
          </p>
        )}
      </div>
    </Link>
  );
}
