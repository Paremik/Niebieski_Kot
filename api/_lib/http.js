export function json(response, status, body, headers = {}) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  const hasCacheHeader = Object.keys(headers).some(name => name.toLowerCase() === 'cache-control');
  if (!hasCacheHeader && !response.getHeader?.('Cache-Control')) response.setHeader('Cache-Control', 'no-store');
  Object.entries(headers).forEach(([name, value]) => response.setHeader(name, value));
  response.end(JSON.stringify(body));
}

export function sameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === request.headers.host; } catch { return false; }
}

export function bodyOf(request) {
  if (typeof request.body === 'object' && request.body !== null) return request.body;
  try { return JSON.parse(request.body || '{}'); } catch { return {}; }
}
