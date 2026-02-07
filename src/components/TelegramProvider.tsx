'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTelegram, UseTelegramReturn } from '@/lib/telegram';

interface TelegramContextType extends UseTelegramReturn {
  // Дополнительные поля для игры
  telegramId: number | null;
  username: string | null;
  firstName: string;
  lastName: string;
  fullName: string;
  isPremium: boolean;
  languageCode: string;
  referrerId: string | null;
}

const TelegramContext = createContext<TelegramContextType | null>(null);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const telegram = useTelegram();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Если есть реферальный параметр — сохраняем
    if (telegram.startParam) {
      localStorage.setItem('nss_referrer', telegram.startParam);
    }

    // Сохраняем Telegram ID если есть
    if (telegram.user?.id) {
      localStorage.setItem('nss_telegram_id', telegram.user.id.toString());
    }

    // Устанавливаем язык из Telegram
    if (telegram.user?.language_code) {
      const lang = telegram.user.language_code;
      if (['en', 'ru', 'uk'].includes(lang)) {
        localStorage.setItem('i18nextLng', lang);
      }
    }
  }, [telegram.startParam, telegram.user]);

  // Извлекаем данные пользователя
  const telegramId = telegram.user?.id || null;
  const username = telegram.user?.username || null;
  const firstName = telegram.user?.first_name || 'Guest';
  const lastName = telegram.user?.last_name || '';
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  const isPremium = telegram.user?.is_premium || false;
  const languageCode = telegram.user?.language_code || 'en';
  
  // Реферер из start_param
  const referrerId = telegram.startParam || localStorage.getItem('nss_referrer');

  const value: TelegramContextType = {
    ...telegram,
    telegramId,
    username,
    firstName,
    lastName,
    fullName,
    isPremium,
    languageCode,
    referrerId,
  };

  if (!mounted) {
    return null;
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegramContext() {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegramContext must be used within TelegramProvider');
  }
  return context;
}

// Хук для безопасного использования (не выбрасывает ошибку)
export function useTelegramSafe(): TelegramContextType | null {
  return useContext(TelegramContext);
}
