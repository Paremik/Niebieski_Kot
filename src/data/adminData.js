export const defaultData = {
  schedule: [{
    day: 'Poniedziałek',
    hours: 'zamknięte'
  }, {
    day: 'Wtorek–Piątek',
    hours: '11:00–20:00'
  }, {
    day: 'Sobota–Niedziela',
    hours: '10:00–20:00'
  }],
  prices: [{
    name: 'Espresso',
    price: '10 zł'
  }, {
    name: 'Kocie latte',
    price: '18 zł'
  }, {
    name: 'Sernik baskijski',
    price: '19 zł'
  }, {
    name: 'Grzanka z kozim serem',
    price: '27 zł'
  }],
  events: [{
    title: 'Joga z kotami',
    date: 'Każda niedziela · 10:00',
    places: '8',
    status: 'Zapisy otwarte'
  }, {
    title: 'Wieczór gier planszowych',
    date: 'Każdy piątek · 18:00',
    places: '12',
    status: 'Zapisy otwarte'
  }, {
    title: 'Dzień adopcji',
    date: 'Pierwsza niedziela miesiąca',
    places: '20',
    status: 'Planowane'
  }],
  availability: {
    status: 'Spokojnie',
    note: 'Dużo wolnych miejsc · aktualizacja ręczna'
  },
  cats: [{
    name: 'Luna',
    status: 'Stała gospodyni',
    note: '4 lata · spokojna obserwatorka'
  }, {
    name: 'Mochi',
    status: 'Stały gospodarz',
    note: '6 lat · mistrz drzemek'
  }, {
    name: 'Pixel',
    status: 'Szuka domu',
    note: '2 lata · pierwszy do zabawy'
  }]
};

export const storageKey = 'niebieski-kot-admin-data';
const sections = ['schedule','prices','events','cats'];
const schema = {schedule:['day','hours'], prices:['name','price'], events:['title','date','places','status'], cats:['name','status','note']};
export function normalizeAdminData(saved) {
 const result = {};
 for (const section of sections) {
  const rows = Array.isArray(saved?.[section]) ? saved[section] : defaultData[section];
  result[section] = rows.slice(0,100).filter(row => row && typeof row === 'object' && schema[section].every(key=>typeof row[key] === 'string')).map((row,index)=>({id:section+'-'+index,...Object.fromEntries(schema[section].map(key=>[key,row[key].slice(0,500)]))}));
  if(section==='events') for(const row of result.events) {
   row.status = {'Записи открыты':'Zapisy otwarte','Планируется':'Planowane','Завершено':'Zakończone'}[row.status] || row.status;
   if(!['Zapisy otwarte','Planowane','Zakończone'].includes(row.status))row.status='Planowane';
  }
 }
 const a = saved?.availability;
 result.availability = {status: typeof a?.status==='string'?a.status:defaultData.availability.status, note:typeof a?.note==='string'?a.note.slice(0,500):defaultData.availability.note};
 result.availability.status = {'Спокойно':'Spokojnie','Умеренно занято':'Umiarkowanie zajęte','Почти нет мест':'Prawie pełno','Полностью занято':'Brak miejsc'}[result.availability.status] || result.availability.status;
 if(!['Spokojnie','Umiarkowanie zajęte','Prawie pełno','Brak miejsc'].includes(result.availability.status))result.availability.status='Spokojnie';
 return result;
}
export function loadAdminData() {
 try { return normalizeAdminData(JSON.parse(window.localStorage.getItem(storageKey))); }
 catch { return normalizeAdminData(null); }
}
export function validAdminData(data) {
 const price = value => /^\d+(?:[.,]\d{1,2})?\s*(?:zł|PLN)?$/.test(value.trim());
 return sections.every(section=>data[section].every(row=>schema[section].every(key=>row[key].trim()))) &&
 data.prices.every(row=>price(row.price)) &&
 data.events.every(row=>/^\d+$/.test(row.places) && Number(row.places)<=1000) &&
 Boolean(data.availability.note.trim());
}
