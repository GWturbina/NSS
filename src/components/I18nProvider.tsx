'use client';

import { useEffect } from 'react';
import i18n from '@/lib/i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('nss_language');
    if (saved && ['en', 'uk', 'ru'].includes(saved)) {
      i18n.changeLanguage(saved);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (['en', 'uk', 'ru'].includes(browserLang)) {
        i18n.changeLanguage(browserLang);
      }
    }
  }, []);

  return <>{children}</>;
}
