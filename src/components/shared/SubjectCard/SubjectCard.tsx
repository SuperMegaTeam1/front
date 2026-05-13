import Link from 'next/link';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import styles from './SubjectCard.module.scss';

export interface SubjectCardProps {
  id: number | string;
  name: string;
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
  groups = [],
  href,
  icon,
  iconVariant = 'brand',
}: SubjectCardProps) {
  const linkHref = href ?? '/teacher/subjects';
  const groupsLabel = groups.length === 1 ? 'Группа' : 'Группы';
  const groupsText = groups.length > 0 ? groups.join(', ') : 'пока не назначены';

  return (
    <Link
      href={linkHref}
      className={`${styles.root} ${styles.rootCompact}`}
    >
      <div className={styles.topRow}>
        <div className={`${styles.iconWrap} ${ICON_VARIANT_CLASS[iconVariant]}`}>
          {icon ?? <MenuBookOutlinedIcon sx={{ fontSize: 30, color: '#2a657e' }} />}
        </div>
      </div>

      <div className={`${styles.body} ${styles.bodyCompact}`}>
        <p className={styles.name}>{name}</p>
        <p className={styles.groups}>
          {groupsLabel}: {groupsText}
        </p>
      </div>
    </Link>
  );
}
