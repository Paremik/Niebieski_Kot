import { clientFingerprint, configured, createSessionCookie, findAdmin } from '../_lib/auth.js';
import { bodyOf, json, sameOrigin } from '../_lib/http.js';
import { rateKey, redis } from '../_lib/redis.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error:'METHOD_NOT_ALLOWED' }, { Allow:'POST' });
  if (!sameOrigin(request)) return json(response, 403, { error:'INVALID_ORIGIN' });
  if (!configured()) return json(response, 503, { error:'ADMIN_NOT_CONFIGURED' });
  const key=rateKey(clientFingerprint(request));
  const attempts=Number(await redis(['GET',key])||0);
  if(attempts>=8)return json(response,429,{error:'TOO_MANY_ATTEMPTS'});
  const requested = bodyOf(request);
  const username=String(requested.username||'owner').slice(0,80);
  const password=String(requested.password||'').slice(0,200);
  const user = findAdmin(username, password);
  if(!user){
    const count=Number(await redis(['INCR',key]));
    if(count===1)await redis(['EXPIRE',key,'600']);
    return json(response,401,{error:'INVALID_PASSWORD',remaining:Math.max(0,8-count)});
  }
  await redis(['DEL',key]);
  return json(response,200,{authenticated:true,role:user.role||'staff',username:user.username},{'Set-Cookie':createSessionCookie(user)});
}
