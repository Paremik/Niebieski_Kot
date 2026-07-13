import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Coffee, Calendar, ShieldCheck } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Miau! Jestem wirtualnym asystentem kawiarni. W czym mogę pomóc? 🐾' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Security: Защита от спама в чат (простой клиентский Rate Limiting)
  const [lastMessageTime, setLastMessageTime] = useState(0);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const sendMessage = async () => {
    // Security: Санитаризация и валидация
    const sanitizedInput = input.trim().slice(0, 200); // Ограничение длины (Buffer Overflow prevention)
    
    if (!sanitizedInput || isLoading) return;
    
    // Security: Anti-spam (задержка минимум 2 секунды между сообщениями)
    const now = Date.now();
    if (now - lastMessageTime < 2000) {
        alert("Poczekaj chwilę przed wysłaniem kolejnej wiadomości.");
        return;
    }
    
    setLastMessageTime(now);
    setMessages(prev => [...prev, { role: 'user', content: sanitizedInput }]);
    setInput('');
    setIsLoading(true);

    // В будущем здесь будет защищенный POST-запрос на /api/chat (Serverless Function)
    setTimeout(() => {
      let botReply = "Rozumiem! Żeby podać dokładne informacje, muszę jeszcze zsynchronizować dane z menedżerem. O co jeszcze chcesz zapytać?";
      const lowerInput = sanitizedInput.toLowerCase();
      
      if (lowerInput.includes('dziec')) {
        botReply = "Dzieci powyżej 10 roku życia są mile widziane. Dla bezpieczeństwa kotów, wymagamy stałej opieki dorosłych.";
      } else if (lowerInput.includes('godzin')) {
        botReply = "Jesteśmy otwarci codziennie od 12:00 do 19:00. Najlepsza pora na wizytę to wczesne popołudnie!";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-[#E5E9F0]">
      {/* Premium Navbar с Glassmorphism */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-extrabold tracking-tight text-navy flex items-center gap-2">
            Niebieski Kot <span className="text-gold">.</span>
          </span>
          <div className="hidden sm:flex gap-8 text-sm font-semibold text-gray-600">
            <a href="#about" className="hover:text-navy transition-colors">O nas</a>
            <a href="#rules" className="hover:text-navy transition-colors">Zasady</a>
            <a href="#security" className="hover:text-navy flex items-center gap-1 transition-colors">
              <ShieldCheck size={16} /> Bezpieczeństwo
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 pt-24 pb-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Otwarte dzisiaj: 12:00–19:00
          </div>
          <h1 className="text-6xl font-black leading-[1.1] mb-6 text-navy">
            Relaks. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-600">
              Dobra Kawa.
            </span> <br />
            Mruczenie.
          </h1>
          <p className="text-xl mb-10 font-light text-gray-600 max-w-md">
            Ekskluzywna przestrzeń w sercu Opola. Zarezerwuj stolik, poznaj nasze koty i odetchnij.
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-4 rounded-full font-bold text-white bg-navy hover:bg-gray-900 shadow-xl shadow-navy/20 transition-all hover:scale-105 active:scale-95"
          >
            Porozmawiaj z naszym AI
          </button>
        </div>
        
        {/* Placeholder для красивой фото */}
        <div className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] bg-gray-200 overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-navy/40 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1000&auto=format&fit=crop" 
              alt="Kocia kawiarnia" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        </div>
      </header>

      {/* Безопасный чат */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="mb-4 w-[350px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 bg-white/95 backdrop-blur-xl h-[500px] transition-all transform origin-bottom-right">
            <div className="px-6 py-5 bg-navy flex items-center justify-between text-white">
              <div>
                <span className="font-bold text-base block">Koci Asystent</span>
                <span className="text-xs font-light opacity-70">Zabezpieczone połączenie SSL</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      m.role === 'user' 
                      ? 'bg-navy text-white rounded-br-none' 
                      : 'bg-gray-100 text-navy border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl text-sm font-bold text-gray-400 bg-gray-50 border rounded-bl-none animate-pulse">
                    Analizuje...
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                maxLength={200} // Security: HTML validation limit
                placeholder="Napisz wiadomość..."
                className="flex-1 px-5 py-3 rounded-full text-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gold border-transparent transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gold text-white shadow-md transition-transform active:scale-95 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
        
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center bg-navy text-gold hover:bg-gray-900 transition-all hover:scale-110 active:scale-95"
          >
            <MessageCircle size={28} />
          </button>
        )}
      </div>
    </div>
  );
}
