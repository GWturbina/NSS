'use client';

import { useEffect, useState, useCallback } from 'react';

// Типы для Telegram WebApp
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  isVersionAtLeast: (version: string) => boolean;
  shareToStory?: (mediaUrl: string, params?: object) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export interface UseTelegramReturn {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isInTelegram: boolean;
  isTelegramReady: boolean;
  colorScheme: 'light' | 'dark';
  startParam: string | null;
  // Методы
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  shareLink: (url: string, text?: string) => void;
  openLink: (url: string) => void;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  close: () => void;
  expand: () => void;
}

export function useTelegram(): UseTelegramReturn {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      setWebApp(tg);
      
      // Сообщаем Telegram что приложение готово
      tg.ready();
      
      // Разворачиваем на весь экран
      tg.expand();
      
      // Устанавливаем цвета под наш дизайн
      if (tg.setHeaderColor) {
        tg.setHeaderColor('#0a0e1a'); // navy-900
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#0a0e1a'); // navy-900
      }
      
      setIsTelegramReady(true);
    }
  }, []);

  // Определяем, находимся ли мы в Telegram
  const isInTelegram = !!webApp;

  // Получаем пользователя
  const user = webApp?.initDataUnsafe?.user || null;

  // Цветовая схема
  const colorScheme = webApp?.colorScheme || 'dark';

  // Параметр запуска (реферальный код)
  const startParam = webApp?.initDataUnsafe?.start_param || null;

  // Вибрация
  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
    if (!webApp?.HapticFeedback) return;
    
    if (type === 'success' || type === 'error' || type === 'warning') {
      webApp.HapticFeedback.notificationOccurred(type);
    } else {
      webApp.HapticFeedback.impactOccurred(type);
    }
  }, [webApp]);

  // Главная кнопка
  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (!webApp?.MainButton) return;
    
    webApp.MainButton.setText(text);
    webApp.MainButton.onClick(onClick);
    webApp.MainButton.show();
  }, [webApp]);

  const hideMainButton = useCallback(() => {
    if (!webApp?.MainButton) return;
    webApp.MainButton.hide();
  }, [webApp]);

  // Кнопка назад
  const showBackButton = useCallback((onClick: () => void) => {
    if (!webApp?.BackButton) return;
    
    webApp.BackButton.onClick(onClick);
    webApp.BackButton.show();
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    if (!webApp?.BackButton) return;
    webApp.BackButton.hide();
  }, [webApp]);

  // Поделиться ссылкой
  const shareLink = useCallback((url: string, text?: string) => {
    if (webApp) {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}${text ? `&text=${encodeURIComponent(text)}` : ''}`;
      webApp.openTelegramLink(shareUrl);
    } else {
      // Fallback для браузера
      if (navigator.share) {
        navigator.share({ url, text });
      } else {
        navigator.clipboard.writeText(url);
        alert('Ссылка скопирована!');
      }
    }
  }, [webApp]);

  // Открыть внешнюю ссылку
  const openLink = useCallback((url: string) => {
    if (webApp) {
      webApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }, [webApp]);

  // Показать алерт
  const showAlert = useCallback((message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showAlert(message, resolve);
      } else {
        alert(message);
        resolve();
      }
    });
  }, [webApp]);

  // Показать подтверждение
  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => resolve(confirmed));
      } else {
        resolve(confirm(message));
      }
    });
  }, [webApp]);

  // Закрыть приложение
  const close = useCallback(() => {
    if (webApp) {
      webApp.close();
    }
  }, [webApp]);

  // Развернуть на весь экран
  const expand = useCallback(() => {
    if (webApp) {
      webApp.expand();
    }
  }, [webApp]);

  return {
    webApp,
    user,
    isInTelegram,
    isTelegramReady,
    colorScheme,
    startParam,
    hapticFeedback,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    shareLink,
    openLink,
    showAlert,
    showConfirm,
    close,
    expand,
  };
}
