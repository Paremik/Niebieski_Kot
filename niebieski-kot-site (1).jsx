import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MapPin, Clock, PawPrint } from 'lucide-react';

const COLORS = {
  bg: '#EAF6FF',
  navy: '#142652',
  sky: '#63C9FF',
  grey: '#B2BCC2',
  gold: '#CFBD5B',
  white: '#FFFFFF',
};

const CAT_FACTS = `Jesteś asystentem kociej kawiarni "Niebieski Kot" w Opolu (ul. Marii Rodziewiczówny 13A).
Fakty, którymi dysponujesz:
- Godziny otwarcia: codziennie 12:00–19:00.
- Koncept: kawiarnia z rezydentnymi kotami, kawa/herbata/desery, współpraca z lokalnym schroniskiem dla zwierząt.
- Wstęp do strefy kotów: prawdopodobnie osobna opłata za czas, dokładna cena do potwierdzenia — jeśli ktoś pyta, powiedz szczerze że dokładny cennik potwierdzi obsługa na miejscu.
- Zasady (typowe dla kocich kawiarni, wersja robocza do potwierdzenia): nie budzimy śpiących kotów, nie bierzemy kotów na ręce, własne jedzenie zostaje za drzwiami, zdjęcia bez lampy błyskowej.
- Dzieci: mile widziane, dokładny limit wieku do potwierdzenia.
- Kontakt/rezerwacja: przez Facebook "Kocia Kawiarnia Niebieski Kot Opole" lub na miejscu.
Odpowiadaj krótko i ciepło, w języku w którym pisze użytkownik. Jeśli nie znasz dokładnego szczegółu (np. ceny), powiedz szczerze że warto dopytać na miejscu — nigdy nie zmyślaj konkretów.`;

