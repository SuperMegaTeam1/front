import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import styles from './Footer.module.scss';

const aboutLinks = ['История', 'Структура', 'Сотрудники', 'Новости'];
const studyLinks = ['Бакалавриат', 'Магистратура', 'Аспирантура', 'Расписание'];
const scienceLinks = ['Лаборатории', 'Конференции', 'Проекты', 'Публикации'];

/** Inline SVG icons for social — no external dependencies */
function VkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.785 16.241s.288-.032.436-.192c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.187 1.365 1.248 2.18 1.799.615.416 1.082.325 1.082.325l2.175-.03s1.14-.07.599-.964c-.044-.073-.314-.664-1.618-1.877-1.366-1.27-1.183-1.065.462-3.261.998-1.333 1.396-2.146 1.272-2.494-.119-.332-.85-.244-.85-.244l-2.448.015s-.182-.025-.316.056c-.131.079-.216.263-.216.263s-.387 1.03-.902 1.906c-1.09 1.854-1.524 1.953-1.702 1.838-.414-.268-.31-1.074-.31-1.646 0-1.789.271-2.534-.529-2.728-.266-.065-.461-.107-1.14-.114-.87-.009-1.606.003-2.023.207-.278.136-.492.438-.361.455.161.021.526.098.72.363.249.341.24 1.11.24 1.11s.143 2.105-.334 2.366c-.327.18-.777-.187-1.74-1.862-.493-.858-.866-1.806-.866-1.806s-.072-.176-.2-.27c-.155-.114-.372-.15-.372-.15l-2.327.015s-.35.01-.478.161c-.114.135-.009.413-.009.413s1.818 4.255 3.876 6.4c1.887 1.966 4.03 1.836 4.03 1.836h.971z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.main}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandName}>
              <span className={styles.brandTitle}>ИВМиИТ</span>
              <span className={styles.brandSub}>КАЗАНСКИЙ ФЕДЕРАЛЬНЫЙ УНИВЕРСИТЕТ</span>
            </div>
            <p className={styles.brandDesc}>
              Институт вычислительной математики и информационных технологий — один из ведущих образовательных и научных центров КФУ.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="VK">
                <VkIcon />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Telegram">
                <TelegramIcon />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Сайт">
                <GlobeIcon />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>ОБ ИНСТИТУТЕ</h4>
            <ul className={styles.linkList}>
              {aboutLinks.map((l) => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>УЧЕБА</h4>
            <ul className={styles.linkList}>
              {studyLinks.map((l) => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>НАУКА</h4>
            <ul className={styles.linkList}>
              {scienceLinks.map((l) => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>

          {/* Contacts */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>КОНТАКТЫ</h4>
            <ul className={styles.contactList}>
              <li>
                <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
                <span>Казань, ул. Кремлевская, д. 35</span>
              </li>
              <li>
                <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
                <span>+7 (843) 233-71-09</span>
              </li>
              <li>
                <EmailOutlinedIcon sx={{ fontSize: 18 }} />
                <span>ivmiit@kpfu.ru</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <div className={styles.copyright}>
            <div className={styles.kfuLogo}>
              <div className={styles.kfuIcon}>
                <span className={styles.kfuIconText}>К</span>
              </div>
              <div className={styles.kfuText}>
                <span>КФУ</span>
                <span>1804</span>
              </div>
            </div>
            <span className={styles.copyrightText}>
              © 2026 Институт вычислительной математики и информационных технологий
            </span>
          </div>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>КАРТА САЙТА</a>
            <a href="#" className={styles.bottomLink}>ПОЛИТИКА КФУ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
