import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import viCommon from './locales/vi/common.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      vi: { common: viCommon },
    },
    fallbackLng: 'vi',
    defaultNS: 'common',
    debug: false,
    saveMissing: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'nghia-lang',
      caches: ['localStorage'],
    },
    supportedLngs: ['vi', 'en'],
  })

export default i18n
