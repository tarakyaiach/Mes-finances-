/* Mes Finances — cache hors ligne */
const V="mes-finances-v5";
const LOCAL=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
const LIBS=["https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js","https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js","https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js","https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(LOCAL);await Promise.all(LIBS.map(u=>fetch(u,{mode:"cors"}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})));self.skipWaiting()})())});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith((async()=>{const c=await caches.open(V);const hit=await c.match(e.request,{ignoreSearch:true});
 /* app shell: cache first, refresh in background when online */
 const net=fetch(e.request).then(r=>{if(r&&r.ok&&(e.request.url.startsWith(self.location.origin)||e.request.url.startsWith("https://cdnjs.cloudflare.com/")))c.put(e.request,r.clone());return r}).catch(()=>null);
 return hit||(await net)||(e.request.mode==="navigate"?c.match("index.html"):Response.error())})())});
