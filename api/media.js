import crypto from 'node:crypto';
import { getMedia, setMedia } from './_lib/redis.js';
import { hasPermission, isAuthenticated } from './_lib/auth.js';
import { bodyOf, json, sameOrigin } from './_lib/http.js';

const types = { jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };

export default async function handler(request, response) {
  const startedAt = Date.now();
  try {
    if (request.method === 'GET') {
      const id = new URL(request.url, 'https://niebieski-kot.vercel.app').searchParams.get('id') || '';
      if (!/^[a-f0-9-]{20,80}$/.test(id)) return json(response, 404, { error: 'MEDIA_NOT_FOUND' });
      const media = await getMedia(id);
      if (!media?.data || !types[media.type]) return json(response, 404, { error: 'MEDIA_NOT_FOUND' });
      const bytes = Buffer.from(media.data, 'base64');
      response.statusCode = 200;
      response.setHeader('Content-Type', types[media.type]);
      response.setHeader('Content-Length', bytes.length);
      response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      response.setHeader('X-Content-Type-Options', 'nosniff');
      return response.end(bytes);
    }
    if (request.method !== 'POST') return json(response, 405, { error: 'METHOD_NOT_ALLOWED' }, { Allow: 'GET, POST' });
    if (!sameOrigin(request)) return json(response, 403, { error: 'INVALID_ORIGIN' });
    if (!isAuthenticated(request)) return json(response, 401, { error: 'UNAUTHORIZED' });
    if (!hasPermission(request, 'content')) return json(response, 403, { error: 'FORBIDDEN' });
    if (Number(request.headers['content-length'] || 0) > 1_200_000) return json(response, 413, { error: 'IMAGE_TOO_LARGE' });
    const requested = bodyOf(request);
    const match = String(requested.dataUrl || '').match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,([a-z0-9+/=]+)$/i);
    if (!match) return json(response, 422, { error: 'INVALID_IMAGE' });
    const type = match[1].toLowerCase();
    const bytes = Buffer.from(match[2], 'base64');
    if (!bytes.length || bytes.length > 800_000) return json(response, 413, { error: 'IMAGE_TOO_LARGE' });
    const id = crypto.randomUUID();
    await setMedia(id, { type, data: bytes.toString('base64'), createdAt: new Date().toISOString() });
    console.log(JSON.stringify({ level: 'info', message: 'Image uploaded', route: '/api/media', bytes: bytes.length, duration_ms: Date.now() - startedAt }));
    return json(response, 201, { url: `/api/media?id=${id}` });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'Image upload failed', route: '/api/media', error: error?.message, duration_ms: Date.now() - startedAt }));
    return json(response, error?.code === 'STORAGE_NOT_CONFIGURED' ? 503 : 500, { error: error?.code || 'INTERNAL_ERROR' });
  }
}
