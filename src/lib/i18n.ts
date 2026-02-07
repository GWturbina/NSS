import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../locales/en/translation.json';
import ukTranslation from '../locales/uk/translation.json';
import ruTranslation from '../locales/ru/translation.json';

const resources = {
  en: { translation: enTranslation },
  uk: { translation: ukTranslation },
  ru: { translation: ruTranslation },
};

// Определяем язык только на клиенте
const getDefaultLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  const saved = localStorage.getItem('nss_language');
  if (saved) return saved;
  
  const browserLang = navigator.language.slice(0, 2);
  if (['en', 'uk', 'ru'].includes(browserLang)) return browserLang;
  
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export function changeLanguage(code: string) {
  i18n.changeLanguage(code);
  if (typeof window !== 'undefined') {
    localStorage.setItem('nss_language', code);
  }
}
