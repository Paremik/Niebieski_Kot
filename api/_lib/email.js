const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const statusSubject = {
  received: 'Otrzymaliśmy Twoją rezerwację',
  new: 'Otrzymaliśmy Twoją rezerwację',
  confirmed: 'Rezerwacja została potwierdzona',
  cancelled: 'Rezerwacja została odwołana',
  completed: 'Dziękujemy za wizytę'
};

const statusLead = {
  received: 'Dziękujemy, Twoja prośba o rezerwację trafiła do obsługi kawiarni.',
  new: 'Twoja prośba o rezerwację jest w kolejce do sprawdzenia.',
  confirmed: 'Potwierdzamy rezerwację. Do zobaczenia w Niebieskim Kocie.',
  cancelled: 'Twoja rezerwacja została odwołana. W razie potrzeby wybierz inny termin.',
  completed: 'Dziękujemy za spokojną wizytę w Niebieskim Kocie.'
};

export async function sendBookingEmail(booking, status = 'received') {
  if (!process.env.RESEND_API_KEY) return { sent: false, reason: 'EMAIL_NOT_CONFIGURED' };
  const from = process.env.BOOKING_EMAIL_FROM || 'Niebieski Kot <onboarding@resend.dev>';
  const replyTo = process.env.BOOKING_EMAIL_REPLY_TO || process.env.BOOKING_EMAIL_FROM;
  const subject = statusSubject[status] || statusSubject.received;
  const lead = statusLead[status] || statusLead.received;
  const details = [
    ['Termin', `${booking.date} · ${booking.time}`],
    ['Goście', booking.guests],
    ['Imię', booking.name],
    booking.eventTitle ? ['Wydarzenie', booking.eventTitle] : null,
    booking.adminNote ? ['Wiadomość od kawiarni', booking.adminNote] : null
  ].filter(Boolean);
  const rows = details.map(([label, value]) => `<tr><td style="padding:8px 12px;color:#475569">${escapeHtml(label)}</td><td style="padding:8px 12px;font-weight:700;color:#0f172a">${escapeHtml(value)}</td></tr>`).join('');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `booking-${status}-${booking.id}-${booking.updatedAt || booking.createdAt || ''}`
    },
    body: JSON.stringify({
      from,
      to: booking.email,
      reply_to: replyTo,
      subject,
      html: `<div style="font-family:Arial,sans-serif;background:#f7f8f4;padding:24px"><div style="max-width:560px;margin:auto;background:white;border-radius:20px;padding:28px;border:1px solid #e2e8f0"><h1 style="margin:0 0 12px;font-size:24px;color:#0f172a">${escapeHtml(subject)}</h1><p style="line-height:1.6;color:#334155">${escapeHtml(lead)}</p><table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:14px;overflow:hidden">${rows}</table><p style="margin-top:22px;color:#64748b;font-size:14px">Niebieski Kot · ul. Krakowska 32, Opole</p></div></div>`
    })
  });
  if (!response.ok) return { sent: false, reason: `EMAIL_FAILED_${response.status}` };
  const body = await response.json().catch(() => ({}));
  return { sent: true, id: body?.id };
}
