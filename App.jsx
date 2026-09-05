import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, Cat, Check, Clock3, Coffee, Heart, Instagram, MapPin, Menu, MessageCircle, PawPrint, Send, ShieldCheck, Sparkles, X } from 'lucide-react';

const cats = [
  { name: 'Luna', note: '4 lata · spokojna obserwatorka', story: 'Trafiła do nas po przeprowadzce opiekunów. Najchętniej siedzi przy oknie i sama wybiera moment na głaskanie.', image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=85&w=900&auto=format&fit=crop' },
  { name: 'Mochi', note: '6 lat · mistrz drzemek', story: 'Łagodny kocur znaleziony na działkach. Kocha miękkie koce, spokojne rozmowy i ludzi z książką na kolanach.', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=85&w=900&auto=format&fit=crop' },
  { name: 'Pixel', note: '2 lata · pierwszy do zabawy', story: 'Najmłodszy w ekipie i kandydat do adopcji. Wędkę wypatrzy z drugiego końca sali, a potem zasypia pod stolikiem.', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=85&w=900&auto=format&fit=crop' },
];
const menuGroups = [
  { icon: Coffee, title: 'Kawy', items: [['Espresso', '10 zł'], ['Americano', '12 zł'], ['Cappuccino', '15 zł'], ['Flat white', '17 zł'], ['Kocie latte', '18 zł']] },
  { icon: Sparkles, title: 'Bez kawy', items: [['Matcha latte', '18 zł'], ['Herbata liściasta', '14 zł'], ['Kakao z piankami', '16 zł'], ['Lemoniada sezonowa', '17 zł']] },
  { icon: Heart, title: 'Słodkości', items: [['Sernik baskijski', '19 zł'], ['Szarlotka na ciepło', '18 zł'], ['Brownie wegańskie', '17 zł'], ['Kocie ciasteczko', '8 zł']] },
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
  const warsawNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));
  const day = warsawNow.getDay();
  const hour = warsawNow.getHours();
  const isOpen = day !== 1 && hour >= (day === 0 || day === 6 ? 10 : 11) && hour < 20;
  const send = () => {
    const text = input.trim().slice(0, 200); if (!text || loading) return;
    setMessages((m) => [...m, { role: 'user', content: text }]); setInput(''); setLoading(true);
    window.setTimeout(() => {
      const q = text.toLowerCase(); let reply = 'Najlepiej opowiem Ci o godzinach, zasadach, menu lub kotach. Dane kontaktowe i rezerwacje pojawią się przed otwarciem.';
      if (q.includes('godzin') || q.includes('otwar')) reply = 'Wt–Pt zapraszamy 11:00–20:00, w weekend 10:00–20:00. Poniedziałek jest dniem odpoczynku kotów.';
      else if (q.includes('dziec') || q.includes('wiek')) reply = 'Zapraszamy dzieci od 8 lat. Goście w wieku 8–12 lat odwiedzają nas z dorosłym, a w weekend prosimy o rezerwację.';
      else if (q.includes('menu') || q.includes('kaw') || q.includes('ciast')) reply = 'Kawy kosztują 10–18 zł, napoje bez kawy 14–18 zł, a ciasta 17–19 zł. Mamy mleko roślinne bez dopłaty.';
      else if (q.includes('kot') || q.includes('adopc')) reply = 'Nasi rezydenci mają własne charaktery i spokojne miejsca do odpoczynku. Wspieramy też lokalne działania adopcyjne.';
      else if (q.includes('adres') || q.includes('gdzie') || q.includes('rezerw')) reply = 'Koncepcyjny lokal mieści się przy ul. Krakowskiej 32 w Opolu. Rezerwujemy stoliki na 90 minut; w weekend warto zrobić to wcześniej.';
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
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3.5 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-sky-700 shadow-sm"><span className={`h-2 w-2 rounded-full ${isOpen ? 'animate-pulse bg-emerald-500' : 'bg-slate-400'}`}/>{isOpen ? 'Otwarte teraz · do 20:00' : day === 1 ? 'Poniedziałek · koty odpoczywają' : 'Dziś od 11:00'}</div>
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[.22em] text-sky-600">Kocia kawiarnia · Opole</p>
          <h1 className="text-5xl font-black leading-[.98] tracking-[-.045em] sm:text-7xl lg:text-[5.25rem]">Zwolnij.<br/>Kawa stygnie,<br/><span className="text-sky-500">koty nie.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-600">Spokojne miejsce na dobrą kawę, miękki fotel i spotkanie z kotami, które naprawdę nadają temu miejscu rytm.</p>
          <div className="mt-9 flex flex-wrap gap-3"><button onClick={() => scrollTo('visit')} className="flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-sky-600">Zaplanuj wizytę <ArrowRight size={18}/></button><button onClick={() => scrollTo('cats')} className="rounded-full border border-slate-300 bg-white px-6 py-3.5 font-bold hover:border-sky-400 hover:text-sky-600">Poznaj koty</button></div>
          <div className="mt-12 flex flex-wrap gap-7 text-sm font-semibold text-slate-500"><span className="flex items-center gap-2"><Heart size={17} className="text-sky-500"/> Wspieramy adopcje</span><span className="flex items-center gap-2"><Coffee size={17} className="text-sky-500"/> Specialty coffee</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px]"><div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-sky-200/60 blur-2xl"/><div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-sky-100 shadow-2xl"><img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=85&w=1200&auto=format&fit=crop" alt="Kot odpoczywający w kawiarni" className="h-full w-full object-cover"/><div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/40 bg-white/80 p-5 backdrop-blur-xl"><div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-sky-500 text-white"><PawPrint size={21}/></span><div><p className="font-extrabold">Tu kot wybiera Ciebie</p><p className="text-sm text-slate-600">Usiądź wygodnie i daj mu chwilę.</p></div></div></div></div><div className="absolute -right-4 top-16 rotate-6 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black shadow-lg sm:-right-8">zero pośpiechu ✦</div></div>
      </header>

      <section id="about" className="bg-slate-950 py-24 text-white"><div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-400">Nasza idea</span><h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">Dobre rzeczy dzieją się wolniej.</h2></div><div className="grid gap-5 sm:grid-cols-2"><p className="text-lg leading-relaxed text-slate-300">Tworzymy kameralną kawiarnię, w której dobrostan kotów jest równie ważny jak smak espresso.</p><p className="text-lg leading-relaxed text-slate-300">Każdy rezydent ma własną historię, charakter i przestrzeń. Ty dostajesz chwilę oddechu — on wybór, czy chce dołączyć.</p></div></div></section>

      <section id="cats" className="mx-auto max-w-6xl px-5 py-24 sm:px-8"><div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">Nasi gospodarze</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Poznaj ekipę.</h2></div><p className="max-w-md text-slate-600">Każdy inny. Każdy u siebie. Pixel szuka domu, Luna i Mochi są stałymi gospodarzami.</p></div><div className="grid gap-5 md:grid-cols-3">{cats.map((cat,i) => <article key={cat.name} className={`group overflow-hidden rounded-[2rem] bg-white shadow-sm ${i === 1 ? 'md:translate-y-8' : ''}`}><div className="aspect-[4/5] overflow-hidden"><img src={cat.image} alt={`Kot ${cat.name}`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/></div><div className="p-5"><div className="flex items-center justify-between"><div><h3 className="text-xl font-black">{cat.name}</h3><p className="mt-1 text-sm font-semibold text-sky-600">{cat.note}</p></div><PawPrint className="text-sky-400"/></div><p className="mt-4 text-sm leading-relaxed text-slate-600">{cat.story}</p></div></article>)}</div></section>

      <section id="menu" className="mx-auto max-w-6xl px-5 py-24 sm:px-8"><div className="overflow-hidden rounded-[3rem] bg-sky-500 px-6 py-14 text-white sm:px-12 lg:px-16"><div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-100">W filiżance i obok</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Kocia karta.</h2></div><p className="max-w-sm text-sm text-sky-50">Mleko owsiane bez dopłaty. Przy każdym cieście oznaczamy alergeny.</p></div><div className="grid gap-4 lg:grid-cols-3">{menuGroups.map(({icon:Icon,title,items}) => <div key={title} className="rounded-3xl bg-white/12 p-6 ring-1 ring-white/20"><div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sky-600"><Icon size={20}/></span><h3 className="text-xl font-extrabold">{title}</h3></div><div className="space-y-3">{items.map(([name,price]) => <div key={name} className="flex items-center gap-3 text-sm"><span>{name}</span><span className="h-px flex-1 bg-white/25"/><strong>{price}</strong></div>)}</div></div>)}</div><p className="mt-7 text-center text-xs font-semibold text-sky-100">Opłata opiekuńcza: 8 zł / osoba · w całości na karmę i opiekę weterynaryjną.</p></div></section>

      <section id="rules" className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">Koci savoir-vivre</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Kilka zasad.<br/>Dużo spokoju.</h2><p className="mt-5 max-w-md leading-relaxed text-slate-600">To dom naszych rezydentów. Proste reguły sprawiają, że wszystkim — na dwóch i czterech łapach — jest tu dobrze.</p></div><ul className="space-y-3">{rules.map((rule) => <li key={rule} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600"><Check size={14}/></span><span className="text-sm font-semibold leading-relaxed text-slate-700">{rule}</span></li>)}</ul></section>

      <section id="visit" className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8"><div className="grid overflow-hidden rounded-[3rem] bg-white shadow-xl lg:grid-cols-[1fr_.9fr]"><div className="p-7 sm:p-12"><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">Zanim wpadniesz</span><h2 className="mt-3 text-4xl font-black tracking-tight">Zaplanuj miękkie lądowanie.</h2><div className="mt-9 space-y-5"><Info icon={Clock3} title="Wt–Pt 11:00–20:00 · Sob–Nd 10:00–20:00" text="W poniedziałki lokal jest zamknięty — to dzień ciszy dla kotów."/><Info icon={MapPin} title="ul. Krakowska 32, 45-075 Opole" text="5 minut spacerem od opolskiego Rynku · adres koncepcyjny."/><Info icon={CalendarDays} title="Stoliki na 90 minut" text="W weekend rezerwacja zalecana. Dzieci od 8 lat, zawsze pod opieką dorosłego."/></div><div className="mt-9 flex flex-wrap gap-3"><button onClick={() => setChatOpen(true)} className="flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 font-bold text-white transition hover:-translate-y-1 hover:bg-sky-600">Zapytaj asystenta <MessageCircle size={18}/></button><a href="https://www.openstreetmap.org/search?query=Krakowska%2032%20Opole" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 font-bold hover:border-sky-400 hover:text-sky-600">Pokaż mapę <MapPin size={18}/></a></div></div><div className="relative min-h-[380px]"><img src="https://images.unsplash.com/photo-1511081692775-05d0f180a065?q=85&w=1200&auto=format&fit=crop" alt="Przytulne wnętrze kawiarni" loading="lazy" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent"/></div></div></section>
    </main>

    <footer className="border-t border-slate-200 bg-white py-10"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div className="flex items-center gap-2 font-extrabold"><Cat className="text-sky-500"/> Niebieski Kot.</div><div className="text-sm text-slate-500"><p>ul. Krakowska 32 · Opole · czesc@niebieskikot-opole.pl</p><p className="mt-1 text-xs">Projekt koncepcyjny — adres, kontakt i bohaterowie są demonstracyjne.</p></div><a href="https://www.instagram.com/niebieskikot.opole" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold hover:text-sky-600"><Instagram size={18}/> @niebieskikot.opole</a></div></footer>

    <div className="fixed bottom-5 right-5 z-50">{chatOpen && <div className="mb-3 flex h-[min(520px,calc(100vh-110px))] w-[calc(100vw-40px)] max-w-[370px] flex-col overflow-hidden rounded-[2rem] border border-sky-100 bg-white/95 shadow-2xl backdrop-blur-xl"><div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white"><div><b className="block text-sm">Niebieski Asystent</b><span className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-300"><ShieldCheck size={10}/> szybkie odpowiedzi</span></div><button onClick={() => setChatOpen(false)} aria-label="Zamknij czat" className="rounded-full p-2 hover:bg-white/10"><X size={18}/></button></div><div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((m,i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm bg-sky-500 text-white' : 'rounded-bl-sm bg-slate-100'}`}>{m.content}</div></div>)}{loading && <div className="w-fit rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-400">Piszę…</div>}</div><div className="flex gap-2 border-t p-3"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} maxLength={200} aria-label="Wiadomość do asystenta" placeholder="Napisz wiadomość…" className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 text-sm outline-none focus:ring-2 focus:ring-sky-400"/><button onClick={send} disabled={loading || !input.trim()} aria-label="Wyślij wiadomość" className="grid h-11 w-11 place-items-center rounded-full bg-sky-500 text-white disabled:opacity-40"><Send size={17}/></button></div></div>}<button onClick={() => setChatOpen(!chatOpen)} aria-label={chatOpen ? 'Zamknij czat' : 'Otwórz czat'} className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-500/30 transition hover:scale-105">{chatOpen ? <X/> : <MessageCircle/>}</button></div>
  </div>;
}

function Info({ icon: Icon, title, text }) { return <div className="flex gap-4"><Icon className="mt-1 shrink-0 text-sky-500"/><div><p className="font-extrabold">{title}</p><p className="text-sm text-slate-500">{text}</p></div></div>; }
