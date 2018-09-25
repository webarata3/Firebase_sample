self.addEventListener('push', event => {
  event.waitUntil(
    self.registration.showNotification(event.data.json().notification.title, {
      'body': event.data.json().notification.body
    })
  );
});
