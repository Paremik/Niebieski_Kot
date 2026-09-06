import React, { useState } from 'react';
import { CalendarDays, Cat, Check, Clock3, Coffee, ExternalLink, LogOut, Save, Settings2, ShoppingBasket, Users, X } from 'lucide-react';

const storageKey = 'niebieski-kot-admin-data';
const defaultData = {
  schedule: [
    { day: 'Poniedziałek', hours: 'zamknięte' },
    { day: 'Wtorek–Piątek', hours: '11:00–20:00' },
    { day: 'Sobota–Niedziela', hours: '10:00–20:00' },
  ],
  prices: [
    { name: 'Espresso', price: '10 zł' },
    { name: 'Kocie latte', price: '16 zł' },
    { name: 'Sernik baskijski', price: '19 zł' },
    { name: 'Grzanka z kozim serem', price: '24 zł' },
  ],
  events: [
    { title: 'Joga z kotami', date: 'Każda niedziela · 10:00', places: '8', status: 'Zapisy otwarte' },
    { title: 'Wieczór gier planszowych', date: 'Każdy piątek · 18:00', places: '12', status: 'Zapisy otwarte' },
    { title: 'Dzień adopcji', date: 'Pierwsza niedziela miesiąca', places: '20', status: 'Planowane' },
  ],
  availability: { status: 'Spokojnie', note: 'Dużo wolnych miejsc · aktualizacja ręczna' },
  cats: [
    { name: 'Luna', status: 'Stała gospodyni', note: '4 lata · spokojna obserwatorka' },
    { name: 'Mochi', status: 'Stały gospodarz', note: '6 lat · mistrz drzemek' },
    { name: 'Pixel', status: 'Szuka domu', note: '2 lata · pierwszy do zabawy' },
  ],
};

function loadData() {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  } catch {
    return defaultData;
  }
}

