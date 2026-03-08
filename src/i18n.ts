import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';

const resources: Record<string, { translation: Record<string, string> }> = {
  en: { translation: en },
};

const lazyLanguages = ['hi', 'es', 'fr', 'de', 'it', 'pt', 'id', 'tr', 'vi'];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export const COUNTRY_MAP = [
  { country: 'United States', flag: '🇺🇸', lang: 'en' },
  { country: 'United Kingdom', flag: '🇬🇧', lang: 'en' },
  { country: 'India', flag: '🇮🇳', lang: 'hi' },
  { country: 'Spain', flag: '🇪🇸', lang: 'es' },
  { country: 'France', flag: '🇫🇷', lang: 'fr' },
  { country: 'Germany', flag: '🇩🇪', lang: 'de' },
  { country: 'Italy', flag: '🇮🇹', lang: 'it' },
  { country: 'Brazil', flag: '🇧🇷', lang: 'pt' },
  { country: 'Indonesia', flag: '🇮🇩', lang: 'id' },
  { country: 'Turkey', flag: '🇹🇷', lang: 'tr' },
  { country: 'Vietnam', flag: '🇻🇳', lang: 'vi' },
];

export async function loadLanguage(lang: string) {
  if (resources[lang]) return;
  try {
    const mod = await import(`./locales/${lang}.json`);
    resources[lang] = { translation: mod.default };
    i18n.addResourceBundle(lang, 'translation', mod.default, true, true);
  } catch {
    console.warn(`Failed to load language: ${lang}`);
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', ...lazyLanguages],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'siteLanguage',
      caches: ['localStorage'],
    },
  });

// Auto-load detected language
const detected = i18n.language?.split('-')[0];
if (detected && detected !== 'en' && lazyLanguages.includes(detected)) {
  loadLanguage(detected);
}

export default i18n;
