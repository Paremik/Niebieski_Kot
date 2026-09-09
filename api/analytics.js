import crypto from 'node:crypto';
import { getAnalytics, incrementMetric, markAnalyticsSession } from './_lib/redis.js';
import { isAuthenticated } from './_lib/auth.js';
import { bodyOf, json, sameOrigin } from './_lib/http.js';

const clean = value => String(value || '').toLowerCase().replace(/[^a-z0-9/_:-]/g, '').slice(0, 80);
const collect = (metrics, prefix) => Object.fromEntries(Object.entries(metrics).filter(([key]) => key.startsWith(prefix)).map(([key, value]) => [key.slice(prefix.length), value]));

export default async function handler(request, response) {
  const startedAt = Date.now();
  try {
    if (request.method === 'GET') {
      if (!isAuthenticated(request)) return json(response, 401, { error: 'UNAUTHORIZED' });
      const metrics = await getAnalytics();
      response.setHeader('Cache-Control', 'private, no-store');
      return json(response, 200, {
        summary: { pageviews: metrics.pageviews || 0, visits: metrics.visits || 0, clicks: metrics.clicks || 0 },
        pages: collect(metrics, 'page:'), cats: collect(metrics, 'cat:'), actions: collect(metrics, 'click:'), daily: collect(metrics, 'day:')
      });
    }
    if (request.method !== 'POST') return json(response, 405, { error: 'METHOD_NOT_ALLOWED' }, { Allow: 'GET, POST' });
    if (!sameOrigin(request)) return json(response, 403, { error: 'INVALID_ORIGIN' });
    if (Number(request.headers['content-length'] || 0) > 5000) return json(response, 413, { error: 'PAYLOAD_TOO_LARGE' });
    const body = bodyOf(request);
    const kind = body.kind === 'click' ? 'click' : 'pageview';
    const value = clean(body.value);
    if (!value) return json(response, 422, { error: 'INVALID_EVENT' });
    const day = new Date().toISOString().slice(0, 10);
    if (kind === 'pageview') {
      await Promise.all([incrementMetric('pageviews'), incrementMetric(`page:${value}`), incrementMetric(`day:${day}`)]);
      const cat = value.match(/^\/koty\/([a-z0-9-]+)$/)?.[1];
      if (cat) await incrementMetric(`cat:${cat}`);
      const session = clean(body.session);
      if (session) {
        const fingerprint = crypto.createHash('sha256').update(`${session}:${request.headers['user-agent'] || ''}`).digest('hex').slice(0, 32);
        if (await markAnalyticsSession(fingerprint)) await incrementMetric('visits');
      }
    } else {
      await Promise.all([incrementMetric('clicks'), incrementMetric(`click:${value}`)]);
    }
    console.log(JSON.stringify({ level: 'info', message: 'Analytics event', route: '/api/analytics', kind, duration_ms: Date.now() - startedAt }));
    return json(response, 202, { accepted: true });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'Analytics failed', route: '/api/analytics', error: error?.message, duration_ms: Date.now() - startedAt }));
    return json(response, error?.code === 'STORAGE_NOT_CONFIGURED' ? 503 : 500, { error: error?.code || 'INTERNAL_ERROR' });
  }
}
