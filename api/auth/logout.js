import { clearSessionCookie } from '../_lib/auth.js';
import { json, sameOrigin } from '../_lib/http.js';
export default function handler(request,response){
  if(request.method!=='POST')return json(response,405,{error:'METHOD_NOT_ALLOWED'},{Allow:'POST'});
  if(!sameOrigin(request))return json(response,403,{error:'INVALID_ORIGIN'});
  return json(response,200,{authenticated:false},{'Set-Cookie':clearSessionCookie()});
}
