export function warsawTime(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/Warsaw', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', hourCycle:'h23'}).formatToParts(now).map(p => [p.type,p.value]));
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  return {date, time:`${parts.hour}:${parts.minute}`, day: new Date(`${date}T12:00:00Z`).getUTCDay()};
}
const legacyEventIds = ['yoga', 'games', 'workshops', 'adoption'];

export function getBookingTimes(date, now = new Date(), eventId = null, settings = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  const parsed = new Date(`${date}T12:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10) !== date) return [];
  const current = warsawTime(now);
  if (date < current.date) return [];
  const day = parsed.getUTCDay();
  if (settings.blockedDates?.includes?.(date)) return [];
  const special = settings.specialDates?.find?.(row => row?.date === date);
  if (special) return special.slots || [];
  if (day === 1 && !settings.openDates?.includes?.(date)) return [];
  let times = day === 0 || day === 6 ? ['10:00'] : [];
  times.push('11:00','12:30','14:00','15:30','17:00','18:30');
  const scheduleId = typeof eventId === 'number' ? legacyEventIds[eventId] : eventId;
  if (scheduleId === 'yoga') times = day === 0 ? ['10:00'] : [];
  if (scheduleId === 'games') times = day === 5 ? ['18:00'] : [];
  if (scheduleId === 'workshops') times = day === 6 && parsed.getUTCDate() <= 14 ? ['12:00'] : [];
  if (scheduleId === 'adoption') times = day === 0 && parsed.getUTCDate() <= 7 ? ['12:00'] : [];
  return times.filter(time => date > current.date || time > current.time);
}
