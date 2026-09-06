import React from 'react';
import { ArrowLeft, CalendarDays, Cat, Check, Clock3, Heart, Home, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import LanguageSelect, { getLanguage } from './LanguageSelect.jsx';

export const catProfiles = {
  luna: {
    name: 'Luna',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=88&w=1200&auto=format&fit=crop',
    imageAlt: 'Luna — spokojna kotka odpoczywająca w kawiarni',
    badge: 'Rezydentka na stałe',
    tagline: 'Spokojna obserwatorka i opiekunka najcichszego fotela.',
    intro: 'Luna jest łagodna, uważna i bardzo samodzielna. Lubi być blisko ludzi, ale najlepiej czuje się wtedy, gdy sama może zdecydować, kiedy podejść po głaskanie.',
    summaryTitle: 'Najkrócej o Lunie',
    summary: 'Cicha, cierpliwa i przewidywalna. Najbardziej aktywna rano, a popołudnia przeznacza na obserwowanie sali z bezpiecznej wysokości.',
    age: '4 lata', birth: 'urodzona około 12 sierpnia 2022', joined: '14 października 2024', origin: 'przyjechała z domu tymczasowego',
    healthStatus: 'W dobrej kondycji', healthNote: 'kontrola co 6 miesięcy', status: 'Stała gospodyni', statusNote: 'nie jest przeznaczona do adopcji',
    historyLabel: 'Jej historia', historyTitle: 'Nowy rozdział po wielkiej zmianie.',
    story: [
      'Luna nie urodziła się w kawiarni. Przez pierwsze lata mieszkała w spokojnym domu, ale po zagranicznej przeprowadzce opiekunów trafiła pod opiekę zaprzyjaźnionej fundacji.',
      'Do Niebieskiego Kota przyjechała 14 października 2024 roku. Adaptację zaczęła w osobnym pokoju, a po tygodniu sama wybrała fotel przy regale jako swoje miejsce do obserwowania gości.',
      'Data urodzenia jest orientacyjna. Została ustalona na podstawie dokumentacji przekazanej fundacji oraz badania weterynaryjnego.',
    ],
    healthIntro: 'Luna jest pod stałą opieką lekarza. Ma wrażliwy układ pokarmowy, dlatego dostaje sprawdzoną karmę i nie powinna być dokarmiana przez gości.',
    health: ['szczepienia podstawowe aktualne', 'regularnie odrobaczana', 'wysterylizowana', 'zaczipowana', 'testy FIV/FeLV ujemne', 'delikatna dieta dla wrażliwego żołądka'],
    friendshipTitle: 'Jak zdobyć jej zaufanie?',
    friendship: 'Usiądź spokojnie i pozwól Lunie obwąchać dłoń. Jeśli zostanie obok, możesz pogłaskać ją po policzku lub karku — bez sięgania od góry.',
    traits: [{ value: '7/10', label: 'ciekawość' }, { value: '4/10', label: 'zabawa' }, { value: '8/10', label: 'bliskość' }],
    signal: 'Luna odsuwa głowę i kładzie uszy lekko na boki. To znak, że potrzebuje spokoju.',
    likes: ['miękkie koce', 'spokojna muzyka', 'głaskanie po policzkach', 'obserwowanie deszczu', 'wysokie półki', 'goście czytający książki'],
    boundaries: ['nie lubi noszenia na rękach', 'unika głośnych grup', 'nie dotykamy jej brzucha', 'nie zmieniamy miejsca jej legowiska'],
    routineTitle: 'Rytm Luny.', routineIntro: 'Stałe pory i spokojne miejsca pomagają jej czuć się pewnie przez cały dzień.',
    routine: [['08:15', 'Śniadanie i podanie karmy dla wrażliwego żołądka.'], ['09:30', 'Obchód sali przed przyjściem pierwszych gości.'], ['11:30–15:30', 'Drzemka na półce lub w pokoju odpoczynku.'], ['16:00', 'Spokojne spotkania z gośćmi przy regale.'], ['19:15', 'Kolacja, czesanie i wieczorne wyciszenie.']],
    placeLabel: 'Jej miejsce', placeTitle: 'Kawiarnia jest już jej domem.',
    placeText: 'Luna pozostaje stałą rezydentką Niebieskiego Kota. Ma własne kryjówki, opiekunów, których dobrze zna, oraz możliwość odpoczynku poza salą zawsze, gdy tego potrzebuje.',
    sideTitle: 'Jak ją wspieramy', sideText: 'Regularne badania, spokojna rutyna, odpowiednia dieta i pełna swoboda wycofania się z kontaktu z gośćmi.',
    seoDescription: 'Poznaj Lunę: jej historię, spokojny charakter, zdrowie, ulubione miejsca i codzienny rytm w kawiarni Niebieski Kot.',
  },
  mochi: {
    name: 'Mochi',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=88&w=1200&auto=format&fit=crop',
    imageAlt: 'Mochi — łagodny kocur i mistrz drzemek',
    badge: 'Rezydent na stałe',
    tagline: 'Mistrz drzemek, miękkich koców i towarzystwa czytelników.',
    intro: 'Mochi jest łagodnym, statecznym kocurem. Nie zabiega o uwagę, ale chętnie układa się obok spokojnej osoby i potrafi przespać całe spotkanie autorskie.',
    summaryTitle: 'Najkrócej o Mochim',
    summary: 'Zrównoważony, serdeczny i cierpliwy. Kocha rytuały, ciepłe miejsca i ludzi, którzy nie próbują przyspieszać znajomości.',
    age: '6 lat', birth: 'urodzony około 2 marca 2020', joined: '18 czerwca 2025', origin: 'trafił do nas przez fundację',
    healthStatus: 'Pod dobrą opieką', healthNote: 'wymaga kontroli zębów', status: 'Stały gospodarz', statusNote: 'nie jest przeznaczony do adopcji',
    historyLabel: 'Jego historia', historyTitle: 'Z działek prosto na miękki fotel.',
    story: [
      'Mochi został znaleziony na opolskich ogródkach działkowych. Był oswojony, ale nikt nie zgłosił się po niego, dlatego po badaniach zamieszkał w domu tymczasowym lokalnej fundacji.',
      'Do kawiarni przyjechał 18 czerwca 2025 roku. Pierwszą noc spędził w pokoju adaptacyjnym, a następnego ranka zasnął na kocu opiekuna — wtedy wiedzieliśmy, że poczuł się bezpiecznie.',
      'Jego wiek jest szacunkowy. Lekarz określił go na podstawie uzębienia, budowy ciała i wyników pierwszych badań.',
    ],
    healthIntro: 'Mochi czuje się dobrze i nie przyjmuje stałych leków. Po wcześniejszym zabiegu stomatologicznym regularnie kontrolujemy jego zęby i podajemy głównie mokrą karmę.',
    health: ['szczepienia podstawowe aktualne', 'regularnie odrobaczany', 'wykastrowany', 'zaczipowany', 'testy FIV/FeLV ujemne', 'kontrola stomatologiczna co 6 miesięcy'],
    friendshipTitle: 'Jak się z nim zaprzyjaźnić?',
    friendship: 'Usiądź niedaleko z książką lub laptopem i pozwól mu podejść. Mochi lubi delikatne głaskanie po karku, szczególnie kiedy sam oprze się o dłoń.',
    traits: [{ value: '5/10', label: 'ciekawość' }, { value: '3/10', label: 'zabawa' }, { value: '9/10', label: 'bliskość' }],
    signal: 'Mochi przestaje mruczeć i odwraca ciało. Wtedy kończymy głaskanie i pozwalamy mu odejść.',
    likes: ['polarowe koce', 'ciepłe parapety', 'spokojne rozmowy', 'głaskanie po karku', 'mokre jedzenie', 'papierowe torby bez uchwytów'],
    boundaries: ['nie budzimy go do zdjęcia', 'nie dotykamy łap podczas snu', 'nie podajemy jedzenia ze stołu', 'potrzebuje szerokiego przejścia do kryjówki'],
    routineTitle: 'Rytm Mochiego.', routineIntro: 'Jego dzień jest prosty: dobre jedzenie, odrobina ruchu i dużo bezpiecznego odpoczynku.',
    routine: [['08:30', 'Mokra karma, woda i krótka kontrola samopoczucia.'], ['10:15', 'Łagodna zabawa piłeczką lub matą węchową.'], ['11:00–15:30', 'Najdłuższa drzemka w cichej części kawiarni.'], ['16:30', 'Towarzystwo gości przy stolikach z książkami.'], ['19:30', 'Kolacja, pielęgnacja sierści i odpoczynek.']],
    placeLabel: 'Jego miejsce', placeTitle: 'Tu znalazł bezpieczny dom.',
    placeText: 'Mochi jest stałym rezydentem kawiarni. Najlepiej funkcjonuje w dobrze znanym rytmie, z własnym legowiskiem i opiekunami, którzy pilnują jego diety oraz odpoczynku.',
    sideTitle: 'Jak go wspieramy', sideText: 'Kontrolujemy zęby, dbamy o prawidłową wagę, podajemy mokrą karmę i zapewniamy spokojne strefy niedostępne dla gości.',
    seoDescription: 'Poznaj Mochiego: jego historię, łagodny charakter, zdrowie, ulubione rytuały i codzienne życie w kawiarni Niebieski Kot.',
  },
  pixel: {
    name: 'Pixel',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=88&w=1200&auto=format&fit=crop',
    imageAlt: 'Pixel — młody kot szukający domu', badge: 'Szuka domu',
    tagline: 'Ciekawski łowca wędek i zawodowy inspektor kartonów.',
    intro: 'Pixel jest energiczny, kontaktowy i bardzo czytelnie pokazuje swoje granice. Najpierw obserwuje człowieka, a kiedy poczuje się bezpiecznie — przynosi zabawkę i zaprasza do wspólnej zabawy.',
    summaryTitle: 'Najkrócej o Pixelu', summary: 'Towarzyski, ale nienachalny. Aktywny rano i późnym popołudniem. Najlepiej odnajdzie się w spokojnym domu, który da mu czas na aklimatyzację.',
    age: '2 lata', birth: 'urodzony około 18 maja 2024', joined: '3 lutego 2026', origin: 'przyjechał z domu tymczasowego',
    healthStatus: 'Gotowy do adopcji', healthNote: 'regularnie kontrolowany', status: 'Szuka domu', statusNote: 'po okresie zapoznawczym',
    historyLabel: 'Jego historia', historyTitle: 'Od nieśmiałego gościa do duszy kawiarni.',
    story: ['Pixel nie urodził się w kawiarni. Został znaleziony jako młody kot na opolskich ogródkach działkowych, a następnie trafił pod opiekę lokalnego domu tymczasowego.', 'Do Niebieskiego Kota przyjechał 3 lutego 2026 roku. Pierwsze dwa dni spędził w spokojnym pokoju adaptacyjnym. Trzeciego dnia sam wyszedł zwiedzić salę, a tydzień później odkrył swoją ulubioną kryjówkę pod stolikiem przy oknie.', 'Jego data urodzenia jest orientacyjna — lekarz weterynarii oszacował ją na maj 2024 roku na podstawie uzębienia i ogólnego rozwoju.'],
    healthIntro: 'Pixel jest pod regularną kontrolą lekarza i nie wymaga obecnie stałego leczenia ani specjalistycznej diety.',
    health: ['szczepienia podstawowe aktualne', 'odrobaczony i zabezpieczony przeciw pasożytom', 'wykastrowany', 'zaczipowany', 'testy FIV/FeLV ujemne'],
    friendshipTitle: 'Jak się z nim zaprzyjaźnić?', friendship: 'Usiądź bokiem, połóż zabawkę niedaleko siebie i pozwól mu wykonać pierwszy krok. Pixel szybko uczy się rytuałów i chętnie wraca do osób, które szanują jego sygnały.',
    traits: [{ value: '9/10', label: 'ciekawość' }, { value: '8/10', label: 'zabawa' }, { value: '6/10', label: 'przytulanie' }],
    signal: 'Pixel odwraca głowę i macha końcówką ogona. Wtedy najlepiej zrobić przerwę.',
    likes: ['wędki z piórkami', 'papierowe kulki', 'kartonowe pudełka', 'obserwowanie ulicy z parapetu', 'krótkie drzemki pod stolikiem', 'smaczki z kurczakiem'],
    boundaries: ['nie lubi gwałtownego podnoszenia', 'potrzebuje chwili przy nowych osobach', 'głośne zabawki szybko go męczą', 'miska powinna stać z dala od kuwety'],
    routineTitle: 'Rytm Pixela.', routineIntro: 'Regularny plan pozwala mu odpocząć między spotkaniami z gośćmi.',
    routine: [['08:30', 'Śniadanie i krótka kontrola samopoczucia.'], ['10:00', 'Najbardziej energiczna zabawa z opiekunem.'], ['12:00–15:00', 'Drzemka w cichym miejscu poza salą.'], ['16:00', 'Obserwowanie gości i polowanie na wędkę.'], ['19:30', 'Kolacja, wyciszenie i nocny obchód kartonów.']],
    placeLabel: 'Idealny dom', placeTitle: 'Spokojny, uważny i gotowy na zabawę.',
    placeText: 'Pixel może zamieszkać ze spokojnym dorosłym kotem po prawidłowym zapoznaniu. Preferujemy dom bez bardzo małych dzieci, z zabezpieczonymi oknami i minimum dwiema krótkimi sesjami zabawy dziennie.',
    sideTitle: 'Proces adopcji', sideText: 'Rozmowa, ankieta, spotkanie z Pixelem i wizyta przedadopcyjna. Umowa oraz kontakt po adopcji są częścią procesu.',
    seoDescription: 'Poznaj Pixela: jego historię, charakter, zdrowie, ulubione zabawy i wymarzony dom.',
  },
};

export default function CatProfilePage({ slug = 'pixel' }) {
  const cat = catProfiles[slug] ?? catProfiles.pixel;
  const language = getLanguage();
  const facts = [
    { icon: CalendarDays, label: 'Wiek', value: cat.age, note: cat.birth },
    { icon: Home, label: 'Z nami od', value: cat.joined, note: cat.origin },
    { icon: Stethoscope, label: 'Zdrowie', value: cat.healthStatus, note: cat.healthNote },
    { icon: Heart, label: 'Status', value: cat.status, note: cat.statusNote },
  ];

  return <div className="min-h-screen bg-[#f7f8f4] text-slate-950 selection:bg-sky-200">
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-[#f7f8f4]/90 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8"><a href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white"><Cat size={19}/></span><span className="text-lg font-extrabold tracking-tight">Niebieski Kot<span className="text-sky-500">.</span></span></a><div className="flex items-center gap-2"><LanguageSelect/><a href="/#cats" className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-sky-400 hover:text-sky-600"><ArrowLeft size={16}/> {language === 'ru' ? 'Все коты' : language === 'en' ? 'All cats' : 'Wszystkie koty'}</a></div></div></nav>
    <main>
      <header className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-20">
        <div className="relative"><div className="aspect-[4/5] overflow-hidden rounded-[3rem] bg-sky-100 shadow-2xl"><img src={cat.image} alt={cat.imageAlt} className="h-full w-full object-cover"/></div><span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2.5 text-sm font-black text-amber-950 shadow-lg"><Heart size={16} fill="currentColor"/> {cat.badge}</span></div>
        <div><p className="text-sm font-extrabold uppercase tracking-[.22em] text-sky-600">Poznaj naszego rezydenta</p><h1 className="mt-4 text-7xl font-black tracking-[-.05em] sm:text-8xl">{cat.name}<span className="text-sky-500">.</span></h1><p className="mt-5 text-xl font-bold text-slate-700">{cat.tagline}</p><p className="mt-5 max-w-xl leading-relaxed text-slate-600">{cat.intro}</p><div className="mt-8 rounded-3xl border border-sky-200 bg-sky-50 p-5"><p className="flex items-center gap-2 font-extrabold text-sky-800"><Sparkles size={18}/> {cat.summaryTitle}</p><p className="mt-2 text-sm leading-relaxed text-sky-950/70">{cat.summary}</p></div></div>
      </header>
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{facts.map(({ icon: Icon, label, value, note }) => <article key={label} className="rounded-3xl border border-slate-200 bg-white p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-100 text-sky-600"><Icon size={20}/></span><p className="mt-5 text-xs font-extrabold uppercase tracking-[.16em] text-slate-400">{label}</p><h2 className="mt-1 text-xl font-black">{value}</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">{note}</p></article>)}</div></section>
      <section className="bg-slate-950 py-20 text-white"><div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-sm font-extrabold uppercase tracking-[.2em] text-sky-400">{cat.historyLabel}</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{cat.historyTitle}</h2></div><div className="space-y-5 text-lg leading-relaxed text-slate-300">{cat.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-20 sm:px-8 lg:grid-cols-2"><article className="rounded-[2.5rem] bg-white p-7 sm:p-9"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-emerald-600">Zdrowie</p><h2 className="mt-3 text-3xl font-black">Karta weterynaryjna</h2><p className="mt-4 leading-relaxed text-slate-600">{cat.healthIntro}</p><ul className="mt-7 space-y-3">{cat.health.map((item) => <li key={item} className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-950"><Check size={18} className="shrink-0 text-emerald-600"/>{item}</li>)}</ul></article>
        <article className="rounded-[2.5rem] bg-sky-500 p-7 text-white sm:p-9"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-sky-100">Charakter</p><h2 className="mt-3 text-3xl font-black">{cat.friendshipTitle}</h2><p className="mt-4 leading-relaxed text-sky-50">{cat.friendship}</p><div className="mt-7 grid grid-cols-3 gap-3 text-center">{cat.traits.map((trait) => <Trait key={trait.label} {...trait}/>)}</div><p className="mt-7 rounded-2xl bg-white/15 p-4 text-sm leading-relaxed ring-1 ring-white/20"><strong>Sygnał „mam dość”:</strong> {cat.signal}</p></article></section>
      <section className="mx-auto grid max-w-6xl gap-5 px-5 pb-20 sm:px-8 lg:grid-cols-2"><ListCard title="Co kocha" intro="Te rzeczy prawie zawsze poprawiają humor." items={cat.likes} tone="amber"/><ListCard title="Co warto uszanować" intro="Kilka prostych zasad pomaga czuć się bezpiecznie." items={cat.boundaries} tone="slate"/></section>
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8"><div className="grid gap-10 rounded-[3rem] border border-slate-200 bg-white p-7 sm:p-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-extrabold uppercase tracking-[.18em] text-sky-600">Typowy dzień</p><h2 className="mt-3 text-4xl font-black tracking-tight">{cat.routineTitle}</h2><p className="mt-4 leading-relaxed text-slate-600">{cat.routineIntro}</p></div><div className="space-y-4">{cat.routine.map(([time, text]) => <Routine key={time} time={time} text={text}/>)}</div></div></section>
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8"><div className="overflow-hidden rounded-[3rem] bg-amber-300 p-8 sm:p-12"><div className="grid gap-8 lg:grid-cols-[1fr_.75fr] lg:items-end"><div><p className="text-sm font-extrabold uppercase tracking-[.18em] text-amber-900">{cat.placeLabel}</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{cat.placeTitle}</h2><p className="mt-5 max-w-2xl leading-relaxed text-amber-950/75">{cat.placeText}</p></div><div className="rounded-3xl bg-white/65 p-5"><p className="flex items-center gap-2 font-black"><ShieldCheck size={19}/> {cat.sideTitle}</p><p className="mt-2 text-sm leading-relaxed text-amber-950/70">{cat.sideText}</p></div></div></div></section>
      <p className="mx-auto max-w-2xl px-5 pb-10 text-center text-xs leading-relaxed text-slate-500">{cat.name}, historia i dane zdrowotne są elementem projektu koncepcyjnego. Nie opisują prawdziwego zwierzęcia ani rzeczywistej dokumentacji weterynaryjnej.</p>
    </main>
  </div>;
}

function Trait({ value, label }) { return <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20"><strong className="block text-xl">{value}</strong><span className="text-xs text-sky-100">{label}</span></div>; }
function ListCard({ title, intro, items, tone }) { const warm = tone === 'amber'; return <article className={`rounded-[2.5rem] p-7 sm:p-9 ${warm ? 'bg-amber-100' : 'bg-slate-200'}`}><h2 className="text-3xl font-black">{title}</h2><p className="mt-3 text-slate-600">{intro}</p><ul className="mt-6 flex flex-wrap gap-2">{items.map((item) => <li key={item} className={`rounded-full px-4 py-2 text-sm font-bold ${warm ? 'bg-white text-amber-950' : 'bg-white text-slate-800'}`}>{item}</li>)}</ul></article>; }
function Routine({ time, text }) { return <div className="flex gap-4 rounded-2xl bg-slate-50 p-4"><span className="flex shrink-0 items-center gap-2 font-black text-sky-600"><Clock3 size={17}/>{time}</span><p className="text-sm leading-relaxed text-slate-600">{text}</p></div>; }
