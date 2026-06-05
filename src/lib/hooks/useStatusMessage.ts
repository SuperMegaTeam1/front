'use client';

import { useEffect, useState } from 'react';

export type StatusMessageType = 'idle' | 'info' | 'success' | 'error';

export interface StatusMessage {
  type: StatusMessageType;
  text: string;
}

const IDLE_MESSAGE: StatusMessage = { type: 'idle', text: '' };

/**
 * Состояние статус-сообщения формы с авто-сбросом успешного статуса.
 * Раньше этот паттерн (useState + useEffect с setTimeout) дублировался
 * в страницах журнала группы и занятия.
 */
export function useStatusMessage(autoClearMs = 2500) {
  const [message, setMessage] = useState<StatusMessage>(IDLE_MESSAGE);

  useEffect(() => {
    if (message.type !== 'success') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMessage(IDLE_MESSAGE);
    }, autoClearMs);

    return () => window.clearTimeout(timeoutId);
  }, [message, autoClearMs]);

  const resetMessage = () => setMessage(IDLE_MESSAGE);

  return { message, setMessage, resetMessage };
}
