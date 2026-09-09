import { catProfiles } from './catProfiles.js';
import catalog from '../i18n/catalog.json' with { type: 'json' };
import profileTranslations from '../i18n/profiles.js';
import additions from '../i18n/additions.js';
import { cats as baseCats, menuSlides } from './homeData.js';

export const contentLocales = ['pl', 'ru', 'en'];
export const localized = (pl, ru = pl, en = pl) => ({ pl, ru, en });
export const textFor = (value, language = 'pl') => typeof value === 'string' ? value : value?.[language] ?? value?.pl ?? '';
const defaultBookingSettings = { maxTables: 6, blockedDates: [], specialDates: [] };
const defaultCafeSettings = {
  address: localized('ul. Krakowska 32, 45-075 Opole', 'ул. Краковская 32, 45-075 Ополе', '32 Krakowska St, 45-075 Opole'),
  phone: '+48 600 123 456',
  email: 'czesc@niebieskikot-opole.pl',
  instagram: '@niebieszikot.opole',
  facebook: 'Niebieski Kot Opole',
  mapUrl: 'https://www.openstreetmap.org/search?query=Krakowska%2032%20Opole',
  rules: [
    localized('Przed wejściem do strefy kotów dezynfekujemy ręce.', 'Перед входом в зону котов дезинфицируем руки.', 'Please sanitise your hands before entering the cats’ area.'),
    localized('Pozwalamy kotom decydować o kontakcie — nie budzimy ich i nie bierzemy na ręce.', 'Позволяем котам самим решать, хотят ли они контакта — не будим и не берём на руки.', 'Let cats decide when they want contact — do not wake or pick them up.'),
    localized('Zdjęcia robimy bez lampy błyskowej, z szacunkiem dla kociego spokoju.', 'Фотографируем без вспышки, уважая спокойствие котов.', 'Take photos without flash and respect the cats’ quiet.'),
    localized('Dzieci zapraszamy pod stałą opieką dorosłych; szczegóły potwierdzi obsługa.', 'Дети могут приходить только под постоянным присмотром взрослых.', 'Children are welcome with continuous adult supervision.')
  ],
  adminNotificationEmail: '',
  adminNotificationsEnabled: true
};
const clone = value => JSON.parse(JSON.stringify(value));
const trim = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const localText = (value, fallback, max = 500) => Object.fromEntries(contentLocales.map(locale => [locale, trim(value?.[locale] ?? (typeof value === 'string' ? value : fallback?.[locale]), max)]));
const stableId = (value, fallback) => trim(value || fallback, 80).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
const safeImage = (value, fallback = '') => {
  const url = trim(value ?? fallback, 1000);
  return /^(https:\/\/|\/images\/|\/api\/media\?id=[a-f0-9-]{20,80}$)/i.test(url) ? url : fallback;
};

