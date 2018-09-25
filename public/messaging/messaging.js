'use strict';

const messaging = firebase.messaging();

const tokenEl = document.getElementById('token');

messaging.usePublicVapidKey("BEBfhxkZQdvx1ModPfW_f3ga1sZANJ0vH8xLvPOUYwUsBaVhsVVR063T5wyILruVSFmpL4scVAXNhuVga6n6VVk");

navigator.serviceWorker.register('/messaging/sw.js').then(() => {
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
}).catch(error => {
  snackBar('サービスワーカーがありません。' + error);
});
