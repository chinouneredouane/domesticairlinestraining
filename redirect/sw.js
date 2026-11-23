/* Replaces the old DAL TRAINING offline worker: clears its saved files, removes itself,
   and sends every open window to the new Training Academy address. */
const NEW_HOME = 'https://chinouneredouane.github.io/domesticairlineselearning/';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) await caches.delete(k);
    await self.registration.unregister();
    for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(NEW_HOME).catch(() => {});
  })());
});
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') event.respondWith(Response.redirect(NEW_HOME, 302));
});