export const catProfileTextFields = ['imageAlt','badge','tagline','intro','summaryTitle','summary','age','birth','joined','origin','healthStatus','healthNote','statusNote','historyLabel','historyTitle','healthIntro','friendshipTitle','friendship','signal','likesIntro','boundariesIntro','routineTitle','routineIntro','placeLabel','placeTitle','placeText','sideTitle','sideText','seoDescription'];
export const catProfileListFields = ['story','health','likes','boundaries'];
const profileMessages = { ...catalog, ...additions, ...profileTranslations };
const translatedText = value => Object.fromEntries(contentLocales.map(locale => [locale, profileMessages[String(value ?? '')]?.[locale] ?? String(value ?? '')]));
const defaultCatProfile = slug => {
  const source = catProfiles[slug] || {};
  const profile = Object.fromEntries(catProfileTextFields.map(field => [field, translatedText(source[field])]));
  profile.likesIntro = localized('Te rzeczy prawie zawsze poprawiają humor.','Эти вещи почти всегда поднимают настроение.','These things almost always improve their mood.');
  profile.boundariesIntro = localized('Kilka prostych zasad pomaga czuć się bezpiecznie.','Несколько простых правил помогают чувствовать себя в безопасности.','A few simple rules help them feel safe.');
  for (const field of catProfileListFields) profile[field] = (source[field] || []).map(translatedText);
  profile.traits = (source.traits || []).map(item => ({ value: translatedText(item.value), label: translatedText(item.label) }));
  profile.routine = (source.routine || []).map(([time, text]) => ({ time: translatedText(time), text: translatedText(text) }));
  return profile;
};
const normalizeCatProfile = (value, fallback) => {
  const source = value && typeof value === 'object' ? value : {};
  const profile = Object.fromEntries(catProfileTextFields.map(field => [field, localText(source[field], fallback[field], field === 'seoDescription' ? 1000 : 2000)]));
  for (const field of catProfileListFields) {
    const rows = Array.isArray(source[field]) ? source[field] : fallback[field];
    profile[field] = rows.slice(0, 20).map((item, index) => localText(item, fallback[field][index], 2000));
  }
  const traits = Array.isArray(source.traits) ? source.traits : fallback.traits;
  profile.traits = traits.slice(0, 10).map((item, index) => ({ value: localText(item?.value, fallback.traits[index]?.value, 80), label: localText(item?.label, fallback.traits[index]?.label, 160) }));
  const routine = Array.isArray(source.routine) ? source.routine : fallback.routine;
  profile.routine = routine.slice(0, 20).map((item, index) => ({ time: localText(item?.time, fallback.routine[index]?.time, 80), text: localText(item?.text, fallback.routine[index]?.text, 2000) }));
  return profile;
};

const menu = [
  ['espresso','coffee','Espresso','Эспрессо','Espresso','10 zł'], ['americano','coffee','Americano','Американо','Americano','12 zł'], ['cappuccino','coffee','Cappuccino','Капучино','Cappuccino','15 zł'], ['flat-white','coffee','Flat white','Флэт уайт','Flat white','17 zł'], ['cat-latte','coffee','Kocie latte','Кошачий латте','Cat latte','18 zł'],
  ['matcha','other','Matcha latte','Матча латте','Matcha latte','18 zł'], ['tea','other','Herbata liściasta','Листовой чай','Loose-leaf tea','14 zł'], ['cocoa','other','Kakao z piankami','Какао с маршмеллоу','Cocoa with marshmallows','16 zł'], ['lemonade','other','Lemoniada sezonowa','Сезонный лимонад','Seasonal lemonade','17 zł'],
  ['toast','food','Tost „Rudy Kocur”','Тост «Рыжий кот»','“Ginger Tom” toast','24 zł'], ['bagel','food','Bajgiel z jajkiem','Бейгл с яйцом','Egg bagel','26 zł'], ['goat-toast','food','Grzanka z kozim serem','Гренка с козьим сыром','Goat cheese toast','27 zł'], ['soup','food','Zupa dnia','Суп дня','Soup of the day','19 zł'], ['beet-salad','food','Sałatka z pieczonym burakiem','Салат с запечённой свёклой','Roasted beet salad','28 zł'],
  ['cheesecake','sweet','Sernik baskijski','Баскский чизкейк','Basque cheesecake','19 zł'], ['apple-pie','sweet','Szarlotka na ciepło','Тёплый яблочный пирог','Warm apple pie','18 zł'], ['brownie','sweet','Brownie wegańskie','Веганский брауни','Vegan brownie','17 zł'], ['cookie','sweet','Kocie ciasteczko','Печенье-котик','Cat cookie','8 zł']
].map(([id, group, pl, ru, en, price]) => ({ id, group, name: localized(pl, ru, en), price, enabled: true }));

