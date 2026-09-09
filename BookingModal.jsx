import { useLanguage } from './src/i18n/LanguageProvider.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, Clock3, Loader2, Mail, Users, X } from 'lucide-react';
import LanguageSelect from './LanguageSelect.jsx';
import useModalFocus from './src/hooks/useModalFocus.js';
import {getBookingTimes, warsawTime} from './src/lib/booking.js';
import { useSiteContent } from './src/content/SiteContentProvider.jsx';
const initialForm = {
  date: '',
  time: '',
  guests: '2',
  name: '',
  email: '',
  notes: '',
  consent: false
};
export default function BookingModal({
  open,
  onClose,
  event: bookingEvent = null
}) {
  const {
    tr
  } = useLanguage();
  const { data: siteContent } = useSiteContent();
  const bookingSettings = siteContent.bookingSettings || {};
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);
  useModalFocus(open, dialogRef, onClose, sent);
  useEffect(() => { if (open) {setForm(initialForm); setSent(false); setError(''); setSubmitting(false);} }, [open]);
  if (!open) return null;
  const update = field => event => setForm(current => ({
    ...current,
    [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    ...(field === 'date' ? {time:''} : {})
  }));
  const close = () => {
    setSent(false);
    setForm(initialForm);
    onClose();
  };
  const submit = async event => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.consent || !getBookingTimes(form.date, new Date(), bookingEvent?.index, bookingSettings).includes(form.time)) {setError('invalid'); return;}
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventIndex: bookingEvent?.index ?? null, eventTitle: bookingEvent?.title || '' })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error === 'SLOT_FULL' ? 'full' : 'failed');
        return;
      }
      setSent(true);
    } catch {
      setError('failed');
    } finally {
      setSubmitting(false);
    }
  };
  const times = getBookingTimes(form.date, new Date(), bookingEvent?.index, bookingSettings);
  return <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={event => event.target === event.currentTarget && close()}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[2.25rem] bg-[#f7f8f4] shadow-2xl">
      <div className="absolute left-5 top-4"><LanguageSelect /></div>
      <button type="button" onClick={close} aria-label={tr("Zamknij rezerwację")} className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:text-sky-600"><X size={19} /></button>
      {sent ? <div className="px-7 pb-12 pt-24 text-center sm:px-12"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><Check size={30} /></span><p className="mt-6 text-sm font-extrabold uppercase tracking-[.18em] text-sky-600">{tr("Rezerwacja wysłana")}</p><h2 id="booking-title" tabIndex={-1} className="mt-3 text-4xl font-black tracking-tight">{tr("Dziękujemy za zgłoszenie.")}</h2><p className="mx-auto mt-4 max-w-lg leading-relaxed text-slate-600">{tr("Zapisaliśmy Twoją prośbę o stolik. Obsługa potwierdzi termin po sprawdzeniu dostępności.")}</p><button type="button" onClick={close} className="mt-8 rounded-full bg-slate-950 px-7 py-3.5 font-bold text-white transition hover:bg-sky-600">{tr("Wróć na stronę")}</button></div> : <>
        <header className="bg-sky-500 px-7 pb-8 pt-20 text-white sm:px-10"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-sky-100">{tr("Spokojne 90 minut")}</p><h2 id="booking-title" tabIndex={-1} className="mt-2 text-4xl font-black tracking-tight">{tr("Zarezerwuj stolik.")}</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-sky-50">{tr("Wybierz termin i zostaw kontakt. Potwierdzenie przyjdzie po sprawdzeniu dostępności.")}</p></header>
        <form onSubmit={submit} className="grid gap-5 p-7 sm:grid-cols-2 sm:p-10">
          {bookingEvent && <p className="rounded-xl bg-sky-50 p-3 font-bold sm:col-span-2">{tr(bookingEvent.title)} · {tr(bookingEvent.tag)} · {tr(bookingEvent.meta)}</p>}
          {error && <p role="alert" className="text-sm text-rose-700 sm:col-span-2">{tr(error === 'full' ? 'Ten termin jest już zajęty. Wybierz inną godzinę.' : error === 'failed' ? 'Nie udało się wysłać rezerwacji. Spróbuj ponownie.' : 'Wybierz dostępny termin w przyszłości. W poniedziałki jesteśmy zamknięci.')}</p>}
          <Field icon={CalendarDays} label={tr("Data")}><input required type="date" min={warsawTime().date} value={form.date} onChange={update('date')} className="field-input" /></Field>
          <Field icon={Clock3} label={tr("Godzina")}><select required value={form.time} onChange={update('time')} className="field-input"><option value="">{tr(!form.date ? 'Wybierz datę' : times.length ? 'Wybierz godzinę' : 'Brak terminów w tym dniu')}</option>{times.map(time => <option key={time} value={time}>{time}</option>)}</select></Field>
          <Field icon={Users} label={tr("Liczba gości")}><select value={form.guests} onChange={update('guests')} className="field-input">{[1, 2, 3, 4, 5, 6].map(count => <option key={count} value={count}>{tr('Goście: {count}', {count})}</option>)}</select></Field>
          <Field label={tr("Imię")}><input required maxLength={100} autoComplete="name" value={form.name} onChange={update('name')} placeholder={tr("Jak mamy się zwracać?")} className="field-input" /></Field>
          <div className="sm:col-span-2"><Field icon={Mail} label={tr("E-mail")}><input required maxLength={254} type="email" autoComplete="email" value={form.email} onChange={update('email')} placeholder={tr("twoj@email.pl")} className="field-input" /></Field></div>
          <label className="sm:col-span-2"><span className="text-sm font-extrabold">{tr("Uwagi")} <span className="font-normal text-slate-400">{tr("(opcjonalnie)")}</span></span><textarea rows="3" maxLength="300" value={form.notes} onChange={update('notes')} placeholder={tr("Dzieci, alergie lub inna ważna informacja")} className="field-input mt-2 resize-none" /></label>
          <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 sm:col-span-2"><input required type="checkbox" checked={form.consent} onChange={update('consent')} className="mt-1 h-4 w-4 accent-sky-500" /><span>{tr("Zgadzam się na kontakt w sprawie tej rezerwacji.")}</span></label>
          <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-sky-600 disabled:opacity-50 sm:col-span-2">{submitting && <Loader2 className="animate-spin" size={17} />}{tr("Wyślij rezerwację")}</button>
        </form>
      </>}
    </section>
  </div>;
}
function Field({
  icon: Icon,
  label,
  children
}) {
  return <label><span className="flex items-center gap-2 text-sm font-extrabold">{Icon && <Icon size={16} className="text-sky-500" />}{label}</span>{React.cloneElement(children, {
      'aria-label': label
    })}</label>;
}
