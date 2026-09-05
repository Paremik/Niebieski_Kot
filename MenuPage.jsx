import React from 'react';
import { ArrowLeft, Cat, Coffee, Heart, Leaf, Sparkles, Wheat } from 'lucide-react';

const groups = [
  { icon: Coffee, title: 'Kawy', note: 'Ziarno specialty · mleko owsiane bez dopłaty', items: [['Espresso', '10 zł'], ['Americano', '12 zł'], ['Cappuccino', '15 zł'], ['Flat white', '17 zł'], ['Kocie latte', '18 zł']] },
  { icon: Sparkles, title: 'Bez kawy', note: 'Na ciepło i na zimno', items: [['Matcha latte', '18 zł'], ['Herbata liściasta', '14 zł'], ['Kakao z piankami', '16 zł'], ['Lemoniada sezonowa', '17 zł']] },
  { icon: Wheat, title: 'Na głód', note: 'Kuchnia czynna do 18:30', items: [['Tost „Rudy Kocur”', '24 zł'], ['Bajgiel z jajkiem', '26 zł'], ['Grzanka z kozim serem', '27 zł'], ['Zupa dnia', '19 zł'], ['Sałatka z pieczonym burakiem', '28 zł']] },
  { icon: Heart, title: 'Słodkości', note: 'Codziennie z lokalnej pracowni', items: [['Sernik baskijski', '19 zł'], ['Szarlotka na ciepło', '18 zł'], ['Brownie wegańskie', '17 zł'], ['Kocie ciasteczko', '8 zł']] },
];

export default function MenuPage() {
  return <div className="min-h-screen bg-[#f7f8f4] text-slate-950">
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-[#f7f8f4]/90 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8"><a href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white"><Cat size={19}/></span><span className="text-lg font-extrabold tracking-tight">Niebieski Kot<span className="text-sky-500">.</span></span></a><a href="/" className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-sky-400 hover:text-sky-600"><ArrowLeft size={16}/> Wróć do kawiarni</a></div></nav>

    <header className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-20 sm:px-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.22em] text-sky-600">Jedzenie i napoje</span><h1 className="mt-4 text-6xl font-black leading-[.95] tracking-[-.045em] sm:text-8xl">Kocia<br/><span className="text-sky-500">karta.</span></h1></div><div><p className="text-lg leading-relaxed text-slate-600">Proste składniki, sezonowe smaki i kawa, dla której warto zostać chwilę dłużej.</p><div className="mt-5 flex flex-wrap gap-2 text-xs font-bold"><span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-2 text-emerald-800"><Leaf size={14}/> opcje vegan</span><span className="rounded-full bg-amber-100 px-3 py-2 text-amber-800">alergeny u obsługi</span></div></div></header>

    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8"><div className="grid gap-5 md:grid-cols-2">{groups.map(({icon:Icon,title,note,items},index) => <section key={title} className={`rounded-[2.5rem] p-7 sm:p-9 ${index === 0 ? 'bg-slate-950 text-white' : index === 1 ? 'bg-sky-500 text-white' : 'border border-slate-200 bg-white'}`}><div className="mb-8 flex items-start justify-between"><div><h2 className="text-3xl font-black">{title}</h2><p className={`mt-1 text-sm ${index < 2 ? 'text-white/70' : 'text-slate-500'}`}>{note}</p></div><span className={`grid h-12 w-12 place-items-center rounded-2xl ${index < 2 ? 'bg-white text-sky-600' : 'bg-sky-100 text-sky-600'}`}><Icon size={22}/></span></div><div className="space-y-4">{items.map(([name,price]) => <div key={name} className="flex items-center gap-3"><span className="font-semibold">{name}</span><span className={`h-px flex-1 ${index < 2 ? 'bg-white/20' : 'bg-slate-200'}`}/><strong>{price}</strong></div>)}</div></section>)}</div>
      <div className="mt-6 rounded-[2rem] bg-amber-300 px-6 py-6 text-center sm:px-10"><p className="font-black">Opłata opiekuńcza: 8 zł / osoba</p><p className="mt-1 text-sm text-amber-950/75">Cała kwota wspiera karmę, leczenie i przygotowanie kotów do adopcji.</p></div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-500">Menu jest częścią projektu koncepcyjnego. Dostępność dań może zmieniać się sezonowo. Informację o składnikach i alergenach zawsze potwierdź u obsługi.</p>
    </main>
  </div>;
}
