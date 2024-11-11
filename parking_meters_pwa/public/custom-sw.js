
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
  
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/image/icon.png',
      badge: '/image/escudo.png',
    });
  });
  