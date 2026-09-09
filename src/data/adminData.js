import { catProfiles } from './catProfiles.js';
import { translate } from '../i18n/translate.js';

export const contentLocales = ['pl', 'ru', 'en'];
export const localized = (pl, ru = pl, en = pl) => ({ pl, ru, en });
export const textFor = (value, language = 'pl') => typeof value === 'string' ? value : value?.[language] ?? value?.pl ?? '';
const defaultBookingSettings = { maxTables: 6 };
const clone = value => JSON.parse(JSON.stringify(value));
const trim = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const localText = (value, fallback, max = 500) => Object.fromEntries(contentLocales.map(locale => [locale, trim(value?.[locale] ?? (typeof value === 'string' ? value : fallback?.[locale]), max)]));
const stableId = (value, fallback) => trim(value || fallback, 80).replace(/[^a-z0-9-]/gi, '-').toLowerCase();

export const catProfileTextFields = ['imageAlt','badge','tagline','intro','summaryTitle','summary','age','birth','joined','origin','healthStatus','healthNote','statusNote','historyLabel','historyTitle','healthIntro','friendshipTitle','friendship','signal','likesIntro','boundariesIntro','routineTitle','routineIntro','placeLabel','placeTitle','placeText','sideTitle','sideText','seoDescription'];
export const catProfileListFields = ['story','health','likes','boundaries'];
const translatedText = value => Object.fromEntries(contentLocales.map(locale => [locale, translate(String(value ?? ''), locale)]));
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
    { id:'yoga', title:localized('Joga z kotami','Йога с котами','Yoga with cats'), date:localized('Każda niedziela · 10:00','Каждое воскресенье · 10:00','Every Sunday · 10:00'), places:'8', status:'open', enabled:true },
    { id:'games', title:localized('Wieczór gier planszowych','Вечер настольных игр','Board game evening'), date:localized('Każdy piątek · 18:00','Каждую пятницу · 18:00','Every Friday · 18:00'), places:'12', status:'open', enabled:true },
    { id:'adoption', title:localized('Dzień adopcji','День усыновления','Adoption day'), date:localized('Pierwsza niedziela miesiąca','Первое воскресенье месяца','First Sunday of the month'), places:'20', status:'planned', enabled:true }
  ],
  availability: { status:'calm', note:localized('Dużo wolnych miejsc · aktualizacja ręczna','Много свободных мест · обновлено вручную','Plenty of free tables · updated manually') },
  bookingSettings: defaultBookingSettings,
  cats: [
    { id:'luna', slug:'luna', name:'Luna', status:'resident', note:localized('4 lata · spokojna obserwatorka','4 года · спокойная наблюдательница','4 years · a calm observer'), intro:localized('Najchętniej siedzi przy oknie i sama wybiera moment na głaskanie.','Любит сидеть у окна и сама выбирает момент для ласки.','She loves sitting by the window and chooses when it is time for affection.'), profile:defaultCatProfile('luna'), enabled:true },
    { id:'mochi', slug:'mochi', name:'Mochi', status:'resident', note:localized('6 lat · mistrz drzemek','6 лет · мастер сна','6 years · master napper'), intro:localized('Kocha miękkie koce, spokojne rozmowy i ludzi z książką na kolanach.','Любит мягкие пледы, спокойные разговоры и людей с книгой на коленях.','He loves soft blankets, quiet conversation and people reading a book.'), profile:defaultCatProfile('mochi'), enabled:true },
    { id:'pixel', slug:'pixel', name:'Pixel', status:'adoption', note:localized('2 lata · pierwszy do zabawy','2 года · всегда первый в игре','2 years · always first to play'), intro:localized('Wędkę wypatrzy z drugiego końca sali, a potem zasypia pod stolikiem.','Удочку заметит с другого конца зала, а потом уснёт под столиком.','He spots a teaser toy across the room, then falls asleep under a table.'), profile:defaultCatProfile('pixel'), enabled:true }
  ],
  revision: 0,
  updatedAt: null
};

