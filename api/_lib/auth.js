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

function configuredUsers() {
  try { const users = JSON.parse(process.env.ADMIN_USERS_JSON || '[]'); return Array.isArray(users) ? users.filter(user => user?.username && user?.password).slice(0, 20) : []; } catch { return []; }
}
export function adminUsers() {
  const users = configuredUsers();
  if (process.env.ADMIN_PASSWORD) users.unshift({ username: 'owner', password: process.env.ADMIN_PASSWORD, role: 'owner' });
  return users.filter((user, index, list) => list.findIndex(item => item.username === user.username) === index);
}
export function configured() { return Boolean(adminUsers().length && secret() && (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) && (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)); }
export const findAdmin = (username, password) => adminUsers().find(user => user.username === username && safeEqual(password, user.password));
export const passwordMatches = (value, username = 'owner') => Boolean(findAdmin(username, value));

export function createSessionCookie(user = { username: 'owner', role: 'owner' }) {
  const payload = encode(JSON.stringify({ username: user.username, role: user.role || 'staff', exp: Math.floor(Date.now() / 1000) + ttl }));
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

export function sessionUser(request) {
  if (!secret()) return null;
  const raw = request.headers.cookie?.split(';').map(value => value.trim()).find(value => value.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!raw) return null;
  const [payload, signature] = raw.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try { const user = JSON.parse(Buffer.from(payload, 'base64url').toString()); return user.exp > Date.now() / 1000 ? user : null; } catch { return null; }
}

export const rolePermissions = {
  owner: ['content', 'bookings', 'settings', 'users'],
  manager: ['content', 'bookings', 'settings'],
  staff: ['bookings']
};

export const clientFingerprint = request => crypto.createHash('sha256').update(String(request.headers['x-forwarded-for'] || request.socket?.remoteAddress || 'unknown').split(',')[0]).digest('hex').slice(0, 24);
