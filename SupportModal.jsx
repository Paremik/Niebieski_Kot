import React, { useEffect, useRef, useState } from 'react';
import { Check, Coffee, HeartHandshake, X } from 'lucide-react';

const options = [
  { id: 'coffee', title: 'Wirtualna kawa', amount: '15 zł', text: 'Drobny gest na codzienną opiekę i smakołyki.' },
  { id: 'care', title: 'Miska na dziś', amount: '35 zł', text: 'Pomaga pokryć karmę i żwirek dla rezydentów.' },
  { id: 'treatment', title: 'Wsparcie leczenia', amount: '100 zł', text: 'Dokłada się do badań, leków i wizyt u weterynarza.' },
];

export default function SupportModal({ open, onClose }) {
  const [selected, setSelected] = useState('coffee');
  const [sent, setSent] = useState(false);
  const closeButton = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeButton.current?.focus(), 50);
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  const chosen = options.find((option) => option.id === selected);
  const close = () => { setSent(false); onClose(); };

  return <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && close()}>
    <section role="dialog" aria-modal="true" aria-labelledby="support-title" className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[2.25rem] bg-[#f7f8f4] shadow-2xl">
      <button ref={closeButton} type="button" onClick={close} aria-label="Zamknij wsparcie" className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:text-sky-600"><X size={19}/></button>
      {sent ? <div className="px-7 py-16 text-center sm:px-12"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check size={30}/></span><p className="mt-6 text-sm font-extrabold uppercase tracking-[.18em] text-sky-600">Formularz demonstracyjny</p><h2 id="support-title" className="mt-3 text-4xl font-black tracking-tight">Dziękujemy za chęć wsparcia.</h2><p className="mx-auto mt-4 max-w-lg leading-relaxed text-slate-600">Wybrano: {chosen.title} · {chosen.amount}. Prawdziwe płatności i dane fundacji podłączymy po potwierdzeniu partnera.</p><button type="button" onClick={close} className="mt-8 rounded-full bg-slate-950 px-7 py-3.5 font-bold text-white transition hover:bg-sky-600">Wróć na stronę</button></div> : <>
        <header className="bg-sky-500 px-7 pb-8 pt-9 text-white sm:px-10"><p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[.18em] text-sky-100"><HeartHandshake size={17}/> Dla naszych kotów</p><h2 id="support-title" className="mt-2 text-4xl font-black tracking-tight">Wybierz formę wsparcia.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-sky-50">Każdy gest pomaga zapewnić kotom opiekę, spokój i bezpieczne miejsce.</p></header>
        <div className="space-y-4 p-7 sm:p-10"><div className="grid gap-3 sm:grid-cols-3">{options.map((option) => <button key={option.id} type="button" onClick={() => setSelected(option.id)} className={`rounded-2xl border p-4 text-left transition ${selected === option.id ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200' : 'border-slate-200 bg-white hover:border-sky-300'}`}><span className="block text-sm font-black">{option.title}</span><strong className="mt-2 block text-2xl text-sky-600">{option.amount}</strong><span className="mt-2 block text-xs leading-relaxed text-slate-500">{option.text}</span></button>)}</div><p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"><strong>Wersja koncepcyjna:</strong> przycisk nie pobiera płatności. Po uruchomieniu prawdziwej fundacji dodamy bezpieczny operator i oficjalne dane odbiorcy.</p><button type="button" onClick={() => setSent(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-sky-600"><Coffee size={18}/> Wybieram {chosen.amount}</button></div>
      </>}
    </section>
  </div>;
}