export const defaultData = {
  schedule: [
    { id:'monday', day:localized('Poniedziałek','Понедельник','Monday'), hours:localized('zamknięte','закрыто','closed') },
    { id:'weekdays', day:localized('Wtorek–Piątek','Вторник–пятница','Tuesday–Friday'), hours:localized('11:00–20:00') },
    { id:'weekend', day:localized('Sobota–Niedziela','Суббота–воскресенье','Saturday–Sunday'), hours:localized('10:00–20:00') }
  ],
  prices: menu,
  events: [
    { id:'yoga', image:'', tag:localized('Każda niedziela','Каждое воскресенье','Every Sunday'), title:localized('Joga z kotami','Йога с котами','Yoga with cats'), description:localized('Łagodna praktyka dla początkujących, spokojna muzyka i koty spacerujące po sali.','Мягкая практика для начинающих, спокойная музыка и коты, гуляющие по залу.','Gentle practice for beginners, calm music and cats wandering around the room.'), date:localized('10:00 · 60 minut · 45 zł','10:00 · 60 минут · 45 zł','10:00 · 60 minutes · 45 zł'), places:'8', status:'open', enabled:true },
    { id:'games', image:'', tag:localized('Każdy piątek','Каждую пятницу','Every Friday'), title:localized('Wieczór gier planszowych','Вечер настольных игр','Board game evening'), description:localized('Małe grupy, przytulne gry i gorący napój z naszej karty.','Небольшие компании, уютные игры и горячий напиток из нашего меню.','Small groups, cosy games and a hot drink from our menu.'), date:localized('18:00 · 90 minut · 25 zł','18:00 · 90 минут · 25 zł','18:00 · 90 minutes · 25 zł'), places:'12', status:'open', enabled:true },
    { id:'adoption', image:'', tag:localized('Pierwsza niedziela miesiąca','Первое воскресенье месяца','First Sunday of the month'), title:localized('Dzień adopcji','День усыновления','Adoption day'), description:localized('Poznaj nasze koty, porozmawiaj z wolontariuszami i przygotuj się do odpowiedzialnej adopcji.','Познакомьтесь с котами, поговорите с волонтёрами и подготовьтесь к ответственному усыновлению.','Meet our cats, talk to volunteers and prepare for responsible adoption.'), date:localized('12:00 · Wstęp wolny · obowiązują zapisy','12:00 · Вход свободный · нужна регистрация','12:00 · Free entry · registration required'), places:'20', status:'planned', enabled:true }
  ],
  availability: { status:'calm', note:localized('Dużo wolnych miejsc · aktualizacja ręczna','Много свободных мест · обновлено вручную','Plenty of free tables · updated manually') },
  bookingSettings: defaultBookingSettings,
  cafeSettings: defaultCafeSettings,
  media: {
    menuImages: menuSlides.map((slide, index) => ({ id:`menu-image-${index + 1}`, image:slide.image, alt:translatedText(slide.alt), label:translatedText(slide.label) }))
  },
  seo: {
    pages: [
      { id:'home', path:'/', title:localized('Kocia kawiarnia w Opolu','Котокафе в Ополе','Cat café in Opole'), description:localized('Niebieski Kot — kameralna kocia kawiarnia w Opolu. Specialty coffee, domowe słodkości i spokojne spotkania z mruczącymi rezydentami.','Niebieski Kot — уютное котокафе в Ополе. Кофе, домашние десерты и спокойные встречи с мурчащими жителями.','Niebieski Kot is a cosy cat café in Opole with specialty coffee, homemade sweets and calm meetings with our resident cats.') },
      { id:'menu', path:'/menu', title:localized('Menu kociej kawiarni','Меню котокафе','Cat café menu'), description:localized('Kawy specialty, śniadania, lekkie dania i domowe słodkości w Niebieskim Kocie.','Кофе, завтраки, лёгкие блюда и домашние десерты в Niebieski Kot.','Specialty coffee, breakfasts, light meals and homemade sweets at Niebieski Kot.') },
      ...['luna','mochi','pixel'].map(slug => ({ id:`cat-${slug}`, path:`/koty/${slug}`, title:translatedText(catProfiles[slug].name), description:translatedText(catProfiles[slug].seoDescription) }))
    ]
  },
  homepage: {
    cats: { label:localized('Nasi gospodarze','Наши хозяева','Our hosts'), title:localized('Poznaj ekipę.','Познакомься с командой.','Meet the team.'), text:localized('Każdy inny. Każdy u siebie. Pixel szuka domu, Luna i Mochi są stałymi gospodarzami.','Все разные и каждый у себя дома. Пиксель ищет дом, Луна и Мочи — постоянные жители.','Each one is different and at home here. Pixel is looking for a home; Luna and Mochi are resident hosts.') },
    visit: { label:localized('Zanim wpadniesz','Перед визитом','Before you visit'), title:localized('Zaplanuj miękkie lądowanie.','Запланируй мягкую посадку.','Plan a soft landing.'), rows:[
      { title:localized('Wt–Pt 11:00–20:00 · Sob–Nd 10:00–20:00','Вт–Пт 11:00–20:00 · Сб–Вс 10:00–20:00','Tue–Fri 11:00–20:00 · Sat–Sun 10:00–20:00'), text:localized('W poniedziałki lokal jest zamknięty — to dzień ciszy dla kotów.','По понедельникам кафе закрыто — это день тишины для котов.','The café is closed on Mondays — it is a quiet day for the cats.') },
      { title:localized('ul. Krakowska 32, 45-075 Opole','ул. Краковская 32, 45-075 Ополе','32 Krakowska St, 45-075 Opole'), text:localized('5 minut spacerem od opolskiego Rynku · adres koncepcyjny.','5 минут пешком от рынка Ополе · адрес концептуальный.','A 5-minute walk from Opole Market Square · concept address.') },
      { title:localized('Stoliki na 90 minut','Столики на 90 минут','Tables for 90 minutes'), text:localized('W weekend rezerwacja zalecana. Dzieci od 8 lat, zawsze pod opieką dorosłego.','На выходных рекомендуем бронирование. Дети от 8 лет — только со взрослым.','Booking is recommended at weekends. Children aged 8+ must be accompanied by an adult.') }
    ], book:localized('Zarezerwuj stolik','Забронировать столик','Book a table'), ask:localized('Zapytaj asystenta','Спросить ассистента','Ask the assistant'), map:localized('Pokaż mapę','Открыть карту','Show map') },
    needs: { label:localized('Lista potrzeb','Список нужд','Wish list'), title:localized('Co przyda się najbardziej?','Что сейчас нужнее всего?','What helps most?'), text:localized('Rzeczy można przynieść po wcześniejszym kontakcie z obsługą. Najpierw sprawdzimy, czego aktualnie potrzebują koty.','Вещи можно принести после связи с командой. Сначала уточним, что котам нужно сейчас.','Please contact the team before bringing items so we can confirm what the cats need right now.'), items:[
      localized('mokra karma dobrej jakości','качественный влажный корм','good-quality wet food'), localized('żwirek bentonitowy bez zapachu','бентонитовый наполнитель без запаха','unscented bentonite litter'), localized('polarowe koce i ręczniki','флисовые пледы и полотенца','fleece blankets and towels'), localized('transportery w dobrym stanie','переноски в хорошем состоянии','carriers in good condition'), localized('preparaty na pchły i kleszcze','средства от блох и клещей','flea and tick treatments'), localized('środki do bezpiecznego sprzątania','безопасные средства для уборки','pet-safe cleaning products')
    ] },
    events: { label:localized('W kalendarzu kociej kawiarni','В календаре котокафе','In the cat café calendar'), title:localized('Wydarzenia, na które chce się wracać.','События, ради которых хочется вернуться.','Events worth coming back for.'), text:localized('Małe spotkania w spokojnym rytmie. Liczba miejsc jest ograniczona, dlatego warto zapisać się wcześniej.','Небольшие встречи в спокойном ритме. Количество мест ограничено, поэтому лучше записаться заранее.','Small gatherings at a calm pace. Places are limited, so early registration is recommended.'), button:localized('Zapisz się','Записаться','Sign up') }
  },
  cats: [
    { id:'luna', slug:'luna', name:'Luna', image:baseCats[0].image, status:'resident', linkLabel:localized('Poznaj Lunę','Познакомиться с Луной','Meet Luna'), note:localized('4 lata · spokojna obserwatorka','4 года · спокойная наблюдательница','4 years · a calm observer'), intro:localized('Najchętniej siedzi przy oknie i sama wybiera moment na głaskanie.','Любит сидеть у окна и сама выбирает момент для ласки.','She loves sitting by the window and chooses when it is time for affection.'), profile:defaultCatProfile('luna'), enabled:true },
    { id:'mochi', slug:'mochi', name:'Mochi', image:baseCats[1].image, status:'resident', linkLabel:localized('Poznaj Mochiego','Познакомиться с Мочи','Meet Mochi'), note:localized('6 lat · mistrz drzemek','6 лет · мастер сна','6 years · master napper'), intro:localized('Kocha miękkie koce, spokojne rozmowy i ludzi z książką na kolanach.','Любит мягкие пледы, спокойные разговоры и людей с книгой на коленях.','He loves soft blankets, quiet conversation and people reading a book.'), profile:defaultCatProfile('mochi'), enabled:true },
    { id:'pixel', slug:'pixel', name:'Pixel', image:baseCats[2].image, status:'adoption', linkLabel:localized('Poznaj Pixela','Познакомиться с Пикселем','Meet Pixel'), note:localized('2 lata · pierwszy do zabawy','2 года · всегда первый в игре','2 years · always first to play'), intro:localized('Wędkę wypatrzy z drugiego końca sali, a potem zasypia pod stolikiem.','Удочку заметит с другого конца зала, а потом уснёт под столиком.','He spots a teaser toy across the room, then falls asleep under a table.'), profile:defaultCatProfile('pixel'), enabled:true }
  ],
  revision: 0,
  updatedAt: null
};

