'use strict';

const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
  // サービスワーカーの登録
  navigator.serviceWorker.register('/messaging/sw.js').then(function (registration) {
    // サービスワーカー登録成功
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    // 今回はこのサービスワーカーを指定します
    messaging.useServiceWorker(registration);
    // 通知の受信許可を確認する
    messaging.requestPermission().then(function () {
      console.log('Notification permission granted.');
      // トークンを取得する
      messaging.getToken().then(function (currentToken) {
        if (currentToken) {
          // 今回はコンソールに出力して取得します。実運用では適切な方法で保管する必要があります。
          console.log(currentToken);
        } else {
          console.log('No Instance ID token available. Request permission to generate one.');
        }
      }).catch(function (err) {
        console.log('An error occurred while retrieving token. ', err);
      });
    }).catch(function (err) {
      console.log('Unable to get permission to notify.', err);
    });
  }).catch(function (err) {
    // サービスワーカー登録失敗
    console.log('ServiceWorker registration failed: ', err);
  });
}
