self.addEventListener('push', function (event) {
  var data = { title: 'Coffee & Code', body: '', url: '/' };
  try {
    if (event.data) {
      var parsed = event.data.json();
      data = Object.assign(data, parsed);
    }
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if ('focus' in client && client.url.indexOf(self.location.origin) === 0) {
          return client.navigate(url).then(function () { return client.focus(); });
        }
      }
      return clients.openWindow(url);
    })
  );
});
