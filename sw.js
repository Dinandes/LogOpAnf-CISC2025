const CACHE = 'log-opanf-v1';
const ASSETS = [
  '/LogOpAnf-CISC2025/',
  '/LogOpAnf-CISC2025/index.html',
  '/LogOpAnf-CISC2025/manifest.json',
  '/LogOpAnf-CISC2025/icon-192.png',
  '/LogOpAnf-CISC2025/icon-512.png',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/LogOpAnf-CISC2025/index.html'))));
});