export function normalizeAdminData(input) {
  const source = input && typeof input === 'object' ? input : {};
  const result = clone(defaultData);
  result.schedule = (Array.isArray(source.schedule) ? source.schedule : defaultData.schedule).slice(0,14).map((row,i)=>({id:stableId(row?.id,`schedule-${i}`),day:localText(row?.day,defaultData.schedule[i]?.day),hours:localText(row?.hours,defaultData.schedule[i]?.hours)}));
  result.prices = (Array.isArray(source.prices) ? source.prices : defaultData.prices).slice(0,80).map((row,i)=>({id:stableId(row?.id,`menu-${i}`),group:['coffee','other','food','sweet'].includes(row?.group)?row.group:'coffee',name:localText(row?.name,defaultData.prices[i]?.name),price:trim(row?.price??defaultData.prices[i]?.price,30),enabled:row?.enabled!==false}));
  result.events = (Array.isArray(source.events) ? source.events : defaultData.events).slice(0,30).map((row,i)=>({id:stableId(row?.id,`event-${i}`),title:localText(row?.title,defaultData.events[i]?.title),date:localText(row?.date,defaultData.events[i]?.date),places:trim(row?.places??'0',4),status:['open','planned','closed'].includes(row?.status)?row.status:'planned',enabled:row?.enabled!==false}));
  const availability=source.availability??defaultData.availability;
  result.availability={status:['calm','busy','almost-full','full'].includes(availability?.status)?availability.status:'calm',note:localText(availability?.note,defaultData.availability.note)};
  const maxTables=Number(source.bookingSettings?.maxTables);
  result.bookingSettings={maxTables:Number.isInteger(maxTables)&&maxTables>=1&&maxTables<=40?maxTables:defaultBookingSettings.maxTables};
  result.cats=(Array.isArray(source.cats)?source.cats:defaultData.cats).slice(0,20).map((row,i)=>{const fallback=defaultData.cats.find(cat=>cat.slug===row?.slug)||defaultData.cats[i]||defaultData.cats[0];return {id:stableId(row?.id,`cat-${i}`),slug:stableId(row?.slug,fallback.slug??`cat-${i}`),name:trim(row?.name??fallback.name,80),status:['resident','adoption','reserved'].includes(row?.status)?row.status:'resident',note:localText(row?.note,fallback.note),intro:localText(row?.intro,fallback.intro),profile:normalizeCatProfile(row?.profile,fallback.profile),enabled:row?.enabled!==false};});
  result.revision=Number.isSafeInteger(source.revision)&&source.revision>=0?source.revision:0;
  result.updatedAt=typeof source.updatedAt==='string'?source.updatedAt:null;
  return result;
}

export function validationErrors(input) {
  const data=normalizeAdminData(input), errors=[];
  const required=(value,label)=>contentLocales.forEach(locale=>{if(!trim(value?.[locale]))errors.push(`${label} (${locale.toUpperCase()})`);});
  data.schedule.forEach((row,i)=>{required(row.day,`Dzień ${i+1}`);required(row.hours,`Godziny ${i+1}`);});
  data.prices.forEach((row,i)=>{required(row.name,`Menu ${i+1}`);if(!/^\d+(?:[.,]\d{1,2})?\s*(?:zł|PLN)?$/i.test(row.price))errors.push(`Cena ${i+1}`);});
  data.events.forEach((row,i)=>{required(row.title,`Wydarzenie ${i+1}`);required(row.date,`Data ${i+1}`);if(!/^\d{1,4}$/.test(row.places)||Number(row.places)>1000)errors.push(`Miejsca ${i+1}`);});
  required(data.availability.note,'Dostępność');
  if(!Number.isInteger(data.bookingSettings.maxTables)||data.bookingSettings.maxTables<1||data.bookingSettings.maxTables>40)errors.push('Limit stolików');
  data.cats.forEach((row,i)=>{
    if(!row.name||!row.slug)errors.push(`Kot ${i+1}`);
    required(row.note,`Opis kota ${i+1}`); required(row.intro,`Historia kota ${i+1}`);
    catProfileTextFields.forEach(field=>required(row.profile[field],`Profil kota ${i+1}: ${field}`));
    catProfileListFields.forEach(field=>row.profile[field].forEach((item,index)=>required(item,`Profil kota ${i+1}: ${field} ${index+1}`)));
    row.profile.traits.forEach((item,index)=>{required(item.value,`Profil kota ${i+1}: cecha ${index+1}`);required(item.label,`Profil kota ${i+1}: nazwa cechy ${index+1}`);});
    row.profile.routine.forEach((item,index)=>{required(item.time,`Profil kota ${i+1}: pora ${index+1}`);required(item.text,`Profil kota ${i+1}: plan ${index+1}`);});
  });
  data.cats.forEach((row,i)=>{if(!['luna','mochi','pixel'].includes(row.slug))errors.push(`Adres profilu kota ${i+1}`);});
  if(new Set(data.cats.map(row=>row.slug)).size!==data.cats.length)errors.push('Powtarzające się adresy kotów');
  return [...new Set(errors)];
}
export const validAdminData = data => validationErrors(data).length===0;
