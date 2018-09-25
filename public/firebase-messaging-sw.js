self.addEventListener('push', event => {
  event.waitUntil(
    self.registration.showNotification(event.data.json().notification.title, {
      body: 'body' + event.data.json().notification.body,
      icon: event.data.json().notification.icon
    })
  );
});

messaging.setBackgroundMessageHandler(payload => {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: 'background' + payload.notification.body,
    icon: payload.notification.icon
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
