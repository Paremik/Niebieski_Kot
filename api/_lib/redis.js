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
export async function compareAndSetContent(expectedRevision, value) {
  const script = `
    local raw = redis.call('GET', KEYS[1])
    local revision = 0
    if raw then
      local current = cjson.decode(raw)
      revision = tonumber(current.revision) or 0
    end
    if revision ~= tonumber(ARGV[1]) then return 0 end
    redis.call('SET', KEYS[1], ARGV[2])
    return 1
  `;
  return Number(await redis(['EVAL', script, 1, key, String(expectedRevision), JSON.stringify(value)])) === 1;
}
export async function getBookings() {
  const value = await redis(['GET', bookingsKey]);
  if (!value) return [];
  try { return JSON.parse(value); } catch { return []; }
}
export const setBookings = value => redis(['SET', bookingsKey, JSON.stringify(value)]);
export const rateKey = value => `niebieski-kot:login:${value}`;
export const bookingRateKey = value => `niebieski-kot:booking-rate:${value}`;

export async function consumeRateLimit(keyName, limit, seconds) {
  const script = `
    local count = redis.call('INCR', KEYS[1])
    if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
    if count > tonumber(ARGV[2]) then return 0 end
    return 1
  `;
  return Number(await redis(['EVAL', script, 1, keyName, String(seconds), String(limit)])) === 1;
}

export async function reserveBooking(booking, maxTables) {
  const script = `
    local rows = {}
    local raw = redis.call('GET', KEYS[1])
    if raw then rows = cjson.decode(raw) end
    local count = 0
    for _, row in ipairs(rows) do
      if row.date == ARGV[1] and row.time == ARGV[2] and (row.status == 'new' or row.status == 'confirmed') then count = count + 1 end
    end
    if count >= tonumber(ARGV[3]) then return 0 end
    table.insert(rows, 1, cjson.decode(ARGV[4]))
    while #rows > 500 do table.remove(rows) end
    redis.call('SET', KEYS[1], cjson.encode(rows))
    return 1
  `;
  return Number(await redis(['EVAL', script, 1, bookingsKey, booking.date, booking.time, String(maxTables), JSON.stringify(booking)])) === 1;
}

export async function updateBookingFields(id, patch) {
  const script = `
    local raw = redis.call('GET', KEYS[1])
    if not raw then return false end
    local rows = cjson.decode(raw)
    local changes = cjson.decode(ARGV[2])
    for _, row in ipairs(rows) do
      if row.id == ARGV[1] then
        for field, value in pairs(changes) do row[field] = value end
        redis.call('SET', KEYS[1], cjson.encode(rows))
        return cjson.encode(row)
      end
    end
    return false
  `;
  const value = await redis(['EVAL', script, 1, bookingsKey, id, JSON.stringify(patch)]);
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

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
