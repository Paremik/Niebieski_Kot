const key = 'niebieski-kot:content:v1';
const bookingsKey = 'niebieski-kot:bookings:v1';
const analyticsKey = 'niebieski-kot:analytics:v1';
const mediaPrefix = 'niebieski-kot:media:v1:';

function config() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw Object.assign(new Error('Storage is not configured'), { code: 'STORAGE_NOT_CONFIGURED' });
  return { url: url.replace(/\/$/, ''), token };
}

export async function redis(command) {
  const { url, token } = config();
  const response = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([command])
  });
  if (!response.ok) throw new Error(`Storage request failed (${response.status})`);
  const body = await response.json();
  if (body?.[0]?.error) throw new Error(body[0].error);
  return body?.[0]?.result;
}

export async function getContent() {
  const value = await redis(['GET', key]);
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

export const setContent = value => redis(['SET', key, JSON.stringify(value)]);
export async function getBookings() {
  const value = await redis(['GET', bookingsKey]);
  if (!value) return [];
  try { return JSON.parse(value); } catch { return []; }
}
export const setBookings = value => redis(['SET', bookingsKey, JSON.stringify(value)]);
export const rateKey = value => `niebieski-kot:login:${value}`;

export const setMedia = (id, value) => redis(['SET', `${mediaPrefix}${id}`, JSON.stringify(value)]);
export async function getMedia(id) {
  const value = await redis(['GET', `${mediaPrefix}${id}`]);
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

export const incrementMetric = field => redis(['HINCRBY', analyticsKey, field, 1]);
export async function markAnalyticsSession(id) {
  return redis(['SET', `${analyticsKey}:session:${id}`, '1', 'NX', 'EX', 86400]);
}
export async function getAnalytics() {
  const value = await redis(['HGETALL', analyticsKey]);
  if (!value) return {};
  if (Array.isArray(value)) return Object.fromEntries(Array.from({ length: Math.floor(value.length / 2) }, (_, index) => [value[index * 2], Number(value[index * 2 + 1]) || 0]));
  return Object.fromEntries(Object.entries(value).map(([key, count]) => [key, Number(count) || 0]));
}
