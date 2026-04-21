import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './lang/fr.json';
import en from './lang/en.json';
import ar from './lang/ar.json';

i18n
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    lng: localStorage.getItem('lang')??'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      fr: fr,
      en: en,
      ar: ar
    }
  });

export default i18n;