import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, PawPrint, ShoppingBag, Calendar, ShieldCheck } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Miau! Zapytaj mnie o godziny, nasze koty, zasady z dziećmi lub menu 🐾' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Security: Zabezpieczenie antyspamowe
  const [lastMessageTime, setLastMessageTime] = useState(0);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const isOpenNow = () => {
    const h = new Date().getHours();
    return h >= 12 && h < 19;
  };

  const sendMessage = async () => {
    const sanitizedInput = input.trim().slice(0, 200); 
    if (!sanitizedInput || isLoading) return;
    
    const now = Date.now();
    if (now - lastMessageTime < 1500) {
        alert("Poczekaj chwilę przed wysłaniem kolejnej wiadomości.");
        return;
    }
    
    setLastMessageTime(now);
    setMessages(prev => [...prev, { role: 'user', content: sanitizedInput }]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let botReply = "Rozumiem! Żeby podać dokładne informacje, muszę jeszcze zsynchronizować dane z menedżerem. O co jeszcze chcesz zapytać?";
      const lowerInput = sanitizedInput.toLowerCase();
      
      if (lowerInput.includes('dziec')) {
        botReply = "Dzieci są u nas mile widziane! Mamy jednak ograniczenia wiekowe dla bezpieczeństwa kotów. Wymagamy też, by dzieci zawsze były pod opieką dorosłych.";
      } else if (lowerInput.includes('godzin')) {
        botReply = "Jesteśmy otwarci codziennie od 12:00 do 19:00. Na weekendy zazwyczaj mamy żywą kolejkę, więc warto przyjść wcześniej!";
      } else if (lowerInput.includes('cen')) {
        botReply = "Mamy pyszną kawę, herbatę i domowe ciasta. Wstęp do strefy kotów jest płatny. Coś konkretnego Cię interesuje?";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
      setIsLoading(false);
    }, 1200);
  };

  const rules = [
    'Wstęp dla dzieci od [X] lat (do potwierdzenia)',
    'Dezynfekcja rąk przed wejściem (wymóg Sanepid)',
    'Nie budzimy śpiących kotów i nie bierzemy ich na ręce',
    'Zdjęcia wyłącznie bez lampy błyskowej',
    'Własne jedzenie oraz kocie smakołyki zostają za drzwiami',
  ];

  return (
    // Додано дуже ніжний блакитний градієнт на фон (from-sky-50)
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white font-sans text-slate-900 selection:bg-sky-200 selection:text-slate-900 pb-20">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-sky-100 shadow-sm transition-all">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
            Niebieski Kot <span className="text-sky-500">.</span>
          </span>
          <div className="hidden sm:flex gap-6 text-sm font-semibold text-slate-600">
            <a href="#about" className="hover:text-sky-500 transition-colors">O nas</a>
            <a href="#cats" className="hover:text-sky-500 transition-colors">Nasze Koty</a>
            <a href="#rules" className="hover:text-sky-500 transition-colors">Zasady</a>
            <a href="#offer" className="hover:text-sky-500 transition-colors">Sklep & Eventy</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm border ${isOpenNow() ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
            <span className={`w-2 h-2 rounded-full ${isOpenNow() ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'}`} />
            {isOpenNow() ? 'Otwarte teraz' : 'Zamknięte'} · 12:00–19:00
          </span>
          
          <h1 className="text-5xl font-black leading-[1.1] mb-5 text-slate-900">
            Kawa. Relaks. <br />
            {/* Блакитний градієнт тексту */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Mruczenie.</span>
          </h1>
          <p className="text-lg mb-8 font-light text-slate-600">
            Kocia kawiarnia w Opolu. Odpocznij w towarzystwie naszych rezydentów i wesprzyj adopcje ze schroniska.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-3 rounded-full font-bold text-white bg-slate-900 hover:bg-sky-600 shadow-xl shadow-sky-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Zapytaj bota o szczegóły
            </button>
          </div>
        </div>
        
        <div className="relative aspect-square rounded-[2rem] bg-sky-100 overflow-hidden shadow-2xl group border-4 border-white">
            <div className="absolute inset-0 bg-blue-900/10 z-10 transition-opacity group-hover:opacity-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1000&auto=format&fit=crop" 
              alt="Kocia kawiarnia" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        </div>
      </header>

      {/* Divider */}
      <div className="flex justify-center items-center gap-6 py-8 opacity-30">
        <PawPrint size={16} className="text-slate-400" style={{ transform: 'rotate(-15deg)' }} />
        <PawPrint size={12} className="text-sky-400" style={{ transform: 'rotate(10deg)' }} />
        <PawPrint size={20} className="text-slate-300" style={{ transform: 'rotate(-8deg)' }} />
        <PawPrint size={12} className="text-sky-400" style={{ transform: 'rotate(15deg)' }} />
        <PawPrint size={16} className="text-slate-400" style={{ transform: 'rotate(-5deg)' }} />
      </div>

      {/* Rules Section */}
      <section id="rules" className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 bg-white/60 backdrop-blur-sm rounded-[2rem] shadow-sm my-10 border border-sky-50">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-black mb-4 text-slate-900">Zasady naszego domu</h2>
          <p className="mb-6 font-medium text-sky-600 text-sm bg-sky-50 p-3 rounded-xl border border-sky-100">
            * Wersja demonstracyjna: zasady zostaną dostosowane do regulaminu.
          </p>
        </div>
        <ul className="space-y-4">
          {rules.map((r, i) => (
            <li key={i} className="flex gap-4 items-start bg-white p-4 rounded-xl border border-sky-50 hover:border-sky-300 transition-colors shadow-sm">
              <span className="mt-1 w-2 h-2 rounded-full bg-sky-400 flex-shrink-0 shadow-sm shadow-sky-200" />
              <span className="font-medium text-sm text-slate-700">{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Offer Section */}
      <section id="offer" className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[2rem] bg-slate-900 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <ShoppingBag className="mb-5 text-sky-400" size={32} />
            <h3 className="text-2xl font-bold mb-3">Koci Sklepik</h3>
            <p className="text-sm font-light opacity-80 mb-6 relative z-10">Wspieraj nas kupując autorski merch, kubki, torby i bony podarunkowe. (Moduł sklepu gotowy do wdrożenia)</p>
            <button className="text-sm font-bold text-sky-400 border-b border-sky-400 pb-0.5 hover:text-white hover:border-white transition-colors relative z-10">Zobacz ofertę</button>
          </div>
          
          <div className="p-8 rounded-[2rem] bg-white border border-sky-100 text-slate-900 shadow-sm hover:shadow-md hover:border-sky-200 transition-all">
            <Calendar className="mb-5 text-sky-500" size={32} />
            <h3 className="text-2xl font-bold mb-3">Wydarzenia</h3>
            <p className="text-sm font-light text-slate-500 mb-6">Wynajmij kawiarnię na zamknięte urodziny lub dołącz do warsztatów. (System rezerwacji w przygotowaniu)</p>
            <button className="text-sm font-bold border-b border-slate-900 pb-0.5 hover:text-sky-500 hover:border-sky-500 transition-colors">Zapytaj o termin</button>
          </div>
        </div>
      </section>

      {/* Chat Bot */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="mb-4 w-[350px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-sky-100 bg-white/95 backdrop-blur-xl h-[500px] transition-all">
            <div className="px-5 py-4 bg-sky-500 flex items-center justify-between text-white">
              <div>
                <span className="font-bold text-sm block">Niebieski Asystent</span>
                <span className="text-[10px] font-medium opacity-90 flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={10} /> Połączenie szyfrowane
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      m.role === 'user' 
                      ? 'bg-sky-500 text-white rounded-br-none' 
                      : 'bg-slate-50 text-slate-800 border border-sky-100 rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-2.5 rounded-2xl text-sm font-bold text-sky-400 bg-slate-50 border border-sky-50 rounded-bl-none animate-pulse">
                    Pisze...
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-white border-t border-sky-50 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                maxLength={200}
                placeholder="Zapytaj o menu, godziny..."
                className="flex-1 px-4 py-3 rounded-full text-sm bg-sky-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 border-transparent transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="w-11 h-11 rounded-full flex items-center justify-center bg-sky-500 text-white shadow-md shadow-sky-200 transition-transform hover:bg-sky-600 active:scale-95 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
        
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full shadow-xl shadow-sky-500/30 flex items-center justify-center bg-sky-500 text-white hover:bg-sky-600 transition-all hover:scale-110 active:scale-95"
          >
            <MessageCircle size={28} />
          </button>
        )}
      </div>
    </div>
  );
}
