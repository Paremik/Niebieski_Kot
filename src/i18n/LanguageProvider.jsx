import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { normalizeLanguage, translate } from './translate.js';

export const languageStorageKey = 'niebieski-kot-language';
export function getLanguage() {
  try { return normalizeLanguage(window.localStorage.getItem(languageStorageKey)); }
  catch { return 'pl'; }
}
const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLanguage }) {
  const [language, updateLanguage] = useState(() => normalizeLanguage(initialLanguage ?? getLanguage()));
  const setLanguage = useCallback(value => {
    const next = normalizeLanguage(value);
    updateLanguage(next);
    try { window.localStorage.setItem(languageStorageKey, next); } catch { /* Usable even when storage is blocked. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const sync = event => { if (event.key === languageStorageKey) updateLanguage(normalizeLanguage(event.newValue)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const value = useMemo(() => ({language, setLanguage, tr: (source, values) => translate(source, language, values)}), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required');
  return context;
}
