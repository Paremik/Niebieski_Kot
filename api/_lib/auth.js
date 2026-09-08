import crypto from 'node:crypto';

const cookieName = 'niebieski_admin';
const ttl = 60 * 60 * 8;
const secret = () => process.env.SESSION_SECRET || '';
const encode = value => Buffer.from(value).toString('base64url');
const sign = value => crypto.createHmac('sha256', secret()).update(value).digest('base64url');
const safeEqual = (a, b) => {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));
  return first.length === second.length && crypto.timingSafeEqual(first, second);
};

export function configured() { return Boolean(process.env.ADMIN_PASSWORD && secret() && (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)); }
export const passwordMatches = value => safeEqual(value, process.env.ADMIN_PASSWORD || crypto.randomBytes(32).toString('hex'));

export function createSessionCookie() {
  const payload = encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + ttl }));
  return `${cookieName}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${ttl}`;
}

export const clearSessionCookie = () => `${cookieName}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export function isAuthenticated(request) {
  if (!secret()) return false;
  const raw = request.headers.cookie?.split(';').map(value => value.trim()).find(value => value.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!raw) return false;
  const [payload, signature] = raw.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now() / 1000; } catch { return false; }
}

export const clientFingerprint = request => crypto.createHash('sha256').update(String(request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown').split(',')[0]).digest('hex').slice(0, 24);
