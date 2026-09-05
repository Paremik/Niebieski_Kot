import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, Clock3, Mail, Users, X } from 'lucide-react';

const initialForm = { date: '', time: '11:00', guests: '2', name: '', email: '', notes: '', consent: false };

function getToday() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

export default function BookingModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const firstField = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => firstField.current?.focus(), 50);
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (field) => (event) => setForm((current) => ({
    ...current,
    [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
  }));
  const close = () => { setSent(false); setForm(initialForm); onClose(); };
  const submit = (event) => { event.preventDefault(); setSent(true); };

  return <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && close()}>
    <section role="dialog" aria-modal="true" aria-labelledby="booking-title" className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[2.25rem] bg-[#f7f8f4] shadow-2xl">
      <button type="button" onClick={close} aria-label="Zamknij rezerwację" className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:text-sky-600"><X size={19}/></button>
      {sent ? <div className="px-7 py-16 text-center sm:px-12"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check size={30}/></span><p className="mt-6 text-sm font-extrabold uppercase tracking-[.18em] text-sky-600">Formularz demonstracyjny</p><h2 id="booking-title" className="mt-3 text-4xl font-black tracking-tight">Termin zapisany w podglądzie.</h2><p className="mx-auto mt-4 max-w-lg leading-relaxed text-slate-600">To koncepcyjna wersja strony, dlatego dane nie zostały nigdzie wysłane. Po uruchomieniu kawiarni podłączymy prawdziwe potwierdzenia e-mail.</p><button type="button" onClick={close} className="mt-8 rounded-full bg-slate-950 px-7 py-3.5 font-bold text-white transition hover:bg-sky-600">Wróć na stronę</button></div> : <>
        <header className="bg-sky-500 px-7 pb-8 pt-9 text-white sm:px-10"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-sky-100">Spokojne 90 minut</p><h2 id="booking-title" className="mt-2 text-4xl font-black tracking-tight">Zarezerwuj stolik.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-sky-50">Wybierz termin i zostaw kontakt. Na tym etapie formularz działa jako bezpieczna demonstracja.</p></header>
        <form onSubmit={submit} className="grid gap-5 p-7 sm:grid-cols-2 sm:p-10">
          <Field icon={CalendarDays} label="Data"><input ref={firstField} required type="date" min={getToday()} value={form.date} onChange={update('date')} className="field-input"/></Field>
          <Field icon={Clock3} label="Godzina"><select value={form.time} onChange={update('time')} className="field-input">{['10:00','11:00','12:30','14:00','15:30','17:00','18:30'].map((time) => <option key={time}>{time}</option>)}</select></Field>
          <Field icon={Users} label="Liczba gości"><select value={form.guests} onChange={update('guests')} className="field-input">{[1,2,3,4,5,6].map((count) => <option key={count} value={count}>{count} {count === 1 ? 'osoba' : count < 5 ? 'osoby' : 'osób'}</option>)}</select></Field>
          <Field label="Imię"><input required autoComplete="name" value={form.name} onChange={update('name')} placeholder="Jak mamy się zwracać?" className="field-input"/></Field>
          <div className="sm:col-span-2"><Field icon={Mail} label="E-mail"><input required type="email" autoComplete="email" value={form.email} onChange={update('email')} placeholder="twoj@email.pl" className="field-input"/></Field></div>
          <label className="sm:col-span-2"><span className="text-sm font-extrabold">Uwagi <span className="font-normal text-slate-400">(opcjonalnie)</span></span><textarea rows="3" maxLength="300" value={form.notes} onChange={update('notes')} placeholder="Dzieci, alergie lub inna ważna informacja" className="field-input mt-2 resize-none"/></label>
          <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 sm:col-span-2"><input required type="checkbox" checked={form.consent} onChange={update('consent')} className="mt-1 h-4 w-4 accent-sky-500"/><span>Rozumiem, że to formularz demonstracyjny i dane nie zostaną wysłane ani zapisane.</span></label>
          <button type="submit" className="rounded-full bg-slate-950 px-7 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-sky-600 sm:col-span-2">Pokaż potwierdzenie</button>
        </form>
      </>}
    </section>
  </div>;
}

function Field({ icon: Icon, label, children }) {
  return <label><span className="flex items-center gap-2 text-sm font-extrabold">{Icon && <Icon size={16} className="text-sky-500"/>}{label}</span>{React.cloneElement(children, { 'aria-label': label })}</label>;
}
