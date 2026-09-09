import { defaultData, normalizeAdminData, publicAdminData, validationErrors } from '../src/data/adminData.js';
import { compareAndSetContent, getContent } from './_lib/redis.js';
import { hasPermission, isAuthenticated } from './_lib/auth.js';
import { bodyOf, json, sameOrigin } from './_lib/http.js';

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {
      let stored = null;
      try { stored = await getContent(); } catch (error) { if (error.code !== 'STORAGE_NOT_CONFIGURED') throw error; }
      const data = normalizeAdminData(stored || defaultData);
      const authenticated = isAuthenticated(request);
      response.setHeader('Cache-Control', authenticated ? 'private, no-store' : 'public, s-maxage=10, stale-while-revalidate=60');
      return json(response, 200, { data: hasPermission(request, 'content') ? data : publicAdminData(data), configured: Boolean(process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) });
    }
    if (request.method !== 'PUT') return json(response, 405, { error: 'METHOD_NOT_ALLOWED' }, { Allow: 'GET, PUT' });
    if (!sameOrigin(request)) return json(response, 403, { error: 'INVALID_ORIGIN' });
    if (!isAuthenticated(request)) return json(response, 401, { error: 'UNAUTHORIZED' });
    if (!hasPermission(request, 'content')) return json(response, 403, { error: 'FORBIDDEN' });
    if (Number(request.headers['content-length'] || 0) > 250000) return json(response, 413, { error: 'PAYLOAD_TOO_LARGE' });
    const current = normalizeAdminData((await getContent()) || defaultData);
    const requested = bodyOf(request);
    if (Number(requested.revision) !== current.revision) return json(response, 409, { error: 'CONTENT_CHANGED', data: current });
    const next = normalizeAdminData({ ...requested, revision: current.revision + 1, updatedAt: new Date().toISOString() });
    const errors = validationErrors(next);
    if (errors.length) return json(response, 422, { error: 'VALIDATION_ERROR', fields: errors.slice(0, 20) });
    if (!await compareAndSetContent(current.revision, next)) {
      const latest = normalizeAdminData((await getContent()) || defaultData);
      return json(response, 409, { error: 'CONTENT_CHANGED', data: latest });
    }
    return json(response, 200, { data: next });
  } catch (error) {
    console.error('content_api_error', error?.message);
    return json(response, error?.code === 'STORAGE_NOT_CONFIGURED' ? 503 : 500, { error: error?.code || 'INTERNAL_ERROR' });
  }
}
