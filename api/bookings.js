import crypto from 'node:crypto';
import { defaultData, normalizeAdminData } from '../src/data/adminData.js';
import { bookingSlotIsFull, bookingStatuses, bookingValidationErrors, normalizeBooking, normalizeBookings } from '../src/data/bookings.js';
import { getBookings, getContent, setBookings } from './_lib/redis.js';
import { isAuthenticated } from './_lib/auth.js';
import { bodyOf, json, sameOrigin } from './_lib/http.js';
import { sendAdminBookingEmail, sendBookingEmail } from './_lib/email.js';
import { getBookingTimes } from '../src/lib/booking.js';

const bookingId = () => `booking-${crypto.randomUUID?.() || crypto.randomBytes(12).toString('hex')}`;
const publicBooking = booking => ({ id: booking.id, date: booking.date, time: booking.time, status: booking.status, notificationStatus: booking.notificationStatus });

async function loadContext() {
  const content = normalizeAdminData((await getContent()) || defaultData);
  const bookings = normalizeBookings(await getBookings());
  return { content, bookings };
}

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {
      if (!isAuthenticated(request)) return json(response, 401, { error: 'UNAUTHORIZED' });
      const { content, bookings } = await loadContext();
      response.setHeader('Cache-Control', 'private, no-store');
      return json(response, 200, { bookings, settings: content.bookingSettings });
    }

    if (request.method === 'POST') {
      if (!sameOrigin(request)) return json(response, 403, { error: 'INVALID_ORIGIN' });
      if (Number(request.headers['content-length'] || 0) > 50000) return json(response, 413, { error: 'PAYLOAD_TOO_LARGE' });
      const requested = bodyOf(request);
      const eventIndex = requested.eventIndex !== null && requested.eventIndex !== undefined && requested.eventIndex !== '' && Number.isInteger(Number(requested.eventIndex)) ? Number(requested.eventIndex) : null;
      const now = new Date();
      const booking = normalizeBooking({
        id: bookingId(),
        date: requested.date,
        time: requested.time,
        guests: requested.guests,
        name: requested.name,
        email: requested.email,
        notes: requested.notes,
        eventTitle: requested.eventTitle,
        status: 'new',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      });
      const errors = bookingValidationErrors(booking);
      const { content, bookings } = await loadContext();
      if (errors.length || requested.consent !== true || !getBookingTimes(booking.date, now, eventIndex, content.bookingSettings).includes(booking.time)) return json(response, 422, { error: 'VALIDATION_ERROR', fields: errors });
      if (bookingSlotIsFull(bookings, booking.date, booking.time, content.bookingSettings)) return json(response, 409, { error: 'SLOT_FULL' });
      const email = await sendBookingEmail(booking, 'received');
      const adminEmail = content.cafeSettings.adminNotificationsEnabled ? await sendAdminBookingEmail(booking, content.cafeSettings.adminNotificationEmail) : { sent: false, reason: 'ADMIN_NOTIFICATIONS_DISABLED' };
      const nextBooking = { ...booking, notificationStatus: email.sent ? 'sent' : email.reason, adminNotificationStatus: adminEmail.sent ? 'sent' : adminEmail.reason, notifiedAt: email.sent ? now.toISOString() : null };
      await setBookings([nextBooking, ...bookings].slice(0, 500));
      return json(response, 201, { booking: publicBooking(nextBooking) });
    }

    if (request.method === 'PUT') {
      if (!sameOrigin(request)) return json(response, 403, { error: 'INVALID_ORIGIN' });
      if (!isAuthenticated(request)) return json(response, 401, { error: 'UNAUTHORIZED' });
      if (Number(request.headers['content-length'] || 0) > 50000) return json(response, 413, { error: 'PAYLOAD_TOO_LARGE' });
      const requested = bodyOf(request);
      const id = String(requested.id || '');
      const bookings = normalizeBookings(await getBookings());
      const index = bookings.findIndex(row => row.id === id);
      if (index < 0) return json(response, 404, { error: 'BOOKING_NOT_FOUND' });
      const updatedAt = new Date().toISOString();
      let nextBooking = normalizeBooking({
        ...bookings[index],
        status: bookingStatuses.includes(requested.status) ? requested.status : bookings[index].status,
        adminNote: requested.adminNote,
        updatedAt
      }, index);
      let email = { sent: false, reason: 'NOT_REQUESTED' };
      if (requested.notify === true) {
        email = await sendBookingEmail(nextBooking, nextBooking.status);
        nextBooking = { ...nextBooking, notificationStatus: email.sent ? 'sent' : email.reason, notifiedAt: email.sent ? updatedAt : nextBooking.notifiedAt };
      }
      const next = bookings.map((row, rowIndex) => rowIndex === index ? nextBooking : row);
      await setBookings(next);
      return json(response, 200, { booking: nextBooking, email });
    }

    return json(response, 405, { error: 'METHOD_NOT_ALLOWED' }, { Allow: 'GET, POST, PUT' });
  } catch (error) {
    console.error('bookings_api_error', error?.message);
    return json(response, error?.code === 'STORAGE_NOT_CONFIGURED' ? 503 : 500, { error: error?.code || 'INTERNAL_ERROR' });
  }
}