export default function CafeSite() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Miau! Zapytaj mnie o godziny, koty albo zasady odwiedzin 🐾' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const isOpenNow = () => {
    const h = new Date().getHours();
    return h >= 12 && h < 19;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: CAT_FACTS,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const text = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n');
      setMessages((prev) => [...prev, { role: 'assistant', content: text || 'Przepraszam, spróbuj jeszcze raz.' }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Coś poszło nie tak. Spróbuj jeszcze raz za chwilę.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const rules = [
    'Nie budzimy śpiących kotów',
    'Nie bierzemy kotów na ręce — to one wybierają kontakt',
    'Zdjęcia bez lampy błyskowej',
    'Własne jedzenie zostaje za drzwiami',
  ];

  const cats = [1, 2, 3, 4, 5];
  const catColor = (n) => [COLORS.sky, COLORS.sky, COLORS.gold, COLORS.sky, COLORS.navy][(n - 1) % 5];

  return (
    <div style={{ backgroundColor: COLORS.bg, fontFamily: "'Inter', sans-serif", color: COLORS.navy }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
        .display-font { font-family: 'Fraunces', serif; }
        ::selection { background: ${COLORS.gold}; color: ${COLORS.navy}; }
        .focus-ring:focus-visible { outline: 2px solid ${COLORS.navy}; outline-offset: 3px; }
      `}</style>

      <nav className="sticky top-0 z-40 border-b" style={{ backgroundColor: COLORS.sky, borderColor: COLORS.grey }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="display-font text-xl font-semibold" style={{ color: COLORS.navy }}>Niebieski Kot</span>
          <div className="hidden sm:flex gap-6 text-sm">
            <a href="#about" className="focus-ring" style={{ color: COLORS.navy }}>O nas</a>
            <a href="#cats" className="focus-ring" style={{ color: COLORS.navy }}>Koty</a>
            <a href="#rules" className="focus-ring" style={{ color: COLORS.navy }}>Zasady</a>
            <a href="#visit" className="focus-ring" style={{ color: COLORS.navy }}>Odwiedziny</a>
          </div>
        </div>
      </nav>

      <header style={{ backgroundColor: COLORS.sky }}>
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-6"
            style={{ backgroundColor: isOpenNow() ? COLORS.gold : COLORS.grey, color: COLORS.navy }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isOpenNow() ? '#4A7A4A' : '#7A7568' }} />
            {isOpenNow() ? 'Otwarte teraz' : 'Zamknięte teraz'} · 12:00–19:00
          </span>
          <h1 className="display-font text-5xl leading-tight font-semibold mb-5" style={{ color: COLORS.navy }}>
            Wpadnij na kawę.<br />Zostań na koty.
          </h1>
          <p className="text-lg mb-8">
            Kocia kawiarnia w Opolu — kawa, herbata i domowe ciasta w towarzystwie rezydentnych kotów, we współpracy z lokalnym schroniskiem.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="focus-ring px-6 py-3 rounded-full font-medium text-sm transition-transform hover:scale-105"
              style={{ backgroundColor: COLORS.navy, color: COLORS.sky }}
            >
              Zapytaj bota o szczegóły
            </button>
            <a
              href="#rules"
              className="focus-ring px-6 py-3 rounded-full font-medium text-sm border transition-colors"
              style={{ borderColor: COLORS.navy, color: COLORS.navy }}
            >
              Zasady odwiedzin
            </a>
          </div>
        </div>
        <div
          className="aspect-square rounded-3xl flex items-center justify-center text-6xl font-semibold display-font"
          style={{ backgroundColor: COLORS.navy, color: COLORS.sky }}
        >
          1
        </div>
      </div>
      </header>

      <Divider color={COLORS.grey} />

      <section id="about" className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div
          className="aspect-video rounded-3xl flex items-center justify-center text-5xl font-semibold display-font order-2 md:order-1"
          style={{ backgroundColor: COLORS.sky, color: COLORS.navy }}
        >
          2
        </div>
        <div className="order-1 md:order-2">
          <h2 className="display-font text-3xl font-semibold mb-4" style={{ color: COLORS.navy }}>Nie tylko kawiarnia</h2>
          <p className="mb-4">
            Nasze koty mieszkają tu na stałe — część z nich trafiła do nas we współpracy z lokalnym schroniskiem, szukając cierpliwości i drugiej szansy. Odwiedzając nas, wspierasz ich dalej — niezależnie od tego, czy zabierzesz kota do domu, czy po prostu wypijesz kawę w dobrym towarzystwie.
          </p>
          <p style={{ color: COLORS.grey }}>Dokładne liczby o adopcjach — do uzupełnienia z właścicielką.</p>
        </div>
      </section>

      <Divider color={COLORS.grey} />

      <section id="cats" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="display-font text-3xl font-semibold mb-2" style={{ color: COLORS.navy }}>Poznaj nasze koty</h2>
        <p className="mb-10" style={{ color: COLORS.grey }}>Imiona i charaktery — pierwsza rzecz do uzupełnienia zdjęciami.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {cats.map((n) => (
            <div key={n} className="rounded-2xl overflow-hidden">
              <div
                className="aspect-square flex items-center justify-center text-3xl font-semibold display-font transition-transform hover:-translate-y-1 rounded-2xl"
                style={{ backgroundColor: catColor(n), color: catColor(n) === COLORS.navy ? COLORS.white : COLORS.navy }}
              >
                {n}
              </div>
              <div className="pt-3 text-sm font-medium">Kot {n}</div>
              <div className="text-xs" style={{ color: COLORS.grey }}>imię i charakter — wkrótce</div>
            </div>
          ))}
        </div>
      </section>

      <Divider color={COLORS.grey} />

      <section id="rules" className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="display-font text-3xl font-semibold mb-4" style={{ color: COLORS.navy }}>Zanim wejdziesz</h2>
          <p style={{ color: COLORS.grey }}>Wersja robocza — do potwierdzenia z właścicielką przed publikacją.</p>
        </div>
        <ul className="space-y-3">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.gold }} />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <Divider color={COLORS.grey} />

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="display-font text-3xl font-semibold mb-8" style={{ color: COLORS.navy }}>Menu</h2>
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-3 max-w-2xl">
          {[
            ['Kawa', 'od X zł'],
            ['Herbata', 'od X zł'],
            ['Ciasto domowe', 'od X zł'],
            ['Wstęp do strefy kotów', 'do potwierdzenia'],
          ].map(([name, price], i) => (
            <div key={i} className="flex justify-between border-b pb-2" style={{ borderColor: COLORS.grey }}>
              <span>{name}</span>
              <span className="font-medium" style={{ color: COLORS.navy }}>{price}</span>
            </div>
          ))}
        </div>
      </section>

      <Divider color={COLORS.grey} />

      <section id="visit" className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="display-font text-3xl font-semibold mb-6" style={{ color: COLORS.navy }}>Odwiedziny</h2>
          <div className="flex items-start gap-3 mb-4">
            <MapPin size={20} style={{ color: COLORS.navy }} className="mt-0.5 flex-shrink-0" />
            <span>ul. Marii Rodziewiczówny 13A, Opole</span>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={20} style={{ color: COLORS.navy }} className="mt-0.5 flex-shrink-0" />
            <span>Codziennie 12:00–19:00</span>
          </div>
        </div>
        <div
          className="aspect-video rounded-3xl flex items-center justify-center text-5xl font-semibold display-font"
          style={{ backgroundColor: COLORS.navy, color: COLORS.sky }}
        >
          3
        </div>
      </section>

      <footer className="border-t py-10 text-center text-sm" style={{ borderColor: COLORS.grey, color: COLORS.grey }}>
        Niebieski Kot · Opole · Facebook: Kocia Kawiarnia Niebieski Kot Opole
      </footer>

      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div
            className="mb-3 w-80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: '28rem', maxWidth: 'calc(100vw - 3rem)', backgroundColor: COLORS.bg, border: `1px solid ${COLORS.grey}` }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: COLORS.sky }}>
              <span className="font-medium text-sm" style={{ color: COLORS.navy }}>Zapytaj o Niebieskiego Kota</span>
              <button onClick={() => setIsOpen(false)} className="focus-ring" aria-label="Zamknij czat">
                <X size={18} color={COLORS.navy} />
              </button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-xl text-sm"
                    style={{ backgroundColor: m.role === 'user' ? COLORS.gold : COLORS.white, color: COLORS.navy }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: COLORS.white, color: COLORS.grey }}>piszę...</div>
                </div>
              )}
            </div>
            <div className="p-3 flex gap-2 border-t" style={{ borderColor: COLORS.grey }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Napisz wiadomość..."
                className="focus-ring flex-1 px-3 py-2 rounded-full text-sm border min-w-0"
                style={{ borderColor: COLORS.grey }}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="focus-ring w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLORS.navy }}
                aria-label="Wyślij"
              >
                <Send size={16} color={COLORS.white} />
              </button>
            </div>
          </div>
        )}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="focus-ring w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
            style={{ backgroundColor: COLORS.sky }}
            aria-label="Otwórz czat"
          >
            <MessageCircle size={24} color={COLORS.navy} />
          </button>
        )}
      </div>
    </div>
  );
}

function Divider({ color }) {
  return (
    <div className="flex justify-center items-center gap-6 py-2" style={{ opacity: 0.5 }}>
      <PawPrint size={14} color={color} style={{ transform: 'rotate(-15deg)' }} />
      <PawPrint size={10} color={color} style={{ transform: 'rotate(10deg)' }} />
      <PawPrint size={16} color={color} style={{ transform: 'rotate(-8deg)' }} />
      <PawPrint size={10} color={color} style={{ transform: 'rotate(15deg)' }} />
      <PawPrint size={14} color={color} style={{ transform: 'rotate(-5deg)' }} />
    </div>
  );
}