export function normalizeAdminData(input) {
  const source = input && typeof input === 'object' ? input : {};
  const result = clone(defaultData);
  result.schedule = (Array.isArray(source.schedule) ? source.schedule : defaultData.schedule).slice(0,14).map((row,i)=>({id:stableId(row?.id,`schedule-${i}`),day:localText(row?.day,defaultData.schedule[i]?.day),hours:localText(row?.hours,defaultData.schedule[i]?.hours)}));
  result.prices = (Array.isArray(source.prices) ? source.prices : defaultData.prices).slice(0,80).map((row,i)=>({id:stableId(row?.id,`menu-${i}`),group:['coffee','other','food','sweet'].includes(row?.group)?row.group:'coffee',name:localText(row?.name,defaultData.prices[i]?.name),price:trim(row?.price??defaultData.prices[i]?.price,30),enabled:row?.enabled!==false}));
  result.events = (Array.isArray(source.events) ? source.events : defaultData.events).slice(0,30).map((row,i)=>{const fallback=defaultData.events[i%defaultData.events.length];return {id:stableId(row?.id,`event-${i}`),image:safeImage(row?.image,fallback.image),tag:localText(row?.tag,fallback.tag),title:localText(row?.title,fallback.title),description:localText(row?.description,fallback.description,2000),date:localText(row?.date,fallback.date),places:trim(row?.places??'0',4),status:['open','planned','closed'].includes(row?.status)?row.status:'planned',enabled:row?.enabled!==false};});
  const availability=source.availability??defaultData.availability;
  result.availability={status:['calm','busy','almost-full','full'].includes(availability?.status)?availability.status:'calm',note:localText(availability?.note,defaultData.availability.note)};
  const maxTables=Number(source.bookingSettings?.maxTables);
  const blockedDates=Array.isArray(source.bookingSettings?.blockedDates)?source.bookingSettings.blockedDates.filter(value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value))).slice(0,100):[];
  const specialDates=Array.isArray(source.bookingSettings?.specialDates)?source.bookingSettings.specialDates.slice(0,50).map((row)=>({date:/^\d{4}-\d{2}-\d{2}$/.test(String(row?.date))?String(row.date):'',slots:Array.isArray(row?.slots)?row.slots.filter(value=>/^\d{2}:\d{2}$/.test(String(value))).slice(0,20):[]})).filter(row=>row.date):[];
  result.bookingSettings={maxTables:Number.isInteger(maxTables)&&maxTables>=1&&maxTables<=40?maxTables:defaultBookingSettings.maxTables,blockedDates,specialDates};
  const cafe=source.cafeSettings&&typeof source.cafeSettings==='object'?source.cafeSettings:{};
  result.cafeSettings={
    address:localText(cafe.address,defaultCafeSettings.address,300), phone:trim(cafe.phone??defaultCafeSettings.phone,40), email:trim(cafe.email??defaultCafeSettings.email,254), instagram:trim(cafe.instagram??defaultCafeSettings.instagram,120), facebook:trim(cafe.facebook??defaultCafeSettings.facebook,120), mapUrl:/^https:\/\//i.test(String(cafe.mapUrl||''))?trim(cafe.mapUrl,1000):defaultCafeSettings.mapUrl,
    rules:(Array.isArray(cafe.rules)?cafe.rules:defaultCafeSettings.rules).slice(0,12).map((item,index)=>localText(item,defaultCafeSettings.rules[index]||defaultCafeSettings.rules[0],500)), adminNotificationEmail:trim(cafe.adminNotificationEmail??'',254), adminNotificationsEnabled:cafe.adminNotificationsEnabled!==false
  };
  const media=source.media&&typeof source.media==='object'?source.media:{};
  result.media.menuImages=(Array.isArray(media.menuImages)?media.menuImages:defaultData.media.menuImages).slice(0,8).map((row,i)=>{const fallback=defaultData.media.menuImages[i%defaultData.media.menuImages.length];return {id:stableId(row?.id,`menu-image-${i}`),image:safeImage(row?.image,fallback.image),alt:localText(row?.alt,fallback.alt),label:localText(row?.label,fallback.label)};});
  const seo=source.seo&&typeof source.seo==='object'?source.seo:{};
  result.seo.pages=defaultData.seo.pages.map(fallback=>{const row=Array.isArray(seo.pages)?seo.pages.find(item=>item?.path===fallback.path):null;return {...fallback,title:localText(row?.title,fallback.title,200),description:localText(row?.description,fallback.description,1000)};});
  const homepage=source.homepage&&typeof source.homepage==='object'?source.homepage:{};
  result.homepage.cats=Object.fromEntries(['label','title','text'].map(field=>[field,localText(homepage.cats?.[field],defaultData.homepage.cats[field],2000)]));
  result.homepage.events=Object.fromEntries(['label','title','text','button'].map(field=>[field,localText(homepage.events?.[field],defaultData.homepage.events[field],2000)]));
  result.homepage.visit={...Object.fromEntries(['label','title','book','ask','map'].map(field=>[field,localText(homepage.visit?.[field],defaultData.homepage.visit[field],2000)])),rows:(Array.isArray(homepage.visit?.rows)?homepage.visit.rows:defaultData.homepage.visit.rows).slice(0,10).map((row,i)=>({title:localText(row?.title,defaultData.homepage.visit.rows[i]?.title),text:localText(row?.text,defaultData.homepage.visit.rows[i]?.text,2000)}))};
  result.homepage.needs={...Object.fromEntries(['label','title','text'].map(field=>[field,localText(homepage.needs?.[field],defaultData.homepage.needs[field],2000)])),items:(Array.isArray(homepage.needs?.items)?homepage.needs.items:defaultData.homepage.needs.items).slice(0,20).map((item,i)=>localText(item,defaultData.homepage.needs.items[i]))};
  result.cats=(Array.isArray(source.cats)?source.cats:defaultData.cats).slice(0,20).map((row,i)=>{const fallback=defaultData.cats.find(cat=>cat.slug===row?.slug)||defaultData.cats[i]||defaultData.cats[0];return {id:stableId(row?.id,`cat-${i}`),slug:stableId(row?.slug,fallback.slug??`cat-${i}`),name:trim(row?.name??fallback.name,80),image:safeImage(row?.image,fallback.image),status:['resident','adoption','reserved'].includes(row?.status)?row.status:'resident',linkLabel:localText(row?.linkLabel,fallback.linkLabel),note:localText(row?.note,fallback.note),intro:localText(row?.intro,fallback.intro),profile:normalizeCatProfile(row?.profile,fallback.profile),enabled:row?.enabled!==false};});
  result.revision=Number.isSafeInteger(source.revision)&&source.revision>=0?source.revision:0;
  result.updatedAt=typeof source.updatedAt==='string'?source.updatedAt:null;
  return result;
}

