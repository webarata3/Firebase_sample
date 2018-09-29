// https://github.com/firebase/quickstart-js/tree/master/messaging

'use strict';

const messaging = firebase.messaging();

const tokenEl = document.getElementById('token');

messaging.usePublicVapidKey('BNVfkVPxj_xhRsn2gJzYvjF0EDv6frofdmymHCQ1Chr7_6n5MqUwtRGg1R8lpQ0CZ-C61KPAgbP6TInPu-xj5oo');

// ブラウザ起動時はこちらに通知が来る
messaging.onMessage(payload => {
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/messaging/icon.png'
  });
});

messaging.requestPermission().then(() => {
  messaging.getToken().then(currentToken => {
    if (currentToken) {
      tokenEl.textContent = currentToken;
    } else {
    }
  }).catch(error => {
    snackBar('トークンが取得できない？' + error);
  });
}).catch(error => {
  snackBar('通知の許可が得られませんでした。' + error);
});

messaging.onTokenRefresh(() => {
  messaging.getToken().then(refreshedToken => {
    console.log('Token refreshed.');
    console.log(refreshedToken)
  }).catch(err => {
    console.log('Unable to retrieve refreshed token ', err);
    showToken('Unable to retrieve refreshed token ', err);
  });
});
