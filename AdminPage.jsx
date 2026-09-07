import { Link } from 'react-router-dom';
import LanguageSelect from './LanguageSelect.jsx';
import { storageKey, defaultData, normalizeAdminData, loadAdminData, validAdminData } from './src/data/adminData.js';
import { useLanguage } from './src/i18n/LanguageProvider.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, Cat, Check, Clock3, Coffee, ExternalLink, LogOut, Save, Settings2, ShoppingBasket, Users, X } from 'lucide-react';
export default function AdminPage() {
  const {
    tr
  } = useLanguage();
  const [data, setData] = useState(loadAdminData);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const counter = useRef(0);
  useEffect(() => {
    const warn = event => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const updateData = change => {
    setData(change);
    setDirty(true);
    setSaved(false);
    setError('');
  };
  const updateRow = (section, index, key, value) => updateData(current => ({
    ...current,
    [section]: current[section].map((row, rowIndex) => rowIndex === index ? {
      ...row,
      [key]: value
    } : row)
  }));
  const addRow = (section, row) => updateData(current => ({
    ...current,
    [section]: [...current[section], {
      ...row,
      id: "new-" + ++counter.current
    }]
  }));
  const removeRow = (section, index) => updateData(current => ({
    ...current,
    [section]: current[section].filter((_, rowIndex) => rowIndex !== index)
  }));
  const save = () => {
    if (!validAdminData(data)) {
      setError('Проверьте поля: цены и количество мест не могут быть отрицательными или пустыми.');
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(data));
      setSaved(true);
      setDirty(false);
      setError('');
    } catch {
      setError('Не удалось сохранить. Разрешите хранение данных в браузере.');
    }
  };
  const reset = () => {
    if (!window.confirm(tr('Сбросить все локальные изменения?'))) return;
    try {
      window.localStorage.removeItem(storageKey);
      setData(normalizeAdminData(null));
      setSaved(false);
      setDirty(false);
      setError('');
    } catch {
      setError('Не удалось сохранить. Разрешите хранение данных в браузере.');
    }
  };
  return <div className="min-h-screen bg-[#f7f8f4] text-slate-950">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8"><Link to="/" className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-full bg-sky-500 text-white"><Cat size={20} /></span><span className="text-lg font-extrabold">Niebieski Kot<span className="text-sky-500">.</span></span></Link><div className="flex flex-wrap items-center gap-3"><LanguageSelect /><span className="hidden rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 sm:block">{tr("Демо-режим · только этот браузер")}</span><Link to="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold hover:border-sky-400 hover:text-sky-600"><ExternalLink size={15} />{tr("Открыть сайт")}</Link></div></div></header>
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[.2em] text-sky-600"><Settings2 size={16} />{tr("Panel administracyjny")}</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{tr("Управление кафе")}</h1><p className="mt-3 max-w-2xl text-slate-600">{tr("Изменяйте данные для будущего сайта: расписание, цены, события, доступность и информацию о котах.")}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-bold hover:border-rose-300 hover:text-rose-600"><LogOut size={15} />{tr("Сбросить")}</button><button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-sky-600"><Save size={16} />{tr("Сохранить изменения")}</button></div></div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-4 text-rose-700">{tr(error)}</p>}
      {dirty && <p role="status" className="mb-4 text-sm text-amber-800">{tr('Есть несохранённые изменения.')}</p>}
      {saved && <div role="status" className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"><Check size={17} />{tr("Сохранено в этом браузере.")}</div>}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel icon={Clock3} title={tr("Расписание")}><div className="space-y-3">{data.schedule.map((row, index) => <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><input maxLength={500} aria-label={tr("День")} value={tr(row.day)} onChange={event => updateRow('schedule', index, 'day', event.target.value)} className="admin-input" /><input maxLength={500} aria-label={tr("Часы работы")} value={tr(row.hours)} onChange={event => updateRow('schedule', index, 'hours', event.target.value)} className="admin-input" /><IconButton label={tr("Удалить день")} onClick={() => removeRow('schedule', index)} /></div>)}</div><AddButton onClick={() => addRow('schedule', {
            day: 'Новый день',
            hours: '11:00–20:00'
          })}>{tr("Добавить день")}</AddButton></Panel>
        <Panel icon={Coffee} title={tr("Цены меню")}><div className="space-y-3">{data.prices.map((row, index) => <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_140px_auto]"><input maxLength={500} aria-label={tr("Позиция меню")} value={tr(row.name)} onChange={event => updateRow('prices', index, 'name', event.target.value)} className="admin-input" /><input maxLength={500} aria-label={tr("Цена")} value={row.price} onChange={event => updateRow('prices', index, 'price', event.target.value)} className="admin-input" /><IconButton label={tr("Удалить позицию")} onClick={() => removeRow('prices', index)} /></div>)}</div><AddButton onClick={() => addRow('prices', {
            name: 'Новая позиция',
            price: '0 zł'
          })}>{tr("Добавить позицию")}</AddButton></Panel>
        <Panel icon={CalendarDays} title={tr("События")}><div className="space-y-3">{data.events.map((row, index) => <div key={row.id} className="grid gap-2 rounded-2xl bg-slate-50 p-3 sm:grid-cols-2"><input maxLength={500} aria-label={tr("Название события")} value={tr(row.title)} onChange={event => updateRow('events', index, 'title', event.target.value)} className="admin-input" /><input maxLength={500} aria-label={tr("Дата события")} value={tr(row.date)} onChange={event => updateRow('events', index, 'date', event.target.value)} className="admin-input" /><input maxLength={500} type="number" min="0" max="1000" step="1" aria-label={tr("Количество мест")} value={row.places} onChange={event => updateRow('events', index, 'places', event.target.value)} className="admin-input" /><select aria-label={tr("Статус события")} value={row.status} onChange={event => updateRow('events', index, 'status', event.target.value)} className="admin-input"><option value="Zapisy otwarte">{tr("Zapisy otwarte")}</option><option value="Planowane">{tr("Planowane")}</option><option value="Zakończone">{tr("Zakończone")}</option></select><IconButton label={tr("Удалить событие")} onClick={() => removeRow('events', index)} /></div>)}</div><AddButton onClick={() => addRow('events', {
            title: 'Новое событие',
            date: 'Дата и время',
            places: '10',
            status: 'Planowane'
          })}>{tr("Добавить событие")}</AddButton></Panel>
        <Panel icon={Users} title={tr("Свободные места")}><div className="grid gap-3 sm:grid-cols-2"><label className="admin-label">{tr("Статус")}<select value={data.availability.status} onChange={event => updateData(current => ({
                ...current,
                availability: {
                  ...current.availability,
                  status: event.target.value
                }
              }))} className="admin-input"><option value="Spokojnie">{tr("Spokojnie")}</option><option value="Umiarkowanie zajęte">{tr("Umiarkowanie zajęte")}</option><option value="Prawie pełno">{tr("Prawie pełno")}</option><option value="Brak miejsc">{tr("Brak miejsc")}</option></select></label><label className="admin-label">{tr("Подпись")}<input value={tr(data.availability.note)} onChange={event => updateData(current => ({
                ...current,
                availability: {
                  ...current.availability,
                  note: event.target.value
                }
              }))} className="admin-input" /></label></div><p className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm leading-relaxed text-slate-600">{tr("Этот статус можно вывести на главном экране рядом с кнопкой бронирования.")}</p></Panel>
        <Panel icon={Cat} title={tr("Информация о котах")} wide><div className="grid gap-3 md:grid-cols-3">{data.cats.map((row, index) => <div key={row.id} className="rounded-2xl bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><strong>{row.name}</strong><IconButton label={tr("Удалить {name}", {
                  name: row.name
                })} onClick={() => removeRow('cats', index)} /></div><input maxLength={500} aria-label={tr("Имя кота")} value={tr(row.name)} onChange={event => updateRow('cats', index, 'name', event.target.value)} className="admin-input" /><input maxLength={500} aria-label={tr("Статус кота")} value={tr(row.status)} onChange={event => updateRow('cats', index, 'status', event.target.value)} className="admin-input mt-2" /><input maxLength={500} aria-label={tr("Короткое описание кота")} value={tr(row.note)} onChange={event => updateRow('cats', index, 'note', event.target.value)} className="admin-input mt-2" /></div>)}</div><AddButton onClick={() => addRow('cats', {
            name: 'Новый кот',
            status: 'Новый статус',
            note: 'Возраст · характер'
          })}>{tr("Добавить кота")}</AddButton></Panel>
      </div>
      <p className="mt-8 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"><ShoppingBasket size={18} className="mt-0.5 shrink-0" /><span><strong>{tr("Важно:")}</strong>{tr("это локальная демонстрационная админка. Данные сохраняются только в localStorage текущего браузера и пока не меняют публичные данные на Vercel. Для запуска нужны авторизация, база данных и серверный API.")}</span></p>
    </main>
  </div>;
}
function Panel({
  icon: Icon,
  title,
  children,
  wide = false
}) {
  return <section className={`rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${wide ? 'lg:col-span-2' : ''}`}><h2 className="mb-5 flex items-center gap-3 text-xl font-black"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-600"><Icon size={19} /></span>{title}</h2>{children}</section>;
}
function AddButton({
  onClick,
  children
}) {
  return <button type="button" onClick={onClick} className="mt-4 rounded-full border border-dashed border-sky-300 px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-50">+ {children}</button>;
}
function IconButton({
  label,
  onClick
}) {
  return <button type="button" aria-label={label} onClick={onClick} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-500"><X size={16} /></button>;
}