export function validationErrors(input) {
  const data=normalizeAdminData(input), errors=[];
  const required=(value,label)=>contentLocales.forEach(locale=>{if(!trim(value?.[locale]))errors.push(`${label} (${locale.toUpperCase()})`);});
  data.schedule.forEach((row,i)=>{required(row.day,`Dzień ${i+1}`);required(row.hours,`Godziny ${i+1}`);});
  data.prices.forEach((row,i)=>{required(row.name,`Menu ${i+1}`);if(!/^\d+(?:[.,]\d{1,2})?\s*(?:zł|PLN)?$/i.test(row.price))errors.push(`Cena ${i+1}`);});
  data.events.forEach((row,i)=>{required(row.tag,`Etykieta wydarzenia ${i+1}`);required(row.title,`Wydarzenie ${i+1}`);required(row.description,`Opis wydarzenia ${i+1}`);required(row.date,`Data ${i+1}`);if(!/^\d{1,4}$/.test(row.places)||Number(row.places)>1000)errors.push(`Miejsca ${i+1}`);});
  required(data.availability.note,'Dostępność');
  if(!Number.isInteger(data.bookingSettings.maxTables)||data.bookingSettings.maxTables<1||data.bookingSettings.maxTables>40)errors.push('Limit stolików');
  required(data.cafeSettings.address,'Adres kawiarni');
  if(!/^\+?[0-9 ()-]{7,40}$/.test(data.cafeSettings.phone))errors.push('Telefon kawiarni');
  if(!/^\S+@\S+\.\S+$/.test(data.cafeSettings.email))errors.push('E-mail kawiarni');
  if(data.cafeSettings.adminNotificationsEnabled && data.cafeSettings.adminNotificationEmail && !/^\S+@\S+\.\S+$/.test(data.cafeSettings.adminNotificationEmail))errors.push('E-mail powiadomień');
  data.media.menuImages.forEach((row,i)=>{if(!row.image)errors.push(`Zdjęcie menu ${i+1}`);required(row.alt,`Opis zdjęcia menu ${i+1}`);required(row.label,`Nazwa zdjęcia menu ${i+1}`);});
  data.seo.pages.forEach(row=>{required(row.title,`SEO ${row.path}: title`);required(row.description,`SEO ${row.path}: description`);});
  data.cats.forEach((row,i)=>{
    if(!row.name||!row.slug)errors.push(`Kot ${i+1}`);
    required(row.linkLabel,`Przycisk kota ${i+1}`); required(row.note,`Opis kota ${i+1}`); required(row.intro,`Historia kota ${i+1}`);
    catProfileTextFields.forEach(field=>required(row.profile[field],`Profil kota ${i+1}: ${field}`));
    catProfileListFields.forEach(field=>row.profile[field].forEach((item,index)=>required(item,`Profil kota ${i+1}: ${field} ${index+1}`)));
    row.profile.traits.forEach((item,index)=>{required(item.value,`Profil kota ${i+1}: cecha ${index+1}`);required(item.label,`Profil kota ${i+1}: nazwa cechy ${index+1}`);});
    row.profile.routine.forEach((item,index)=>{required(item.time,`Profil kota ${i+1}: pora ${index+1}`);required(item.text,`Profil kota ${i+1}: plan ${index+1}`);});
  });
  Object.entries(data.homepage).forEach(([section,value])=>{Object.entries(value).forEach(([field,item])=>{if(field==='rows')item.forEach((row,index)=>{required(row.title,`${section} ${index+1}`);required(row.text,`${section} ${index+1}`);});else if(field==='items')item.forEach((row,index)=>required(row,`${section} ${index+1}`));else required(item,`${section}: ${field}`);});});
  data.cats.forEach((row,i)=>{if(!['luna','mochi','pixel'].includes(row.slug))errors.push(`Adres profilu kota ${i+1}`);});
  if(new Set(data.cats.map(row=>row.slug)).size!==data.cats.length)errors.push('Powtarzające się adresy kotów');
  return [...new Set(errors)];
}
export const validAdminData = data => validationErrors(data).length===0;
