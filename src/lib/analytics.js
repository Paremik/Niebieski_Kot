const sessionId = () => {
  try {
    let id = sessionStorage.getItem('niebieski_analytics_session');
    if (!id) { id = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`; sessionStorage.setItem('niebieski_analytics_session', id); }
    return id;
  } catch { return ''; }
};

export function trackSiteEvent(kind, value) {
  if (typeof window === 'undefined') return;
  fetch('/api/analytics', {
    method: 'POST', credentials: 'same-origin', keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kind, value, session: kind === 'pageview' ? sessionId() : undefined })
  }).catch(() => {});
}
