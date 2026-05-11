'use client';

import { useState } from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { PageHero } from '@/components/ui';
import { useTeacherGroups } from '@/lib/hooks/useGroups';
import styles from './messages.module.scss';

export default function TeacherMessagesPage() {
  const { data: groups = [], isLoading, error } = useTeacherGroups();
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId],
    );
  };

  const handleSubmit = () => {
    setMessage('');
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Уведомления" subtitle="Отправить уведомление" />

        <section className={styles.composerCard} aria-label="Отправить уведомление студентам">
          <div className={styles.groupSection}>
            <div className={styles.sectionTitle}>
              <GroupsRoundedIcon sx={{ fontSize: 30 }} />
              <h2>Выберите группы</h2>
            </div>

            <div className={styles.groupList}>
              {isLoading ? (
                <span>Загружаем группы...</span>
              ) : error ? (
                <span>Не удалось загрузить группы</span>
              ) : groups.length === 0 ? (
                <span>Нет групп</span>
              ) : (
                groups.map((group) => {
                  const isSelected = selectedGroupIds.includes(group.groupId);

                  return (
                    <button
                      key={group.groupId}
                      type="button"
                      className={`${styles.groupButton} ${isSelected ? styles.groupButtonActive : ''}`}
                      onClick={() => toggleGroup(group.groupId)}
                      aria-pressed={isSelected}
                    >
                      {isSelected && <CheckCircleRoundedIcon sx={{ fontSize: 22 }} />}
                      <span>{group.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <textarea
            className={styles.messageInput}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Введите важное уведомление для студентов..."
            aria-label="Текст уведомления"
          />

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSubmit}
              disabled={selectedGroupIds.length === 0 || message.trim().length === 0}
            >
              Отправить
              <SendRoundedIcon sx={{ fontSize: 34 }} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
