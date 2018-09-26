importScripts('/__/firebase/5.4.2/firebase-app.js');
importScripts('/__/firebase/5.4.2/firebase-messaging.js');
importScripts('/__/firebase/init.js');

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: 'background' + payload.notification.body,
    icon: '/messaging/icon.png'
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
