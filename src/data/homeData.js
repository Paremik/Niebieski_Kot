import { Cat, Coffee, Heart, PawPrint } from 'lucide-react';

export const cats = [
  { name: 'Luna', linkLabel: 'Poznaj Lunę', note: '4 lata · spokojna obserwatorka', story: 'Trafiła do nas po przeprowadzce opiekunów. Najchętniej siedzi przy oknie i sama wybiera moment na głaskanie.', image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=85&w=900&auto=format&fit=crop', slug: 'luna' },
  { name: 'Mochi', linkLabel: 'Poznaj Mochiego', note: '6 lat · mistrz drzemek', story: 'Łagodny kocur znaleziony na działkach. Kocha miękkie koce, spokojne rozmowy i ludzi z książką na kolanach.', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=85&w=900&auto=format&fit=crop', slug: 'mochi' },
  { name: 'Pixel', linkLabel: 'Poznaj Pixela', note: '2 lata · pierwszy do zabawy', story: 'Najmłodszy w ekipie i kandydat do adopcji. Wędkę wypatrzy z drugiego końca sali, a potem zasypia pod stolikiem.', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=85&w=900&auto=format&fit=crop', slug: 'pixel' },
];

export const rules = [
  'Przed wejściem do strefy kotów dezynfekujemy ręce.',
  'Pozwalamy kotom decydować o kontakcie — nie budzimy ich i nie bierzemy na ręce.',
  'Zdjęcia robimy bez lampy błyskowej, z szacunkiem dla kociego spokoju.',
  'Dzieci zapraszamy pod stałą opieką dorosłych; szczegóły potwierdzi obsługa.',
  'Własne jedzenie oraz smakołyki dla kotów zostawiamy poza lokalem.',
];

export const faqItems = [
  { question: 'Czy można przyjść z dziećmi?', answer: 'Tak. Zapraszamy dzieci od 8 lat, zawsze pod opieką dorosłego. Prosimy, aby dzieci nie biegały i pozwalały kotom samodzielnie decydować o kontakcie.' },
  { question: 'Mam alergię na koty — czy mogę odwiedzić kawiarnię?', answer: 'Wizyta wiąże się z obecnością sierści i alergenów, dlatego nie możemy zagwarantować bezpiecznych warunków dla osób z alergią. Jeśli objawy są łagodne, przed rezerwacją skonsultuj wizytę z lekarzem i poinformuj obsługę.' },
  { question: 'Czy można przynieść własne jedzenie?', answer: 'Nie. Ze względów higienicznych i bezpieczeństwa kotów własne jedzenie oraz napoje zostawiamy poza lokalem. Na miejscu czeka menu kawiarni z opcjami wegetariańskimi.' },
  { question: 'Czy można przyjść z własnym zwierzęciem?', answer: 'Nie. Nawet spokojny pies lub kot może stresować naszych rezydentów. Wyjątek stanowią certyfikowane psy asystujące — prosimy o wcześniejszy kontakt.' },
  { question: 'Czy trzeba rezerwować miejsce?', answer: 'W tygodniu zwykle wystarczy przyjść, ale rezerwacja daje pewność miejsca. W weekendy i podczas wydarzeń polecamy zarezerwować stolik z wyprzedzeniem.' },
];

export const events = [
  { icon: Heart, tag: 'Każda niedziela', title: 'Joga z kotami', text: 'Łagodna praktyka dla początkujących, spokojna muzyka i koty spacerujące po sali.', meta: '10:00 · 60 minut · 45 zł' },
  { icon: Coffee, tag: 'Każdy piątek', title: 'Wieczór gier planszowych', text: 'Małe grupy, przytulne gry i gorący napój z naszej karty.', meta: '18:00 · 90 minut · 25 zł' },
  { icon: Cat, tag: 'Dwie soboty w miesiącu', title: 'Czytania i warsztaty', text: 'Opowieści o zwierzętach, twórcze zajęcia i spokojny format dla całej rodziny.', meta: '12:00 · 75 minut · od 20 zł' },
  { icon: PawPrint, tag: 'Pierwsza niedziela miesiąca', title: 'Dzień adopcji', text: 'Poznaj nasze koty, porozmawiaj z wolontariuszami i przygotuj się do odpowiedzialnej adopcji.', meta: 'Wstęp wolny · obowiązują zapisy' },
];

export const menuSlides = [
  { image: '/images/menu-latte.webp', alt: 'Kocie latte z maślanym ciasteczkiem', label: 'Kocie latte' },
  { image: '/images/menu-toast.webp', alt: 'Grzanka z kozim serem i pieczonym burakiem', label: 'Grzanka z kozim serem' },
  { image: '/images/menu-cheesecake.webp', alt: 'Sernik baskijski z owocami i matchą', label: 'Sernik baskijski' },
];

export const catOfDay = { name: 'Pixel', slug: 'pixel', mood: 'Gotowy na spotkanie', activity: 'Dziś poluje na zabawkową myszkę i szuka osoby, która podaruje mu chwilę spokojnej uwagi.', image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=88&w=1200&auto=format&fit=crop', pl: { label: 'Kot dnia', eyebrow: 'Poznaj go spokojnie', mood: 'Gotowy na spotkanie', activity: 'Dziś poluje na zabawkową myszkę i szuka osoby, która podaruje mu chwilę spokojnej uwagi.', button: 'Otwórz profil' }, ru: { label: 'Кот дня', eyebrow: 'Познакомься с ним спокойно', mood: 'Готов к встрече', activity: 'Сегодня охотится на игрушечную мышку и ищет человека, который подарит ему немного спокойного внимания.', button: 'Открыть профиль' }, en: { label: 'Cat of the day', eyebrow: 'Meet him at his own pace', mood: 'Ready to meet', activity: 'Today he is hunting a toy mouse and looking for someone to give him a little calm attention.', button: 'Open profile' } };
