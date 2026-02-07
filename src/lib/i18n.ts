import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en/translation.json';
import ukTranslation from '../locales/uk/translation.json';
import ruTranslation from '../locales/ru/translation.json';

const resources = {
  en: { translation: enTranslation },
  uk: { translation: ukTranslation },
  ru: { translation: ruTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nss_language',
    },
  });

export default i18n;

export function changeLanguage(code: string) {
  i18n.changeLanguage(code);
  if (typeof window !== 'undefined') {
    localStorage.setItem('nss_language', code);
  }
}
