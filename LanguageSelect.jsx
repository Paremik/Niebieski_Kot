import React, { useState } from 'react';
import { Globe2 } from 'lucide-react';

export function getLanguage() {
  const saved = window.localStorage.getItem('niebieski-kot-language');
  return saved === 'ru' || saved === 'en' ? saved : 'pl';
}

export default function LanguageSelect() {
  const [language, setLanguage] = useState(getLanguage);
  const changeLanguage = (next) => {
    setLanguage(next);
    window.localStorage.setItem('niebieski-kot-language', next);
    window.location.reload();
  };
  return <label className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-bold text-slate-600">
    <Globe2 size={15} className="text-sky-500" />
    <span className="sr-only">Wybierz język</span>
    <select value={language} onChange={(event) => changeLanguage(event.target.value)} aria-label="Wybierz język" className="cursor-pointer bg-transparent outline-none">
      <option value="pl">PL</option><option value="ru">RU</option><option value="en">EN</option>
    </select>
  </label>;
}
