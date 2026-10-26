const CACHE='uli-v1';
const scope=self.registration.scope;
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
async function alive(c){ const m=await c.match('__meta'); if(!m) return false; const {exp,skew}=await m.json(); return Date.now()+(skew||0)<exp; }
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin||!u.pathname.startsWith(new URL('app/',scope).pathname)) return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    if(!(await alive(c))){ await caches.delete(CACHE); return Response.redirect(scope,302); }
    let p=u.pathname; if(p.endsWith('/')) p+='index.html';
    const r=await c.match(p); return r||new Response('Not found',{status:404});
  })());
});