export default function AdminPage() {
  const [data, setData] = useState(loadData);
  const [saved, setSaved] = useState(false);

  const updateRow = (section, index, key, value) => setData((current) => ({ ...current, [section]: current[section].map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row) }));
  const addRow = (section, row) => setData((current) => ({ ...current, [section]: [...current[section], row] }));
  const removeRow = (section, index) => setData((current) => ({ ...current, [section]: current[section].filter((_, rowIndex) => rowIndex !== index) }));
  const save = () => { window.localStorage.setItem(storageKey, JSON.stringify(data)); setSaved(true); window.setTimeout(() => setSaved(false), 2200); };
  const reset = () => { setData(defaultData); window.localStorage.removeItem(storageKey); };

  return <div className="min-h-screen bg-[#f7f8f4] text-slate-950">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8"><a href="/" className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-full bg-sky-500 text-white"><Cat size={20}/></span><span className="text-lg font-extrabold">Niebieski Kot<span className="text-sky-500">.</span></span></a><div className="flex items-center gap-3"><span className="hidden rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 sm:block">Демо-режим · только этот браузер</span><a href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold hover:border-sky-400 hover:text-sky-600"><ExternalLink size={15}/> Открыть сайт</a></div></div></header>
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[.2em] text-sky-600"><Settings2 size={16}/> Panel administracyjny</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Управление кафе</h1><p className="mt-3 max-w-2xl text-slate-600">Изменяйте данные для будущего сайта: расписание, цены, события, доступность и информацию о котах.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-bold hover:border-rose-300 hover:text-rose-600"><LogOut size={15}/> Сбросить</button><button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-sky-600"><Save size={16}/> Сохранить изменения</button></div></div>
      {saved && <div role="status" className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"><Check size={17}/> Сохранено в этом браузере.</div>}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel icon={Clock3} title="Расписание"><div className="space-y-3">{data.schedule.map((row, index) => <div key={`${row.day}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><input aria-label="День" value={row.day} onChange={(event) => updateRow('schedule', index, 'day', event.target.value)} className="admin-input"/><input aria-label="Часы работы" value={row.hours} onChange={(event) => updateRow('schedule', index, 'hours', event.target.value)} className="admin-input"/><IconButton label="Удалить день" onClick={() => removeRow('schedule', index)}/></div>)}</div><AddButton onClick={() => addRow('schedule', { day: 'Новый день', hours: '11:00–20:00' })}>Добавить день</AddButton></Panel>
        <Panel icon={Coffee} title="Цены меню"><div className="space-y-3">{data.prices.map((row, index) => <div key={`${row.name}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_140px_auto]"><input aria-label="Позиция меню" value={row.name} onChange={(event) => updateRow('prices', index, 'name', event.target.value)} className="admin-input"/><input aria-label="Цена" value={row.price} onChange={(event) => updateRow('prices', index, 'price', event.target.value)} className="admin-input"/><IconButton label="Удалить позицию" onClick={() => removeRow('prices', index)}/></div>)}</div><AddButton onClick={() => addRow('prices', { name: 'Новая позиция', price: '0 zł' })}>Добавить позицию</AddButton></Panel>
        <Panel icon={CalendarDays} title="События"><div className="space-y-3">{data.events.map((row, index) => <div key={`${row.title}-${index}`} className="grid gap-2 rounded-2xl bg-slate-50 p-3 sm:grid-cols-[1.2fr_1.2fr_90px_1fr_auto]"><input aria-label="Название события" value={row.title} onChange={(event) => updateRow('events', index, 'title', event.target.value)} className="admin-input"/><input aria-label="Дата события" value={row.date} onChange={(event) => updateRow('events', index, 'date', event.target.value)} className="admin-input"/><input aria-label="Количество мест" value={row.places} onChange={(event) => updateRow('events', index, 'places', event.target.value)} className="admin-input"/><select aria-label="Статус события" value={row.status} onChange={(event) => updateRow('events', index, 'status', event.target.value)} className="admin-input"><option>Записи открыты</option><option>Планируется</option><option>Завершено</option></select><IconButton label="Удалить событие" onClick={() => removeRow('events', index)}/></div>)}</div><AddButton onClick={() => addRow('events', { title: 'Новое событие', date: 'Дата и время', places: '10', status: 'Планируется' })}>Добавить событие</AddButton></Panel>
        <Panel icon={Users} title="Свободные места"><div className="grid gap-3 sm:grid-cols-2"><label className="admin-label">Статус<select value={data.availability.status} onChange={(event) => setData((current) => ({ ...current, availability: { ...current.availability, status: event.target.value } }))} className="admin-input"><option>Спокойно</option><option>Умеренно занято</option><option>Почти нет мест</option><option>Полностью занято</option></select></label><label className="admin-label">Подпись<input value={data.availability.note} onChange={(event) => setData((current) => ({ ...current, availability: { ...current.availability, note: event.target.value } }))} className="admin-input"/></label></div><p className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm leading-relaxed text-slate-600">Этот статус можно вывести на главном экране рядом с кнопкой бронирования.</p></Panel>
        <Panel icon={Cat} title="Информация о котах" wide><div className="grid gap-3 md:grid-cols-3">{data.cats.map((row, index) => <div key={`${row.name}-${index}`} className="rounded-2xl bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between"><strong>{row.name}</strong><IconButton label={`Удалить ${row.name}`} onClick={() => removeRow('cats', index)}/></div><input aria-label="Имя кота" value={row.name} onChange={(event) => updateRow('cats', index, 'name', event.target.value)} className="admin-input"/><input aria-label="Статус кота" value={row.status} onChange={(event) => updateRow('cats', index, 'status', event.target.value)} className="admin-input mt-2"/><input aria-label="Короткое описание кота" value={row.note} onChange={(event) => updateRow('cats', index, 'note', event.target.value)} className="admin-input mt-2"/></div>)}</div><AddButton onClick={() => addRow('cats', { name: 'Новый кот', status: 'Новый статус', note: 'Возраст · характер' })}>Добавить кота</AddButton></Panel>
      </div>
      <p className="mt-8 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"><ShoppingBasket size={18} className="mt-0.5 shrink-0"/><span><strong>Важно:</strong> это локальная демонстрационная админка. Данные сохраняются только в localStorage текущего браузера и пока не меняют публичные данные на Vercel. Для запуска нужны авторизация, база данных и серверный API.</span></p>
    </main>
  </div>;
}

function Panel({ icon: Icon, title, children, wide = false }) { return <section className={`rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${wide ? 'lg:col-span-2' : ''}`}><h2 className="mb-5 flex items-center gap-3 text-xl font-black"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-600"><Icon size={19}/></span>{title}</h2>{children}</section>; }
function AddButton({ onClick, children }) { return <button type="button" onClick={onClick} className="mt-4 rounded-full border border-dashed border-sky-300 px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-50">+ {children}</button>; }
function IconButton({ label, onClick }) { return <button type="button" aria-label={label} onClick={onClick} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-500"><X size={16}/></button>; }
