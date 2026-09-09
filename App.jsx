import { Link } from 'react-router-dom';
import LanguageSelect from './LanguageSelect.jsx';
import { warsawTime } from './src/lib/booking.js';
import { useLanguage } from './src/i18n/LanguageProvider.jsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarDays, Cat, Check, ChevronLeft, ChevronRight, Clock3, Coffee, Globe2, Heart, HeartHandshake, Instagram, MapPin, Menu, MessageCircle, PawPrint, Send, ShieldCheck, ShoppingBasket, X } from 'lucide-react';
import BookingModal from './BookingModal.jsx';
import SupportModal from './SupportModal.jsx';
import { cats as baseCats, rules, faqItems, events as baseEvents, menuSlides, catOfDay } from './src/data/homeData.js';
import InfoRow from './src/components/InfoRow.jsx';
import { useSiteContent } from './src/content/SiteContentProvider.jsx';
const languageCopy = {
  pl: {
    nav: ['O nas', 'Koty', 'Menu', 'Zasady', 'Wydarzenia', 'Wesprzyj', 'Wizyta'],
    ask: 'Zapytaj nas',
    booking: 'Zarezerwuj stolik',
    cats: 'Poznaj koty',
    eyebrow: 'Kocia kawiarnia · Opole',
    hero: 'Zwolnij. Kawa stygnie, koty nie.',
    intro: 'Spokojne miejsce na dobrą kawę, miękki fotel i spotkanie z kotami, które naprawdę nadają temu miejscu rytm.'
  },
  ru: {
    nav: ['О нас', 'Коты', 'Меню', 'Правила', 'События', 'Поддержать', 'Визит'],
    ask: 'Спросить нас',
    booking: 'Забронировать столик',
    cats: 'Познакомиться с котами',
    eyebrow: 'Котокафе · Ополе',
    hero: 'Замедлись. Кофе остывает, коты — нет.',
    intro: 'Уютное место для хорошего кофе, мягкого кресла и встречи с котами, которые задают этому месту свой ритм.'
  },
  en: {
    nav: ['About', 'Cats', 'Menu', 'Rules', 'Events', 'Support', 'Visit'],
    ask: 'Ask us',
    booking: 'Book a table',
    cats: 'Meet the cats',
    eyebrow: 'Cat café · Opole',
    hero: 'Slow down. Coffee cools, cats don’t.',
    intro: 'A calm place for good coffee, a soft chair and time with cats who give this café its own rhythm.'
  }
};
const pageCopy = {
  pl: {
    open: 'Otwarte teraz · do 20:00',
    monday: 'Poniedziałek · koty odpoczywają',
    today: 'Dziś od 11:00',
    adopt: 'Wspieramy adopcje',
    coffee: 'Specialty coffee',
    homeTitle: 'Tu kot wybiera Ciebie',
    homeText: 'Usiądź wygodnie i daj mu chwilę.',
    aboutLabel: 'Nasza idea',
    aboutTitle: 'Dobre rzeczy dzieją się wolniej.',
    aboutOne: 'Tworzymy kameralną kawiarnię, w której dobrostan kotów jest równie ważny jak smak espresso.',
    aboutTwo: 'Każdy rezydent ma własną historię, charakter i przestrzeń. Ty dostajesz chwilę oddechu — on wybór, czy chce dołączyć.',
    catsLabel: 'Nasi gospodarze',
    catsTitle: 'Poznaj ekipę.',
    catsText: 'Każdy inny. Każdy u siebie. Pixel szuka domu, Luna i Mochi są stałymi gospodarzami.',
    menuLabel: 'Jedzenie i napoje',
    menuTitle: 'Kocia karta ma własne miejsce.',
    menuText: 'Kawy specialty, śniadania, lekkie dania i domowe słodkości — teraz w przejrzystym menu z cenami.',
    menuButton: 'Otwórz pełne menu',
    rulesLabel: 'Koci savoir-vivre',
    rulesTitle: 'Kilka zasad. Dużo spokoju.',
    rulesText: 'To dom naszych rezydentów. Proste reguły sprawiają, że wszystkim — na dwóch i czterech łapach — jest tu dobrze.',
    faqLabel: 'FAQ pierwszej wizyty',
    faqTitle: 'Dobrze wiedzieć przed przyjściem.',
    visitLabel: 'Zanim wpadniesz',
    visitTitle: 'Zaplanuj miękkie lądowanie.',
    book: 'Zarezerwuj stolik',
    ask: 'Zapytaj asystenta',
    map: 'Pokaż mapę',
    supportLabel: 'Dla naszych kotów',
    supportTitle: 'Mały gest. Dużo spokoju.',
    supportText: 'Opieka weterynaryjna, karma i spokojne kryjówki są ważniejsze niż kolejna zabawka. Wybierz sposób, w jaki chcesz dołożyć swoją cegiełkę.',
    supportButton: 'Wesprzyj koty',
    needsLabel: 'Lista potrzeb',
    needsTitle: 'Co przyda się najbardziej?',
    needsText: 'Rzeczy można przynieść po wcześniejszym kontakcie z obsługą. Najpierw sprawdzimy, czego aktualnie potrzebują koty.',
    eventsLabel: 'W kalendarzu kociej kawiarni',
    eventsTitle: 'Wydarzenia, na które chce się wracać.',
    eventsText: 'Małe spotkania w spokojnym rytmie. Liczba miejsc jest ograniczona, dlatego warto zapisać się wcześniej.',
    eventsButton: 'Zapisz się'
  },
  ru: {
    open: 'Открыто · до 20:00',
    monday: 'Понедельник · коты отдыхают',
    today: 'Сегодня с 11:00',
    adopt: 'Помогаем усыновлению',
    coffee: 'Авторский кофе',
    homeTitle: 'Здесь кот выбирает тебя',
    homeText: 'Устраивайся поудобнее и дай ему время.',
    aboutLabel: 'Наша идея',
    aboutTitle: 'Хорошие вещи происходят медленнее.',
    aboutOne: 'Мы создаём камерное кафе, где благополучие котов так же важно, как вкус эспрессо.',
    aboutTwo: 'У каждого жителя своя история, характер и пространство. Ты получаешь передышку, а кот — право самому выбрать контакт.',
    catsLabel: 'Наши хозяева',
    catsTitle: 'Познакомься с командой.',
    catsText: 'Все разные и каждый у себя дома. Пиксель ищет дом, Луна и Мочи — постоянные жители.',
    menuLabel: 'Еда и напитки',
    menuTitle: 'У котокафе есть своё меню.',
    menuText: 'Авторский кофе, завтраки, лёгкие блюда и домашние десерты — всё с понятными ценами.',
    menuButton: 'Открыть меню',
    rulesLabel: 'Кошачьи правила',
    rulesTitle: 'Несколько правил. Много спокойствия.',
    rulesText: 'Это дом наших жителей. Простые правила помогают хорошо себя чувствовать и людям, и котам.',
    faqLabel: 'FAQ первого визита',
    faqTitle: 'Что важно знать заранее.',
    visitLabel: 'Перед визитом',
    visitTitle: 'Запланируй мягкую посадку.',
    book: 'Забронировать столик',
    ask: 'Спросить ассистента',
    map: 'Открыть карту',
    supportLabel: 'Для наших котов',
    supportTitle: 'Маленький жест. Большое спокойствие.',
    supportText: 'Ветеринарная помощь, корм и тихие укрытия важнее очередной игрушки. Выбери свой способ помочь.',
    supportButton: 'Поддержать котов',
    needsLabel: 'Список нужд',
    needsTitle: 'Что сейчас нужнее всего?',
    needsText: 'Вещи можно принести после связи с командой. Сначала уточним, что котам нужно сейчас.',
    eventsLabel: 'В календаре котокафе',
    eventsTitle: 'События, ради которых хочется вернуться.',
    eventsText: 'Небольшие встречи в спокойном ритме. Количество мест ограничено, поэтому лучше записаться заранее.',
    eventsButton: 'Записаться'
  },
  en: {
    open: 'Open now · until 20:00',
    monday: 'Monday · cats are resting',
    today: 'Today from 11:00',
    adopt: 'We support adoption',
    coffee: 'Specialty coffee',
    homeTitle: 'Here, the cat chooses you',
    homeText: 'Make yourself comfortable and give them a moment.',
    aboutLabel: 'Our idea',
    aboutTitle: 'Good things happen more slowly.',
    aboutOne: 'We are creating an intimate café where cat wellbeing matters as much as the taste of espresso.',
    aboutTwo: 'Every resident has a story, personality and space. You get a moment to breathe — they get the choice to connect.',
    catsLabel: 'Our hosts',
    catsTitle: 'Meet the team.',
    catsText: 'Each one is different and at home here. Pixel is looking for a home; Luna and Mochi are resident hosts.',
    menuLabel: 'Food and drinks',
    menuTitle: 'The cat café has its own menu.',
    menuText: 'Specialty coffee, breakfast, light dishes and homemade sweets — all with clear prices.',
    menuButton: 'Open full menu',
    rulesLabel: 'Cat etiquette',
    rulesTitle: 'A few rules. Lots of calm.',
    rulesText: 'This is our residents’ home. Simple rules help everyone — on two and four legs — feel comfortable.',
    faqLabel: 'First visit FAQ',
    faqTitle: 'Good to know before you come.',
    visitLabel: 'Before you visit',
    visitTitle: 'Plan a soft landing.',
    book: 'Book a table',
    ask: 'Ask the assistant',
    map: 'Show map',
    supportLabel: 'For our cats',
    supportTitle: 'A small gesture. A lot of calm.',
    supportText: 'Veterinary care, food and quiet hideaways matter more than another toy. Choose how you would like to help.',
    supportButton: 'Support the cats',
    needsLabel: 'Wish list',
    needsTitle: 'What helps most?',
    needsText: 'Please contact the team before bringing items so we can confirm what the cats need right now.',
    eventsLabel: 'In the cat café calendar',
    eventsTitle: 'Events worth coming back for.',
    eventsText: 'Small gatherings at a calm pace. Places are limited, so early registration is recommended.',
    eventsButton: 'Sign up'
  }
};
export default function App() {
  const { data: siteContent, text: contentText } = useSiteContent();
  const [chatOpen, setChatOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuSlide, setMenuSlide] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportOption, setSupportOption] = useState('coffee');
  const [bookingEvent, setBookingEvent] = useState(null);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const replyTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(replyTimer.current), []);
  const {
    language,
    setLanguage: changeLanguage,
    tr: translate
  } = useLanguage();
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Cześć! 🐾 Zapytaj mnie o godziny, zasady, menu albo naszych rezydentów.'
  }]);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, chatOpen]);
  useEffect(() => {
    if (carouselPaused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setMenuSlide(slide => (slide + 1) % menuSlides.length), 4500);
    return () => window.clearInterval(timer);
  }, [carouselPaused]);
  const closeBooking = useCallback(() => setBookingOpen(false), []);
  const closeSupport = useCallback(() => setSupportOpen(false), []);
  const copy = languageCopy[language] || languageCopy.pl;
  const page = { ...(pageCopy[language] || pageCopy.pl), open: contentText(siteContent.availability.note) };
  const home = siteContent.homepage;
  const catOfDayCopy = catOfDay[language] || catOfDay.pl;
  const publicCats = siteContent.cats.filter(item => item.enabled).map(item => {
    const original = baseCats.find(cat => cat.slug === item.slug);
    return { ...original, ...item, image: original?.image || '/images/cat-placeholder.svg', note: contentText(item.note), story: contentText(item.intro), linkLabel: contentText(item.linkLabel) };
  });
  const publicEvents = siteContent.events.filter(item => item.enabled).map((item,index) => ({ ...baseEvents[index % baseEvents.length], ...item, tag: contentText(item.tag), title: contentText(item.title), text: contentText(item.description), meta: contentText(item.date), spots: item.places }));
  const cats = publicCats;
  const events = publicEvents;
  const scheduleSummary = siteContent.schedule.map(item => `${contentText(item.day)} ${contentText(item.hours)}`).join(' · ');
  const tr = (source, values) => source === 'Wt–Pt 11:00–20:00 · Sob–Nd 10:00–20:00' ? scheduleSummary : translate(source, values);
  const scrollTo = id => {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const current = warsawTime();
  const day = current.day;
  const hour = Number(current.time.slice(0, 2));
  const opening = day === 0 || day === 6 ? 10 : 11;
  const isOpen = day !== 1 && hour >= opening && hour < 20;
  const send = () => {
    const text = input.trim().slice(0, 200);
    if (!text || loading) return;
    setMessages(m => [...m, {
      role: 'user',
      content: text
    }]);
    setInput('');
    setLoading(true);
    replyTimer.current = window.setTimeout(() => {
      const q = text.toLowerCase();
      let reply = 'Najlepiej opowiem Ci o godzinach, zasadach, menu lub kotach. Dane kontaktowe i rezerwacje pojawią się przed otwarciem.';
      if (/godzin|otwar|hour|open|час|врем|откр/.test(q)) reply = 'Wt–Pt zapraszamy 11:00–20:00, w weekend 10:00–20:00. Poniedziałek jest dniem odpoczynku kotów.';else if (/dziec|wiek|child|kid|age|дет|реб|возраст/.test(q)) reply = 'Zapraszamy dzieci od 8 lat. Goście w wieku 8–12 lat odwiedzają nas z dorosłym, a w weekend prosimy o rezerwację.';else if (/menu|kaw|ciast|jedz|głod|food|drink|coffee|меню|еда|кофе|напит/.test(q)) reply = 'Kawy kosztują 10–18 zł, napoje bez kawy 14–18 zł, ciasta 17–19 zł, a śniadania i lekkie dania 19–28 zł. Mamy opcje wegetariańskie i mleko roślinne bez dopłaty.';else if (/kot|adopc|cat|adopt|кот|кош|усын/.test(q)) reply = 'Nasi rezydenci mają własne charaktery i spokojne miejsca do odpoczynku. Wspieramy też lokalne działania adopcyjne.';else if (/adres|gdzie|rezerw|address|where|book|reserve|адрес|где|брон/.test(q)) reply = 'Koncepcyjny lokal mieści się przy ul. Krakowskiej 32 w Opolu. Rezerwujemy stoliki na 90 minut; w weekend warto zrobić to wcześniej.';
      setMessages(m => [...m, {
        role: 'assistant',
        content: reply
      }]);
      setLoading(false);
    }, 650);
  };
  const links = [['about', copy.nav[0]], ['cats', copy.nav[1]], ['menu', copy.nav[2]], ['rules', copy.nav[3]], ['events', copy.nav[4]], ['support', copy.nav[5]], ['visit', copy.nav[6]]];
  return <div className="min-h-screen overflow-x-hidden bg-[#f7f8f4] text-slate-950 selection:bg-sky-200">
    <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/50 bg-[#f7f8f4]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
        <button onClick={() => scrollTo('top')} className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white"><Cat size={19} /></span><span className="text-lg font-extrabold tracking-tight">Niebieski Kot<span className="text-sky-500">.</span></span></button>
        <div className="hidden items-center gap-7 xl:flex">{links.map(([id, label]) => id === 'menu' ? <Link key={id} to="/menu" className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">{label}</Link> : <button key={id} onClick={() => scrollTo(id)} className="text-sm font-semibold text-slate-600 transition hover:text-slate-950">{label}</button>)}</div>
        <div className="flex items-center gap-2"><LanguageSelect /><button onClick={() => setChatOpen(true)} className="hidden items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sky-600 xl:flex">{copy.ask} <ArrowRight size={15} /></button></div>
        <button onClick={() => setMobileMenu(!mobileMenu)} className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 xl:hidden" aria-label={tr("Menu")} aria-expanded={mobileMenu}>{mobileMenu ? <X /> : <Menu />}</button>
      </div>
      {mobileMenu && <div className="border-t border-slate-200 bg-[#f7f8f4] px-5 py-5 xl:hidden">{links.map(([id, label]) => id === 'menu' ? <Link key={id} to="/menu" className="block w-full border-b border-slate-200 py-3 text-left font-bold">{label}</Link> : <button key={id} onClick={() => scrollTo(id)} className="block w-full border-b border-slate-200 py-3 text-left font-bold">{label}</button>)}</div>}
    </nav>

    <main id="top" className="flex flex-col">
      <header className="mx-auto grid min-h-[780px] max-w-6xl items-center gap-12 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3.5 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-sky-700 shadow-sm"><span className={`h-2 w-2 rounded-full ${isOpen ? 'animate-pulse bg-emerald-500' : 'bg-slate-400'}`} title={tr("Godziny demonstracyjne")} />{isOpen ? page.open : day === 1 ? page.monday : hour < opening ? tr("Dziś od {time}", {
              time: opening + ":00"
            }) : tr("Zamknięte teraz")}</div>
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[.22em] text-sky-600">{copy.eyebrow}</p>
          <h1 className="text-5xl font-black leading-[.98] tracking-[-.045em] sm:text-7xl lg:text-[5.25rem]">{copy.hero}</h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-600">{copy.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3"><button onClick={() => {
              setBookingEvent(null);
              setBookingOpen(true);
            }} className="flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-sky-600">{copy.booking} <ArrowRight size={18} /></button><button onClick={() => scrollTo('cats')} className="rounded-full border border-slate-300 bg-white px-6 py-3.5 font-bold hover:border-sky-400 hover:text-sky-600">{copy.cats}</button></div>
          <div className="mt-12 flex flex-wrap gap-7 text-sm font-semibold text-slate-500"><span className="flex items-center gap-2"><Heart size={17} className="text-sky-500" /> {page.adopt}</span><span className="flex items-center gap-2"><Coffee size={17} className="text-sky-500" /> {page.coffee}</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px]"><div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-sky-200/60 blur-2xl" /><div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-sky-100 shadow-2xl"><img src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=85&w=1200&auto=format&fit=crop" alt={page.homeTitle} className="h-full w-full object-cover" /><div className="absolute inset-x-5 bottom-5 rounded-3xl border border-white/40 bg-white/80 p-5 backdrop-blur-xl"><div className="flex items-center gap-4"><span className="grid h-11 w-11 place-items-center rounded-full bg-sky-500 text-white"><PawPrint size={21} /></span><div><p className="font-extrabold">{page.homeTitle}</p><p className="text-sm text-slate-600">{page.homeText}</p></div></div></div></div><div className="absolute -right-4 top-16 rotate-6 rounded-2xl bg-amber-300 px-4 py-3 text-sm font-black shadow-lg sm:-right-8">{tr("zero pośpiechu ✦")}</div></div>
      </header>

      <section id="about" className="bg-slate-950 py-24 text-white"><div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-400">{tr("Nasza idea")}</span><h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{tr("Dobre rzeczy dzieją się wolniej.")}</h2></div><div className="grid gap-5 sm:grid-cols-2"><p className="text-lg leading-relaxed text-slate-300">{tr("Tworzymy kameralną kawiarnię, w której dobrostan kotów jest równie ważny jak smak espresso.")}</p><p className="text-lg leading-relaxed text-slate-300">{tr("Każdy rezydent ma własną historię, charakter i przestrzeń. Ty dostajesz chwilę oddechu — on wybór, czy chce dołączyć.")}</p></div></div></section>

      <section id="cats" className="mx-auto max-w-6xl px-5 py-24 sm:px-8"><div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">{contentText(home.cats.label)}</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{contentText(home.cats.title)}</h2></div><p className="max-w-md text-slate-600">{contentText(home.cats.text)}</p></div><div className="grid gap-5 md:grid-cols-3">{cats.map((cat, i) => <article key={cat.name} className={`group overflow-hidden rounded-[2rem] bg-white shadow-sm ${i === 1 ? 'md:translate-y-8' : ''}`}><div className="aspect-[4/5] overflow-hidden"><img src={cat.image} alt={tr("Kot {name}", {
                name: cat.name
              })} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-5"><div className="flex items-center justify-between"><div><h3 className="text-xl font-black">{cat.name}</h3><p className="mt-1 text-sm font-semibold text-sky-600">{tr(cat.note)}</p></div><PawPrint className="text-sky-400" /></div><p className="mt-4 text-sm leading-relaxed text-slate-600">{tr(cat.story)}</p><Link to={`/koty/${cat.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-sky-600 transition hover:gap-3 hover:text-sky-700">{tr(cat.linkLabel)} <ArrowRight size={16} /></Link></div></article>)}</div></section>

      <section id="cat-of-day" className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8"><div className="grid overflow-hidden rounded-[3rem] bg-amber-300 lg:grid-cols-[.85fr_1.15fr]"><div className="relative min-h-[320px]"><img src={catOfDay.image} alt={`${catOfDayCopy.label} ${catOfDay.name}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" /><span className="absolute bottom-6 left-6 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-950">{catOfDayCopy.label}</span></div><div className="p-7 sm:p-12"><span className="text-sm font-extrabold uppercase tracking-[.2em] text-amber-900">{catOfDayCopy.eyebrow}</span><h2 className="mt-3 text-5xl font-black tracking-tight">{catOfDay.name}.</h2><p className="mt-4 inline-flex rounded-full bg-white/70 px-4 py-2 text-sm font-extrabold text-amber-950">{catOfDayCopy.mood}</p><p className="mt-6 max-w-lg text-lg leading-relaxed text-amber-950/80">{catOfDayCopy.activity}</p><Link to={`/koty/${catOfDay.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 font-extrabold text-white transition hover:-translate-y-1 hover:bg-sky-600">{catOfDayCopy.button} {catOfDay.name} <ArrowRight size={18} /></Link></div></div></section>

      <section id="visit" className="mx-auto max-w-6xl px-5 pb-24 pt-10 sm:px-8"><div className="grid overflow-hidden rounded-[3rem] bg-white shadow-xl lg:grid-cols-[1fr_.9fr]"><div className="p-7 sm:p-12"><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">{contentText(home.visit.label)}</span><h2 className="mt-3 text-4xl font-black tracking-tight">{contentText(home.visit.title)}</h2><div className="mt-9 space-y-5">{home.visit.rows.map((row,index)=>{const Icon=[Clock3,MapPin,CalendarDays][index]||CalendarDays;return <InfoRow key={index} icon={Icon} title={contentText(row.title)} text={contentText(row.text)}/>;})}</div><div className="mt-9 flex flex-wrap gap-3"><button onClick={() => {
                setBookingEvent(null);
                setBookingOpen(true);
              }} className="flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 font-bold text-white transition hover:-translate-y-1 hover:bg-sky-600">{contentText(home.visit.book)}<CalendarDays size={18} /></button><button onClick={() => setChatOpen(true)} className="flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 font-bold hover:border-sky-400 hover:text-sky-600">{contentText(home.visit.ask)}<MessageCircle size={18} /></button><a href="https://www.openstreetmap.org/search?query=Krakowska%2032%20Opole" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 font-bold hover:border-sky-400 hover:text-sky-600">{contentText(home.visit.map)}<MapPin size={18} /></a></div></div><div className="relative min-h-[380px]"><img src="https://images.unsplash.com/photo-1511081692775-05d0f180a065?q=85&w=1200&auto=format&fit=crop" alt={tr("Przytulne wnętrze kawiarni")} loading="lazy" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" /></div></div></section>

      <section id="menu" className="mx-auto max-w-6xl px-5 py-24 sm:px-8"><div className="relative overflow-hidden rounded-[3rem] bg-sky-500 px-7 py-10 text-white sm:px-12 sm:py-12"><div className="absolute -left-12 -top-16 text-white/10"><Coffee size={220} /></div><div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_.75fr]"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-100">{tr("Jedzenie i napoje")}</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{tr("Kocia karta ma własne miejsce.")}</h2><p className="mt-5 max-w-xl leading-relaxed text-sky-50">{tr("Kawy specialty, śniadania, lekkie dania i domowe słodkości — teraz w przejrzystym menu z cenami.")}</p><Link to="/menu" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-extrabold text-sky-600 transition hover:-translate-y-1">{tr("Otwórz pełne menu")}<ArrowRight size={18} /></Link></div><div className="mx-auto w-full max-w-sm"><div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-sky-300 shadow-2xl ring-1 ring-white/30">{menuSlides.map((slide, index) => <img key={slide.image} src={slide.image} alt={index === menuSlide ? tr(slide.alt) : ''} aria-hidden={index !== menuSlide} loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${index === menuSlide ? 'scale-100 opacity-100' : 'scale-105 opacity-0'}`} />)}<div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-950/75 p-3 backdrop-blur-md"><button type="button" onClick={() => setMenuSlide(slide => (slide - 1 + menuSlides.length) % menuSlides.length)} aria-label={tr("Poprzednie zdjęcie")} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"><ChevronLeft size={18} /></button><p className="text-center text-sm font-extrabold">{tr(menuSlides[menuSlide].label)}</p><button type="button" onClick={() => setMenuSlide(slide => (slide + 1) % menuSlides.length)} aria-label={tr("Następne zdjęcie")} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"><ChevronRight size={18} /></button></div></div><div className="mt-4 flex flex-wrap items-center justify-center gap-3"><button type="button" onClick={() => setCarouselPaused(!carouselPaused)} className="rounded-full border border-white/50 px-3 py-1 text-xs font-bold">{tr(carouselPaused ? "Wznów karuzelę" : "Wstrzymaj karuzelę")}</button>{menuSlides.map((slide, index) => <button key={slide.image} type="button" onClick={() => setMenuSlide(index)} aria-label={tr("Pokaż zdjęcie {number}: {label}", {
                  number: index + 1,
                  label: tr(slide.label)
                })} aria-current={index === menuSlide} className={`h-2 rounded-full transition-all ${index === menuSlide ? 'w-7 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'}`} />)}</div></div></div></div></section>

      <section id="rules" className="mx-auto max-w-6xl px-5 py-24 sm:px-8"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">{tr("Koci savoir-vivre")}</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{tr("Kilka zasad.")}<br />{tr("Dużo spokoju.")}</h2><p className="mt-5 max-w-md leading-relaxed text-slate-600">{tr("To dom naszych rezydentów. Proste reguły sprawiają, że wszystkim — na dwóch i czterech łapach — jest tu dobrze.")}</p><ul className="mt-8 space-y-3">{rules.map(rule => <li key={rule} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600"><Check size={14} /></span><span className="text-sm font-semibold leading-relaxed text-slate-700">{tr(rule)}</span></li>)}</ul></div><div><div className="mb-5 flex items-center justify-between"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">{tr("FAQ pierwszej wizyty")}</span><h3 className="mt-2 text-3xl font-black tracking-tight">{tr("Dobrze wiedzieć przed przyjściem.")}</h3></div><ShieldCheck className="hidden text-sky-500 sm:block" size={30} /></div><div className="space-y-3">{faqItems.map(({
                question,
                answer
              }) => <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-slate-800 marker:hidden"><span>{tr(question)}</span><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600 text-xl leading-none transition group-open:rotate-45">+</span></summary><p className="pt-4 text-sm leading-relaxed text-slate-600">{tr(answer)}</p></details>)}</div></div></div></section>


      <section id="support" className="bg-slate-950 py-24 text-white"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><div><span className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[.2em] text-sky-400"><HeartHandshake size={17} />{tr("Dla naszych kotów")}</span><h2 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{tr("Mały gest.")}<br />{tr("Dużo spokoju.")}</h2><p className="mt-5 max-w-md text-lg leading-relaxed text-slate-300">{tr("Opieka weterynaryjna, karma i spokojne kryjówki są ważniejsze niż kolejna zabawka. Wybierz sposób, w jaki chcesz dołożyć swoją cegiełkę.")}</p><button type="button" onClick={() => {
                setSupportOption("coffee");
                setSupportOpen(true);
              }} className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3.5 font-extrabold text-amber-950 transition hover:-translate-y-1 hover:bg-amber-200">{tr("Wesprzyj koty")}<HeartHandshake size={18} /></button></div><div className="grid gap-3 sm:grid-cols-3">{[['Wirtualna kawa', '15 zł', 'na codzienną opiekę'], ['Miska na dziś', '35 zł', 'na karmę i żwirek'], ['Wsparcie leczenia', '100 zł', 'na badania i wizyty']].map(([title, amount, text]) => <button key={title} type="button" onClick={() => {
                setSupportOption(amount === "35 zł" ? "care" : amount === "100 zł" ? "treatment" : "coffee");
                setSupportOpen(true);
              }} className="rounded-3xl border border-white/10 bg-white/10 p-5 text-left transition hover:-translate-y-1 hover:bg-white/15"><Coffee className="text-amber-300" size={20} /><p className="mt-6 text-sm font-bold text-slate-300">{tr(title)}</p><p className="mt-1 text-3xl font-black">{amount}</p><p className="mt-2 text-xs leading-relaxed text-slate-400">{tr(text)}</p></button>)}</div></div><div className="mt-12 grid gap-5 rounded-[2.5rem] bg-white p-7 text-slate-950 sm:p-9 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[.18em] text-sky-600"><ShoppingBasket size={17} />{contentText(home.needs.label)}</p><h3 className="mt-3 text-3xl font-black">{contentText(home.needs.title)}</h3><p className="mt-3 leading-relaxed text-slate-600">{contentText(home.needs.text)}</p></div><ul className="grid gap-2 sm:grid-cols-2">{home.needs.items.map((item,index) => <li key={index} className="flex items-center gap-3 rounded-2xl bg-sky-50 px-4 py-3 text-sm font-bold text-slate-700"><Check size={16} className="shrink-0 text-emerald-500" />{contentText(item)}</li>)}</ul></div></div></section>
      <section id="events" className="bg-sky-50 py-24"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-600">{contentText(home.events.label)}</span><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{contentText(home.events.title)}</h2></div><p className="max-w-md text-slate-600">{contentText(home.events.text)}</p></div><div className="grid gap-4 md:grid-cols-2">{events.map(({
              icon: Icon,
              tag,
              title,
              text,
              meta
            }, index) => <article key={title} className="group rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-7"><div className="flex items-start justify-between gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-600"><Icon size={22} /></span><span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-extrabold text-amber-800">{tr(tag)}</span></div><h3 className="mt-6 text-2xl font-black">{tr(title)}</h3><p className="mt-3 min-h-12 text-sm leading-relaxed text-slate-600">{tr(text)}</p><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="text-xs font-extrabold text-slate-500">{tr(meta)}</span><button type="button" onClick={() => {
                  setBookingEvent({
                    title,
                    tag,
                    meta,
                    index
                  });
                  setBookingOpen(true);
                }} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-sky-600">{contentText(home.events.button)}<ArrowRight size={15} /></button></div></article>)}</div></div></section>



    </main>

    <footer className="border-t border-slate-200 bg-white py-10"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div className="flex items-center gap-2 font-extrabold"><Cat className="text-sky-500" /> Niebieski Kot.</div><div className="text-sm text-slate-500"><p>{tr("ul. Krakowska 32 · Opole · czesc@niebieskikot-opole.pl")}</p><p className="mt-1 text-xs">{tr("Projekt koncepcyjny — adres, kontakt i bohaterowie są demonstracyjne.")}</p></div><span title={tr("Instagram demonstracyjny — konto niepotwierdzone")} className="flex items-center gap-2 text-sm font-bold hover:text-sky-600"><Instagram size={18} /> @niebieskikot.opole</span></div></footer>

    <div className="fixed bottom-5 right-5 z-50">{chatOpen && <div className="mb-3 flex h-[min(520px,calc(100vh-110px))] w-[calc(100vw-40px)] max-w-[370px] flex-col overflow-hidden rounded-[2rem] border border-sky-100 bg-white/95 shadow-2xl backdrop-blur-xl"><div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white"><div><b className="block text-sm">{tr("Niebieski Asystent")}</b><span className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-300"><ShieldCheck size={10} />{tr("Asystent demonstracyjny")}</span></div><button onClick={() => setChatOpen(false)} aria-label={tr("Zamknij czat")} className="rounded-full p-2 hover:bg-white/10"><X size={18} /></button></div><div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm bg-sky-500 text-white' : 'rounded-bl-sm bg-slate-100'}`}>{m.role === "user" ? m.content : tr(m.content)}</div></div>)}{loading && <div className="w-fit rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-400">{tr("Piszę…")}</div>}</div><div className="flex gap-2 border-t p-3"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} maxLength={200} aria-label={tr("Wiadomość do asystenta")} placeholder={tr("Napisz wiadomość…")} className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 text-sm outline-none focus:ring-2 focus:ring-sky-400" /><button onClick={send} disabled={loading || !input.trim()} aria-label={tr("Wyślij wiadomość")} className="grid h-11 w-11 place-items-center rounded-full bg-sky-500 text-white disabled:opacity-40"><Send size={17} /></button></div></div>}<button onClick={() => setChatOpen(!chatOpen)} aria-label={tr(chatOpen ? 'Zamknij czat' : 'Otwórz czat')} className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-sky-500 text-white shadow-xl shadow-sky-500/30 transition hover:scale-105">{chatOpen ? <X /> : <MessageCircle />}</button></div>
    <BookingModal open={bookingOpen} onClose={closeBooking} event={bookingEvent} /><SupportModal open={supportOpen} onClose={closeSupport} initialOption={supportOption} />
  </div>;
}
