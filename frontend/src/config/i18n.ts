import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    supportedLngs: ['en', 'hi', 'te', 'ta', 'bn', 'mr'],
  });

export default i18n;
