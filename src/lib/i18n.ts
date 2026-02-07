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

const isClient = typeof window !== 'undefined';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Меняем язык на клиенте после загрузки
if (isClient) {
  const saved = localStorage.getItem('nss_language');
  if (saved && ['en', 'uk', 'ru'].includes(saved)) {
    i18n.changeLanguage(saved);
  } else {
    const browserLang = navigator.language.slice(0, 2);
    if (['en', 'uk', 'ru'].includes(browserLang)) {
      i18n.changeLanguage(browserLang);
    }
  }
}

export default i18n;

export function changeLanguage(code: string) {
  i18n.changeLanguage(code);
  if (isClient) {
    localStorage.setItem('nss_language', code);
  }
}
