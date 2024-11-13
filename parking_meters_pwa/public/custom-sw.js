const baseUrl = self.location.hostname === 'localhost' ? ''
  : '/apps/app_pagos_tiempo';

importScripts(baseUrl + '/workbox/workbox-sw.js');

if (workbox) {
  workbox.setConfig({ debug: false });
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        }),
      ],
    })
  );
} else {
  console.error('Workbox no se ha cargado correctamente');
}

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: baseUrl + '/images/escudo.png',
    badge: baseUrl + '/images/escudo.png',
  });
});
