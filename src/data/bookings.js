import { localized } from './adminData.js';

export const bookingStatuses = ['new', 'confirmed', 'cancelled', 'completed'];
export const activeBookingStatuses = ['new', 'confirmed'];
export const defaultBookingSettings = { maxTables: 6 };

export const bookingStatusText = {
  new: localized('Nowa', 'Новая', 'New'),
  confirmed: localized('Potwierdzona', 'Подтверждена', 'Confirmed'),
  cancelled: localized('Odwołana', 'Отменена', 'Cancelled'),
  completed: localized('Zakończona', 'Завершена', 'Completed')
};

const trim = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const stableId = (value, fallback) => trim(value || fallback, 120).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
const safeDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? value : '';
const safeTime = value => /^\d{2}:\d{2}$/.test(value || '') ? value : '';

export function normalizeBookingSettings(input) {
  const maxTables = Number(input?.maxTables);
  return { maxTables: Number.isInteger(maxTables) && maxTables >= 1 && maxTables <= 40 ? maxTables : defaultBookingSettings.maxTables };
}

export function normalizeBooking(input, index = 0) {
  const source = input && typeof input === 'object' ? input : {};
  const status = bookingStatuses.includes(source.status) ? source.status : 'new';
  const guests = Number(source.guests);
  return {
    id: stableId(source.id, `booking-${index}`),
    date: safeDate(source.date),
    time: safeTime(source.time),
    guests: Number.isInteger(guests) && guests >= 1 && guests <= 12 ? guests : 2,
    name: trim(source.name, 100),
    email: trim(source.email, 254).toLowerCase(),
    notes: trim(source.notes, 300),
    eventTitle: trim(source.eventTitle, 160),
    status,
    adminNote: trim(source.adminNote, 500),
    notificationStatus: trim(source.notificationStatus, 80),
    notifiedAt: typeof source.notifiedAt === 'string' ? source.notifiedAt : null,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : null,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : null
  };
}

export function normalizeBookings(input) {
  return (Array.isArray(input) ? input : []).slice(0, 500).map(normalizeBooking).filter(row => row.id && row.date && row.time && row.name && row.email);
}

export function bookingSlotCount(bookings, date, time) {
  return normalizeBookings(bookings).filter(row => row.date === date && row.time === time && activeBookingStatuses.includes(row.status)).length;
}

export function bookingSlotIsFull(bookings, date, time, settings) {
  return bookingSlotCount(bookings, date, time) >= normalizeBookingSettings(settings).maxTables;
}

export function bookingValidationErrors(input) {
  const booking = normalizeBooking(input);
  const errors = [];
  if (!booking.date) errors.push('date');
  if (!booking.time) errors.push('time');
  if (!booking.name) errors.push('name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) errors.push('email');
  if (!Number.isInteger(booking.guests) || booking.guests < 1 || booking.guests > 12) errors.push('guests');
  return errors;
}
