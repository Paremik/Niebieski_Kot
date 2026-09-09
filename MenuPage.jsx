import { Link } from 'react-router-dom';
import { useLanguage } from './src/i18n/LanguageProvider.jsx';
import React from 'react';
import { ArrowLeft, Cat, Coffee, Heart, Leaf, Sparkles, Wheat } from 'lucide-react';
import LanguageSelect, { getLanguage } from './LanguageSelect.jsx';
import { useSiteContent } from './src/content/SiteContentProvider.jsx';
const groups = [{
  icon: Coffee,
  title: 'Kawy',
  note: 'Ziarno specialty · mleko owsiane bez dopłaty',
  items: [['Espresso', '10 zł'], ['Americano', '12 zł'], ['Cappuccino', '15 zł'], ['Flat white', '17 zł'], ['Kocie latte', '18 zł']]
}, {
  icon: Sparkles,
  title: 'Bez kawy',
  note: 'Na ciepło i na zimno',
  items: [['Matcha latte', '18 zł'], ['Herbata liściasta', '14 zł'], ['Kakao z piankami', '16 zł'], ['Lemoniada sezonowa', '17 zł']]
}, {
  icon: Wheat,
  title: 'Na głód',
  note: 'Kuchnia czynna do 18:30',
  items: [['Tost „Rudy Kocur”', '24 zł'], ['Bajgiel z jajkiem', '26 zł'], ['Grzanka z kozim serem', '27 zł'], ['Zupa dnia', '19 zł'], ['Sałatka z pieczonym burakiem', '28 zł']]
}, {
  icon: Heart,
  title: 'Słodkości',
  note: 'Codziennie z lokalnej pracowni',
  items: [['Sernik baskijski', '19 zł'], ['Szarlotka na ciepło', '18 zł'], ['Brownie wegańskie', '17 zł'], ['Kocie ciasteczko', '8 zł']]
}];
const copy = {
  pl: {
    back: 'Wróć do kawiarni',
    label: 'Jedzenie i napoje',
    title: 'Kocia karta.',
    intro: 'Proste składniki, sezonowe smaki i kawa, dla której warto zostać chwilę dłużej.',
    vegan: 'opcje vegan',
    allergens: 'alergeny u obsługi',
    fee: 'Opłata opiekuńcza: 8 zł / osoba',
    feeText: 'Cała kwota wspiera karmę, leczenie i przygotowanie kotów do adopcji.',
    note: 'Menu jest częścią projektu koncepcyjnego. Dostępność dań może zmieniać się sezonowo. Informację o składnikach i alergenach zawsze potwierdź u obsługi.'
  },
  ru: {
    back: 'Вернуться в кафе',
    label: 'Еда и напитки',
    title: 'Кошачье меню.',
    intro: 'Простые ингредиенты, сезонные вкусы и кофе, ради которого стоит задержаться.',
    vegan: 'веганские опции',
    allergens: 'аллергены уточняйте у команды',
    fee: 'Забота о котах: 8 zł / человек',
    feeText: 'Вся сумма помогает оплачивать корм, лечение и подготовку котов к усыновлению.',
    note: 'Меню — часть концептуального проекта. Состав блюд может меняться по сезону. Всегда уточняйте ингредиенты и аллергены у команды.'
  },
  en: {
    back: 'Back to the café',
    label: 'Food and drinks',
    title: 'The cat menu.',
    intro: 'Simple ingredients, seasonal flavours and coffee worth staying for a little longer.',
    vegan: 'vegan options',
    allergens: 'ask the team about allergens',
    fee: 'Care fee: 8 zł / person',
    feeText: 'Every złoty supports food, treatment and preparing cats for adoption.',
    note: 'This menu is part of a concept project. Availability changes seasonally. Please confirm ingredients and allergens with the team.'
  }
};
const groupCopy = {
  ru: [['Кофе', 'Зерно specialty · овсяное молоко без доплаты'], ['Без кофе', 'Горячие и холодные напитки'], ['Перекусить', 'Кухня работает до 18:30'], ['Сладости', 'Каждый день от местной пекарни']],
  en: [['Coffee', 'Specialty beans · oat milk at no extra cost'], ['No coffee', 'Hot and cold drinks'], ['For a bite', 'Kitchen open until 18:30'], ['Sweets', 'Fresh from a local bakery every day']]
};
export default function MenuPage() {
  const {
    language,
    tr
  } = useLanguage();
  const { data: siteContent, text } = useSiteContent();
  const t = copy[language];
  return <div className="min-h-screen bg-[#f7f8f4] text-slate-950">
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-[#f7f8f4]/90 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-5 sm:px-8"><Link to="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-full bg-sky-500 text-white"><Cat size={19} /></span><span className="text-lg font-extrabold tracking-tight">Niebieski Kot<span className="text-sky-500">.</span></span></Link><div className="flex items-center gap-2"><LanguageSelect /><Link to="/" className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-sky-400 hover:text-sky-600"><ArrowLeft size={16} /> {t.back}</Link></div></div></nav>
    <header className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 pt-20 sm:px-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><span className="text-sm font-extrabold uppercase tracking-[.22em] text-sky-600">{t.label}</span><h1 className="mt-4 text-6xl font-black leading-[.95] tracking-[-.045em] sm:text-8xl">{t.title.split(' ')[0]}<br /><span className="text-sky-500">{t.title.split(' ').slice(1).join(' ')}</span></h1></div><div><p className="text-lg leading-relaxed text-slate-600">{t.intro}</p><div className="mt-5 flex flex-wrap gap-2 text-xs font-bold"><span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-2 text-emerald-800"><Leaf size={14} /> {t.vegan}</span><span className="rounded-full bg-amber-100 px-3 py-2 text-amber-800">{t.allergens}</span></div></div></header>
    {siteContent.media.menuImages[0] && <section className="mx-auto max-w-6xl px-5 pb-10 sm:px-8"><div className="aspect-[21/8] overflow-hidden rounded-[2.5rem] bg-sky-100 shadow-lg"><img src={siteContent.media.menuImages[0].image} alt={text(siteContent.media.menuImages[0].alt)} className="h-full w-full object-cover"/></div></section>}
    <main className="mx-auto max-w-6xl px-5 pb-24 sm:px-8"><div className="grid gap-5 md:grid-cols-2">{groups.map(({
          icon: Icon,
          title,
          note,
          items
        }, index) => {
          const translated = groupCopy[language]?.[index];
          const dynamicItems = siteContent.prices.filter(item => item.enabled && item.group === ['coffee', 'other', 'food', 'sweet'][index]);
          return <section key={title} className={`rounded-[2.5rem] p-7 sm:p-9 ${index === 0 ? 'bg-slate-950 text-white' : index === 1 ? 'bg-sky-500 text-white' : 'border border-slate-200 bg-white'}`}><div className="mb-8 flex items-start justify-between"><div><h2 className="text-3xl font-black">{translated?.[0] || title}</h2><p className={`mt-1 text-sm ${index < 2 ? 'text-white/70' : 'text-slate-500'}`}>{translated?.[1] || note}</p></div><span className={`grid h-12 w-12 place-items-center rounded-2xl ${index < 2 ? 'bg-white text-sky-600' : 'bg-sky-100 text-sky-600'}`}><Icon size={22} /></span></div><div className="space-y-4">{dynamicItems.map(item => <div key={item.id} className="flex items-center gap-3"><span className="font-semibold">{text(item.name)}</span><span className={`h-px flex-1 ${index < 2 ? 'bg-white/20' : 'bg-slate-200'}`} /><strong className="shrink-0 whitespace-nowrap">{item.price}</strong></div>)}</div></section>;
        })}</div>
      <div className="mt-6 rounded-[2rem] bg-amber-300 px-6 py-6 text-center sm:px-10"><p className="font-black">{t.fee}</p><p className="mt-1 text-sm text-amber-950/75">{t.feeText}</p></div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-500">{t.note}</p>
    </main>
  </div>;
}
