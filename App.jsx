import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, Cat, Check, Clock3, Coffee, Heart, Instagram, MapPin, Menu, MessageCircle, PawPrint, Send, ShieldCheck, Sparkles, X } from 'lucide-react';

const cats = [
  { name: 'Luna', note: 'spokojna obserwatorka', image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=85&w=900&auto=format&fit=crop' },
  { name: 'Mochi', note: 'mistrz popołudniowych drzemek', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=85&w=900&auto=format&fit=crop' },
  { name: 'Pixel', note: 'pierwszy do wspólnej zabawy', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=85&w=900&auto=format&fit=crop' },
];
const cards = [
  { icon: Coffee, title: 'Kawa specialty', text: 'Klasyki, przelew i sezonowe kompozycje przygotowywane na dobrym ziarnie.' },
  { icon: Sparkles, title: 'Coś słodkiego', text: 'Ciasta i desery, także roślinne — aktualna karta zmienia się co tydzień.' },
  { icon: Heart, title: 'Pomoc, która mruczy', text: 'Każda wizyta wspiera opiekę nad rezydentami i lokalne działania adopcyjne.' },
];
const rules = [
  'Przed wejściem do strefy kotów dezynfekujemy ręce.',
  'Pozwalamy kotom decydować o kontakcie — nie budzimy ich i nie bierzemy na ręce.',
  'Zdjęcia robimy bez lampy błyskowej, z szacunkiem dla kociego spokoju.',
  'Dzieci zapraszamy pod stałą opieką dorosłych; szczegóły potwierdzi obsługa.',
  'Własne jedzenie oraz smakołyki dla kotów zostawiamy poza lokalem.',
];

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Cześć! 🐾 Zapytaj mnie o godziny, zasady, menu albo naszych rezydentów.' }]);
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, chatOpen]);
  const scrollTo = (id) => { setMobileMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  const isOpen = new Date().getHours() >= 12 && new Date().getHours() < 19;
  const send = () => {
    const text = input.trim().slice(0, 200); if (!text || loading) return;
    setMessages((m) => [...m, { role: 'user', content: text }]); setInput(''); setLoading(true);
    window.setTimeout(() => {
      const q = text.toLowerCase(); let reply = 'Najlepiej opowiem Ci o godzinach, zasadach, menu lub kotach. Dane kontaktowe i rezerwacje pojawią się przed otwarciem.';
      if (q.includes('godzin') || q.includes('otwar')) reply = 'Planujemy być otwarci codziennie od 12:00 do 19:00. Przed wizytą sprawdź aktualności — godziny mogą jeszcze ulec zmianie.';
      else if (q.includes('dziec') || q.includes('wiek')) reply = 'Dzieci zapraszamy pod stałą opieką dorosłych. Dokładne zasady wiekowe opublikujemy wraz z regulaminem lokalu.';
      else if (q.includes('menu') || q.includes('kaw') || q.includes('ciast')) reply = 'W karcie znajdą się kawy specialty, herbaty, lemoniady i zmieniające się co tydzień desery — również roślinne.';
      else if (q.includes('kot') || q.includes('adopc')) reply = 'Nasi rezydenci mają własne charaktery i spokojne miejsca do odpoczynku. Wspieramy też lokalne działania adopcyjne.';
      else if (q.includes('adres') || q.includes('gdzie') || q.includes('rezerw')) reply = 'Kawiarnia powstaje w Opolu. Dokładny adres i system rezerwacji opublikujemy przed otwarciem.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]); setLoading(false);
    }, 650);
  };
  const links = [['about', 'O nas'], ['cats', 'Koty'], ['menu', 'Menu'], ['rules', 'Zasady'], ['visit', 'Wizyta']];

  return <div className="min-h-screen overflow-x-hidden bg-[#f7f8f4] text-slate-950 selection:bg-sky-200">
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/50 bg-[#f7f8f4]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <button onClick={() => scrollTo('top')} className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white"><Cat size={19}/></span><span className="text-lg font-extrabold tracking-tight">Niebieski Kot<span className="text-sky-500">.</span></span></button>
        <div className="hidden items-center gap-7 md:flex">{links.map(([id,label]) => <button key={id} onClick={() => scrollTo(id)} className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">{label}</button>)}</div>
        <button onClick={() => setChatOpen(true)} className="hidden items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sky-600 md:flex">Zapytaj nas <ArrowRight size={15}/></button>
        <button onClick={() => setMobileMenu(!mobileMenu)} className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 md:hidden" aria-label="Menu">{mobileMenu ? <X/> : <Menu/>}</button>
      </div>
      {mobileMenu && <div className="border-t border-slate-200 bg-[#f7f8f4] px-5 py-5 md:hidden">{links.map(([id,label]) => <button key={id} onClick={() => scrollTo(id)} className="block w-full border-b border-slate-200 py-3 text-left font-bold">{label}</button>)}</div>}
    </nav>

    <main id="top">
      <header className="mx-auto grid min-h-[780px] max-w-6xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3.5 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-sky-700 shadow-sm"><span className={`h-2 w-2 rounded-full ${isOpen ? 'animate-pulse bg-emerald-500' : 'bg-slate-400'}`}/>{isOpen ? 'Otwarte teraz' : 'Dziś 12:00–19:00'}</div>
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[.22em] text-sky-600">Kocia kawiarnia · Opole</p>
          <h1 className="text-5xl font-black leading-[.98] tracking-[-.045em] sm:text-7xl lg:text-[5.25rem]">Zwolnij.<br/>Kawa stygnie,<br/><span className="text-sky-500">koty nie.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-600">Spokojne miejsce na dobrą kawę, miękki fotel i spotkanie z kotami, które naprawdę nadają temu miejscu rytm.</p>
          <div className="mt-9 flex flex-wrap gap-3"><button onClick={() => scrollTo('visit')} className="flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-sky-600">Zaplanuj wizytę <ArrowRight size={18}/></button><button onClick={() => scrollTo('cats')} className="rounded-full border border-slate-300 bg-white px-6 py-3.5 font-bold hover:border-sky-400 hover:text-sky-600">Poznaj koty</button></div>
          <div className="mt-12 flex flex-wrap gap-7 text-sm font-semibold text-slate-500"><span className="flex items-center gap-2"><Heart size={17} className="text-sky-500"/> Wspieramy adopcje</span><span className="flex items-center gap-2"><Coffee size={17} className="text-sky-500"/> Specialty coffee</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px]"><div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-sky-200/60 blur-2xl"/><div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-sky-100 shadow-2xl"><img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=85&w=1200&auto=format&fit=crop" alt="Kot odpoczywający w kawiarni" className="h-full w-full object-cover"/><div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/40 bg-white/80 p-5 backdrop-blur-xl"><div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-sky-500 text-white"><PawPrint size={21}/></span><div><p className="font-extrabold">Tu kot wybiera Ciebie</p><p className="text-sm text-slate-600">Usiądź wygodnie i daj mu chwilę.</p></div></div></div></div><div className="absolute -right-4 top-16 rotate-6 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black shadow-lg sm:-right-8">zero pośpiechu ✦</div></div>
      </header>

      <section id="about" className="bg-slate-950 py-24 text-white"><div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-400">Nasza idea</span><h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">Dobre rzeczy dzieją się wolniej.</h2></div><div className="grid gap-5 sm:grid-cols-2"><p className="text-lg leading-relaxed text-slate-300">Tworzymy kameralną kawiarnię, w której dobrostan kotów jest równie ważny jak smak espresso.</p><p className="text-lg leading-relaxed text-slate-300">Każdy rezydent ma własną historię, charakter i przestrzeń. Ty dostajesz chwilę oddechu — on wybór, czy chce dołączyć.</p></div></div></section>

      <section id="cats" className="mx-auto max-w-6xl px-5 py-24 sm:px-8"><div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">Nasi gospodarze</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Poznaj ekipę.</h2></div><p className="max-w-md text-slate-600">Każdy inny. Każdy u siebie. Sylwetki naszych pierwszych rezydentów.</p></div><div className="grid gap-5 md:grid-cols-3">{cats.map((cat,i) => <article key={cat.name} className={`group overflow-hidden rounded-[2rem] bg-white shadow-sm ${i === 1 ? 'md:translate-y-8' : ''}`}><div className="aspect-[4/5] overflow-hidden"><img src={cat.image} alt={`Kot ${cat.name}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/></div><div className="flex items-center justify-between p-5"><div><h3 className="text-xl font-black">{cat.name}</h3><p className="mt-1 text-sm text-slate-500">{cat.note}</p></div><PawPrint className="text-sky-400"/></div></article>)}</div></section>

      <section id="menu" className="mx-auto max-w-6xl px-5 py-24 sm:px-8"><div className="overflow-hidden rounded-[3rem] bg-sky-500 px-6 py-14 text-white sm:px-12 lg:px-16"><div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-100">W filiżance i obok</span><h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Prosto.<br/>Sezonowo.<br/>Pysznie.</h2></div><div className="grid gap-4">{cards.map(({icon:Icon,title,text}) => <div key={title} className="flex gap-5 rounded-3xl bg-white/10 p-5 ring-1 ring-white/20"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-sky-600"><Icon size={22}/></span><div><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-sky-50">{text}</p></div></div>)}</div></div></div></section>

      <section id="rules" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">Koci savoir-vivre</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Kilka zasad.<br/>Dużo spokoju.</h2><p className="mt-5 max-w-md leading-relaxed text-slate-600">To dom naszych rezydentów. Proste reguły sprawiają, że wszystkim — na dwóch i czterech łapach — jest tu dobrze.</p></div><ul className="space-y-3">{rules.map((rule) => <li key={rule} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600"><Check size={14}/></span><span className="text-sm font-semibold leading-relaxed text-slate-700">{rule}</span></li>)}</ul></section>

      <section id="visit" className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8"><div className="grid overflow-hidden rounded-[3rem] bg-white shadow-xl lg:grid-cols-[1fr_.9fr]"><div className="p-7 sm:p-12"><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">Zanim wpadniesz</span><h2 className="mt-3 text-4xl font-black tracking-tight">Zaplanuj miękkie lądowanie.</h2><div className="mt-9 space-y-5"><Info icon={Clock3} title="Codziennie · 12:00–19:00" text="Godziny mogą ulec zmianie przed oficjalnym otwarciem."/><Info icon={MapPin} title="Opole" text="Dokładny adres ogłosimy wkrótce."/><Info icon={CalendarDays} title="Rezerwacje już wkrótce" text="Na razie zapytaj asystenta o szczegóły wizyty."/></div><button onClick={() => setChatOpen(true)} className="mt-9 flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 font-bold text-white transition hover:-translate-y-1 hover:bg-sky-600">Zapytaj asystenta <MessageCircle size={18}/></button></div><div className="relative min-h-[380px]"><img src="https://images.unsplash.com/photo-1511081692775-05d0f180a065?q=85&w=1200&auto=format&fit=crop" alt="Przytulne wnętrze kawiarni" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent"/></div></div></section>
    </main>

    <footer className="border-t border-slate-200 bg-white py-10"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div className="flex items-center gap-2 font-extrabold"><Cat className="text-sky-500"/> Niebieski Kot.</div><p className="text-sm text-slate-500">Kocia kawiarnia w Opolu · projekt w przygotowaniu</p><a href="https://www.instagram.com/arte.rikk" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold hover:text-sky-600"><Instagram size={18}/> Instagram</a></div></footer>

    <div className="fixed bottom-5 right-5 z-50">{chatOpen && <div className="mb-3 flex h-[min(520px,calc(100vh-110px))] w-[calc(100vw-40px)] max-w-[370px] flex-col overflow-hidden rounded-[2rem] border border-sky-100 bg-white/95 shadow-2xl backdrop-blur-xl"><div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white"><div><b className="block text-sm">Niebieski Asystent</b><span className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-300"><ShieldCheck size={10}/> szybkie odpowiedzi</span></div><button onClick={() => setChatOpen(false)} className="rounded-full p-2 hover:bg-white/10"><X size={18}/></button></div><div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((m,i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm bg-sky-500 text-white' : 'rounded-bl-sm bg-slate-100'}`}>{m.content}</div></div>)}{loading && <div className="w-fit rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-400">Piszę…</div>}</div><div className="flex gap-2 border-t p-3"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} maxLength={200} placeholder="Napisz wiadomość…" className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 text-sm outline-none focus:ring-2 focus:ring-sky-400"/><button onClick={send} disabled={loading || !input.trim()} className="grid h-11 w-11 place-items-center rounded-full bg-sky-500 text-white disabled:opacity-40"><Send size={17}/></button></div></div>}<button onClick={() => setChatOpen(!chatOpen)} className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-500/30 transition hover:scale-105">{chatOpen ? <X/> : <MessageCircle/>}</button></div>
  </div>;
}

function Info({ icon: Icon, title, text }) { return <div className="flex gap-4"><Icon className="mt-1 shrink-0 text-sky-500"/><div><p className="font-extrabold">{title}</p><p className="text-sm text-slate-500">{text}</p></div></div>; }
