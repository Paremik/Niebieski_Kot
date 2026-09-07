import catalog from './catalog.json';
import additions from './additions.js';
import profiles from './profiles.js';
import admin from './admin.js';

export const languages = ['pl', 'ru', 'en'];
export const normalizeLanguage = (value) => languages.includes(value) ? value : 'pl';
export const missingTranslations = new Set();
export const messages = { ...catalog, ...additions, ...profiles, ...admin };

export function translate(source, language, values = {}) {
  if (typeof source !== 'string') return source;
  const locale = normalizeLanguage(language);
  const entry = messages[source];
  if (entry && !entry[locale]) missingTranslations.add(`${locale}: ${source}`);
  const translated = entry?.[locale] ?? source;
  return translated.replace(/\{(\w+)\}/g, (match, key) => Object.hasOwn(values, key) ? String(values[key]) : match);
}

// Data is localized before rendering; functions (icons), IDs and image URLs stay intact.
export function localizeData(value, language) {
  if (typeof value === 'string') return translate(value, language);
  if (Array.isArray(value)) return value.map(item => localizeData(item, language));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeData(item, language)]));
  return value;
}
