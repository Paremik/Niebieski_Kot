import { configured, sessionUser } from '../_lib/auth.js';
import { json } from '../_lib/http.js';
export default function handler(request, response) {
  if (request.method !== 'GET') return json(response, 405, { error:'METHOD_NOT_ALLOWED' }, { Allow:'GET' });
  const user = sessionUser(request);
  return json(response, 200, { authenticated:Boolean(user), configured:configured(), role:user?.role||null, username:user?.username||null });
}
