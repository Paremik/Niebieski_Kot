import crypto from 'node:crypto';
import { defaultData, normalizeAdminData, textFor } from '../src/data/adminData.js';
import { bookingStatuses, bookingValidationErrors, normalizeBooking, normalizeBookings } from '../src/data/bookings.js';
import { bookingRateKey, consumeRateLimit, getBookings, getContent, reserveBooking, updateBookingFields } from './_lib/redis.js';
import { clientFingerprint, hasPermission, isAuthenticated } from './_lib/auth.js';
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
      if (!hasPermission(request, 'bookings')) return json(response, 403, { error: 'FORBIDDEN' });
      const { content, bookings } = await loadContext();
      response.setHeader('Cache-Control', 'private, no-store');
      return json(response, 200, { bookings, settings: content.bookingSettings });
    }

    if (request.method === 'POST') {
      if (!sameOrigin(request)) return json(response, 403, { error: 'INVALID_ORIGIN' });
      if (Number(request.headers['content-length'] || 0) > 50000) return json(response, 413, { error: 'PAYLOAD_TOO_LARGE' });
      if (!await consumeRateLimit(bookingRateKey(clientFingerprint(request)), 8, 600)) return json(response, 429, { error: 'RATE_LIMITED' }, { 'Retry-After': '600' });
      const requested = bodyOf(request);
      const eventId = typeof requested.eventId === 'string' ? requested.eventId.trim().slice(0, 120) : null;
      const now = new Date();
      const { content } = await loadContext();
      const selectedEvent = eventId ? content.events.find(event => event.enabled && event.id === eventId) : null;
      if (eventId && !selectedEvent) return json(response, 422, { error: 'VALIDATION_ERROR', fields: ['event'] });
      const booking = normalizeBooking({
        id: bookingId(),
        date: requested.date,
        time: requested.time,
        guests: requested.guests,
        name: requested.name,
        email: requested.email,
        notes: requested.notes,
        eventTitle: selectedEvent ? textFor(selectedEvent.title, 'pl') : '',
        status: 'new',
        notificationStatus: 'pending',
        adminNotificationStatus: content.cafeSettings.adminNotificationsEnabled ? 'pending' : 'ADMIN_NOTIFICATIONS_DISABLED',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      });
      const errors = bookingValidationErrors(booking);
      if (errors.length || requested.consent !== true || !getBookingTimes(booking.date, now, eventId, content.bookingSettings).includes(booking.time)) return json(response, 422, { error: 'VALIDATION_ERROR', fields: errors });
      if (!await reserveBooking(booking, content.bookingSettings.maxTables)) return json(response, 409, { error: 'SLOT_FULL' });
      const [visitorResult, adminResult] = await Promise.allSettled([
        sendBookingEmail(booking, 'received'),
        content.cafeSettings.adminNotificationsEnabled ? sendAdminBookingEmail(booking, content.cafeSettings.adminNotificationEmail) : Promise.resolve({ sent: false, reason: 'ADMIN_NOTIFICATIONS_DISABLED' })
      ]);
      const email = visitorResult.status === 'fulfilled' ? visitorResult.value : { sent: false, reason: 'EMAIL_FAILED' };
      const adminEmail = adminResult.status === 'fulfilled' ? adminResult.value : { sent: false, reason: 'EMAIL_FAILED' };
      const notificationPatch = { notificationStatus: email.sent ? 'sent' : email.reason, adminNotificationStatus: adminEmail.sent ? 'sent' : adminEmail.reason, notifiedAt: email.sent ? now.toISOString() : null };
      const nextBooking = normalizeBooking(await updateBookingFields(booking.id, notificationPatch) || { ...booking, ...notificationPatch });
      return json(response, 201, { booking: publicBooking(nextBooking) });
    }

    if (request.method === 'PUT') {
      if (!sameOrigin(request)) return json(response, 403, { error: 'INVALID_ORIGIN' });
      if (!isAuthenticated(request)) return json(response, 401, { error: 'UNAUTHORIZED' });
      if (!hasPermission(request, 'bookings')) return json(response, 403, { error: 'FORBIDDEN' });
      if (Number(request.headers['content-length'] || 0) > 50000) return json(response, 413, { error: 'PAYLOAD_TOO_LARGE' });
      const requested = bodyOf(request);
      const id = String(requested.id || '');
      const bookings = normalizeBookings(await getBookings());
      const index = bookings.findIndex(row => row.id === id);
      if (index < 0) return json(response, 404, { error: 'BOOKING_NOT_FOUND' });
      const updatedAt = new Date().toISOString();
      const draft = normalizeBooking({
        ...bookings[index],
        status: bookingStatuses.includes(requested.status) ? requested.status : bookings[index].status,
        adminNote: requested.adminNote,
        updatedAt
      }, index);
      const savedBooking = await updateBookingFields(id, { status: draft.status, adminNote: draft.adminNote, updatedAt });
      if (!savedBooking) return json(response, 404, { error: 'BOOKING_NOT_FOUND' });
      let nextBooking = normalizeBooking(savedBooking);
      let email = { sent: false, reason: 'NOT_REQUESTED' };
      if (requested.notify === true) {
        email = await sendBookingEmail(nextBooking, nextBooking.status);
        const notificationPatch = { notificationStatus: email.sent ? 'sent' : email.reason, notifiedAt: email.sent ? updatedAt : nextBooking.notifiedAt };
        nextBooking = normalizeBooking(await updateBookingFields(id, notificationPatch) || { ...nextBooking, ...notificationPatch });
      }
      return json(response, 200, { booking: nextBooking, email });
    }

    return json(response, 405, { error: 'METHOD_NOT_ALLOWED' }, { Allow: 'GET, POST, PUT' });
  } catch (error) {
    console.error('bookings_api_error', error?.message);
    return json(response, error?.code === 'STORAGE_NOT_CONFIGURED' ? 503 : 500, { error: error?.code || 'INTERNAL_ERROR' });
  }
}
