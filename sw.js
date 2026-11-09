/* Mes Finances — hors ligne. Page : réseau d'abord (mises à jour immédiates), cache si pas d'Internet. */
const V="mes-finances-v18";
const LOCAL=["./","index.html","manifest.json","icon-192.png","icon-512.png","apple-touch-icon.png"];
const LIBS=["https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js","https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js","https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js","https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(LOCAL.map(u=>new Request(u,{cache:"reload"})));await Promise.all(LIBS.map(u=>fetch(u,{mode:"cors"}).then(r=>r.ok&&c.put(u,r)).catch(()=>{})));self.skipWaiting()})())});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const url=new URL(r.url);
 const isPage=r.mode==="navigate"||(url.origin===self.location.origin&&/\/(index\.html)?$/.test(url.pathname));
 e.respondWith((async()=>{const c=await caches.open(V);
  if(isPage){try{const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),3500);const net=await fetch(r,{cache:"no-store",signal:ctl.signal});clearTimeout(t);if(net&&net.ok){c.put("index.html",net.clone());return net}}catch(err){}
   return(await c.match("index.html"))||(await c.match(r,{ignoreSearch:true}))||Response.error()}
  const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(x=>{if(x&&x.ok&&(r.url.startsWith(self.location.origin)||r.url.startsWith("https://cdnjs.cloudflare.com/")))c.put(r,x.clone());return x}).catch(()=>null);
  return hit||(await net)||Response.error()})())});
