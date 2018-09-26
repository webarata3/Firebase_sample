// https://github.com/firebase/quickstart-js/tree/master/messaging

'use strict';

const messaging = firebase.messaging();

const tokenEl = document.getElementById('token');

messaging.usePublicVapidKey("BEBfhxkZQdvx1ModPfW_f3ga1sZANJ0vH8xLvPOUYwUsBaVhsVVR063T5wyILruVSFmpL4scVAXNhuVga6n6VVk");

// ブラウザ起動時はこちらに通知が来る
messaging.onMessage(payload => {
  new Notification(payload.notification.title, {
    body: 'ブラウザ' + payload.notification.body,
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
