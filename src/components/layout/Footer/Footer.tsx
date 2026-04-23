import Link from 'next/link';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import styles from './Footer.module.scss';

const FOOTER_COLUMNS = [
  {
    heading: 'Об институте',
    items: [
      { label: 'История', href: '#' },
      { label: 'Структура', href: '#' },
      { label: 'Сотрудники', href: '#' },
      { label: 'Новости', href: '#' },
    ],
  },
  {
    heading: 'Учеба',
    items: [
      { label: 'Бакалавриат', href: '#' },
      { label: 'Магистратура', href: '#' },
      { label: 'Аспирантура', href: '#' },
      { label: 'Расписание', href: '/student/schedule' },
    ],
  },
  {
    heading: 'Наука',
    items: [
      { label: 'Лаборатории', href: '#' },
      { label: 'Конференции', href: '#' },
      { label: 'Проекты', href: '#' },
      { label: 'Публикации', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.brandTitle}>ИВМиИТ</p>
          <p className={styles.brandSubtitle}>КАЗАНСКИЙ ФЕДЕРАЛЬНЫЙ УНИВЕРСИТЕТ</p>
          <p className={styles.brandDesc}>
            Институт вычислительной математики и информационных технологий — один из
            ведущих образовательных и научных центров КФУ.
          </p>

          <div className={styles.brandIcons}>
            <span className={styles.brandIcon}>
              <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />
            </span>
            <span className={`${styles.brandIcon} ${styles.brandCounter}`}>3</span>
            <span className={styles.brandIcon}>
              <LanguageOutlinedIcon sx={{ fontSize: 22 }} />
            </span>
          </div>
        </div>

        <div className={styles.columns}>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className={styles.col}>
              <p className={styles.colHeading}>{col.heading}</p>
              <ul className={styles.colList}>
                {col.items.map((item) => (
                  <li key={`${col.heading}-${item.label}`}>
                    <Link href={item.href} className={styles.colLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={styles.col}>
            <p className={styles.colHeading}>Контакты</p>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <LocationOnOutlinedIcon sx={{ fontSize: 26 }} />
                <span>Казань, ул. Кремлевская, д. 35</span>
              </li>
              <li className={styles.contactItem}>
                <LocalPhoneOutlinedIcon sx={{ fontSize: 24 }} />
                <span>+7 (843) 233-71-09</span>
              </li>
              <li className={styles.contactItem}>
                <MailOutlineRoundedIcon sx={{ fontSize: 24 }} />
                <span>ivmiit@kpfu.ru</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <div className={styles.bottomBrand}>
            <div className={styles.bottomMark}>
              <SchoolOutlinedIcon sx={{ fontSize: 28, color: '#ffffff' }} />
            </div>
            <div className={styles.bottomMarkText}>
              <span>КФУ</span>
              <span>1804</span>
            </div>
          </div>

          <p className={styles.bottomCopy}>
            © {new Date().getFullYear()} Институт вычислительной математики и информационных технологий
          </p>

          <div className={styles.bottomLinks}>
            <Link href="#" className={styles.bottomLink}>Карта сайта</Link>
            <Link href="#" className={styles.bottomLink}>Политика КФУ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
