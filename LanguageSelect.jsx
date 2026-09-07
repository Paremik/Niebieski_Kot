import React from 'react';
import { Globe2 } from 'lucide-react';

import { useLanguage } from './src/i18n/LanguageProvider.jsx';
export { getLanguage } from './src/i18n/LanguageProvider.jsx';

export default function LanguageSelect() {
  const {language, setLanguage: changeLanguage, tr} = useLanguage();
  return <label className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-bold text-slate-600">
    <Globe2 size={15} className="text-sky-500" />
    <span className="sr-only">{tr('Wybierz język')}</span>
    <select value={language} onChange={(event) => changeLanguage(event.target.value)} aria-label={tr('Wybierz język')} className="cursor-pointer bg-transparent focus-visible:outline-sky-500">
      <option value="pl">PL</option><option value="ru">RU</option><option value="en">EN</option>
    </select>
  </label>;
}
