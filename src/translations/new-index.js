import { vietnameseTranslations } from './vi.js';
import { englishTranslations } from './en.js';

export const translations = {
  vi: vietnameseTranslations,
  en: englishTranslations
};

export const getTranslation = (language, key) => {
  const keys = key.split('.');
  let translation = translations[language];
  
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      return key; // Fallback to key if translation not found
    }
  }
  
  return translation;
};
