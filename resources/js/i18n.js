import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './lang/fr.json';
import adminFr from './lang/admin-fr.json';
import en from './lang/en.json';
import ar from './lang/ar.json';

const savedLanguage = localStorage.getItem('lang');
const initialLanguage = window.location.pathname.startsWith('/admin')
  ? (['fr', 'ar'].includes(savedLanguage) ? savedLanguage : 'fr')
  : (savedLanguage ?? 'en');

i18n
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    lng: initialLanguage,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      fr: {
        translation: {
          ...fr.translation,
          admin: adminFr,
        },
      },
      en: en,
      ar: ar
    }
  });

export default i18n;
