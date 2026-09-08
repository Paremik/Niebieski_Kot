import { Link } from 'react-router-dom';
import React from 'react';
import { ArrowLeft, CalendarDays, Cat, Check, Clock3, Heart, Home, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import LanguageSelect from './LanguageSelect.jsx';
import { useLanguage } from './src/i18n/LanguageProvider.jsx';
import { localizeData } from './src/i18n/translate.js';
import { catProfiles } from './src/data/catProfiles.js';
import { useSiteContent } from './src/content/SiteContentProvider.jsx';
export { catProfiles };
export default function CatProfilePage({
  slug
}) {
  const {
    language,
    tr
  } = useLanguage();
  const { data: siteContent, text } = useSiteContent();
  const baseCat = localizeData(catProfiles[slug], language);
  const override = siteContent.cats.find(item => item.slug === slug);
  const statusLabels = { resident: { pl:'Stały gospodarz', ru:'Постоянный житель', en:'Permanent resident' }, adoption: { pl:'Szuka domu', ru:'Ищет дом', en:'Looking for a home' }, reserved: { pl:'Adopcja w toku', ru:'Усыновление оформляется', en:'Adoption pending' } };
  const cat = override ? { ...baseCat, name: override.name, tagline: text(override.note), intro: text(override.intro), status: statusLabels[override.status]?.[language] || baseCat.status } : baseCat;
  const ui = localizeData({
    resident: 'Poznaj naszego rezydenta',
    age: 'Wiek',
    joined: 'Z nami od',
    health: 'Zdrowie',
    status: 'Status',
    healthTitle: 'Karta weterynaryjna',
    character: 'Charakter',
    signal: 'Sygnał „mam dość”:',
    likes: 'Co kocha',
    respect: 'Co warto uszanować',
    day: 'Typowy dzień',
    concept: 'Imię, historia i dane zdrowotne są demonstracyjne — nie stanowią rzeczywistej dokumentacji weterynaryjnej.'
  }, language);
  const facts = [{
    icon: CalendarDays,
    label: ui.age,
    value: cat.age,
    note: cat.birth
  }, {
    icon: Home,
    label: ui.joined,
    value: cat.joined,
    note: cat.origin
  }, {
    icon: Stethoscope,
    label: ui.health,
    value: cat.healthStatus,
    note: cat.healthNote
  }, {
    icon: Heart,
    label: ui.status,
    value: cat.status,
    note: cat.statusNote
  }];
  return <div className="min-h-screen bg-[#f7f8f4] text-slate-950 selection:bg-sky-200">
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-[#f7f8f4]/90 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8"><Link to="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white"><Cat size={19} /></span><span className="text-lg font-extrabold tracking-tight">Niebieski Kot<span className="text-sky-500">.</span></span></Link><div className="flex items-center gap-2"><LanguageSelect /><Link to="/#cats" className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-sky-400 hover:text-sky-600"><ArrowLeft size={16} /> {language === 'ru' ? 'Все коты' : language === 'en' ? 'All cats' : 'Wszystkie koty'}</Link></div></div></nav>
    <main>
      <header className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-20">
        <div className="relative"><div className="aspect-[4/5] overflow-hidden rounded-[3rem] bg-sky-100 shadow-2xl"><img src={cat.image} alt={cat.imageAlt} className="h-full w-full object-cover" /></div><span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-sm font-black text-amber-950 shadow-lg"><Heart size={16} fill="currentColor" /> {cat.badge}</span></div>
        <div><p className="text-sm font-extrabold uppercase tracking-[.22em] text-sky-600">{ui.resident}</p><h1 className="mt-4 text-7xl font-black tracking-[-.05em] sm:text-8xl">{cat.name}<span className="text-sky-500">.</span></h1><p className="mt-5 text-xl font-bold text-slate-700">{cat.tagline}</p><p className="mt-5 max-w-xl leading-relaxed text-slate-600">{cat.intro}</p><div className="mt-8 rounded-3xl border border-sky-200 bg-sky-50 p-5"><p className="flex items-center gap-2 font-extrabold text-sky-800"><Sparkles size={18} /> {cat.summaryTitle}</p><p className="mt-2 text-sm leading-relaxed text-sky-950/70">{cat.summary}</p></div></div>
      </header>
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{facts.map(({
            icon: Icon,
            label,
            value,
            note
          }) => <article key={label} className="rounded-3xl border border-slate-200 bg-white p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-100 text-sky-600"><Icon size={20} /></span><p className="mt-5 text-xs font-extrabold uppercase tracking-[.16em] text-slate-400">{label}</p><h2 className="mt-1 text-xl font-black">{value}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">{note}</p></article>)}</div></section>
      <section className="bg-slate-950 py-20 text-white"><div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-400">{cat.historyLabel}</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{cat.historyTitle}</h2></div><div className="space-y-5 text-lg leading-relaxed text-slate-300">{cat.story.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div></section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-20 sm:px-8 lg:grid-cols-2"><article className="rounded-[2.5rem] bg-white p-7 sm:p-9"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-emerald-600">{ui.health}</p><h2 className="mt-3 text-3xl font-black">{ui.healthTitle}</h2><p className="mt-4 leading-relaxed text-slate-600">{cat.healthIntro}</p><ul className="mt-7 space-y-3">{cat.health.map(item => <li key={item} className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-950"><Check size={18} className="shrink-0 text-emerald-600" />{item}</li>)}</ul></article>
        <article className="rounded-[2.5rem] bg-sky-500 p-7 text-white sm:p-9"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-sky-100">{ui.character}</p><h2 className="mt-3 text-3xl font-black">{cat.friendshipTitle}</h2><p className="mt-4 leading-relaxed text-sky-50">{cat.friendship}</p><div className="mt-7 grid grid-cols-3 gap-3 text-center">{cat.traits.map(trait => <Trait key={trait.label} {...trait} />)}</div><p className="mt-7 rounded-2xl bg-white/15 p-4 text-sm leading-relaxed ring-1 ring-white/20"><strong>{ui.signal}</strong> {cat.signal}</p></article></section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-20 sm:px-8 lg:grid-cols-2"><ListCard title={ui.likes} intro={language === "ru" ? "Эти вещи почти всегда поднимают настроение." : language === "en" ? "These things almost always improve their mood." : "Te rzeczy prawie zawsze poprawiają humor."} items={cat.likes} tone="amber" /><ListCard title={ui.respect} intro={language === "ru" ? "Несколько простых правил помогают чувствовать себя в безопасности." : language === "en" ? "A few simple rules help them feel safe." : "Kilka prostych zasad pomaga czuć się bezpiecznie."} items={cat.boundaries} tone="slate" /></section>
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8"><div className="grid gap-10 rounded-[3rem] border border-slate-200 bg-white p-7 sm:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-extrabold uppercase tracking-[.18em] text-sky-600">{ui.day}</p><h2 className="mt-3 text-4xl font-black tracking-tight">{cat.routineTitle}</h2><p className="mt-4 leading-relaxed text-slate-600">{cat.routineIntro}</p></div><div className="space-y-4">{cat.routine.map(([time, text]) => <Routine key={time} time={time} text={text} />)}</div></div></section>
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8"><div className="overflow-hidden rounded-[3rem] bg-amber-300 p-8 sm:p-12"><div className="grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-end"><div><p className="text-sm font-extrabold uppercase tracking-[.18em] text-amber-900">{cat.placeLabel}</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{cat.placeTitle}</h2><p className="mt-5 max-w-2xl leading-relaxed text-amber-950/75">{cat.placeText}</p></div><div className="rounded-3xl bg-white/65 p-5"><p className="flex items-center gap-2 font-black"><ShieldCheck size={19} /> {cat.sideTitle}</p><p className="mt-2 text-sm leading-relaxed text-amber-950/70">{cat.sideText}</p></div></div></div></section>
      <p className="mx-auto max-w-2xl px-5 pb-10 text-center text-xs leading-relaxed text-slate-500">{cat.name} · {ui.concept}</p>
    </main>
  </div>;
}
function Trait({
  value,
  label
}) {
  return <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20"><strong className="block text-xl">{value}</strong><span className="text-xs text-sky-100">{label}</span></div>;
}
function ListCard({
  title,
  intro,
  items,
  tone
}) {
  const warm = tone === 'amber';
  return <article className={`rounded-[2.5rem] p-7 sm:p-9 ${warm ? 'bg-amber-100' : 'bg-slate-200'}`}><h2 className="text-3xl font-black">{title}</h2><p className="mt-3 text-slate-600">{intro}</p><ul className="mt-6 flex flex-wrap gap-2">{items.map(item => <li key={item} className={`rounded-full px-4 py-2 text-sm font-bold ${warm ? 'bg-white text-amber-950' : 'bg-white text-slate-800'}`}>{item}</li>)}</ul></article>;
}
function Routine({
  time,
  text
}) {
  return <div className="flex gap-4 rounded-2xl bg-slate-50 p-4"><span className="flex shrink-0 items-center gap-2 font-black text-sky-600"><Clock3 size={17} />{time}</span><p className="text-sm leading-relaxed text-slate-600">{text}</p></div>;
}
