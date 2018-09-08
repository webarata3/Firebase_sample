'use strict';

const loaderArea = document.getElementById('loaderArea');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const displayName = document.getElementById('displayName');
const profileImage = document.getElementById('profileImage');

const provider = new firebase.auth.GoogleAuthProvider();

loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  loaderArea.classList.remove('hidden');
  firebase.auth().signInWithRedirect(provider);
});

logoutButton.addEventListener('click', (event) => {
  event.preventDefault();
  loaderArea.classList.remove('hidden');
  firebase.auth().signOut();
});

const PROFILE_PLACEHOLDER_IMAGE = '/image/profile_placeholder.png';

firebase.auth().onAuthStateChanged((user) => {
  loaderArea.classList.add('hidden');
  if (user) {
    loginButton.setAttribute('hidden', 'true');
    logoutButton.removeAttribute('hidden');
    displayName.textContent = user.displayName;
    const profileImageUrl = user.photoURL || PROFILE_PLACEHOLDER_IMAGE;
    profileImage.style.backgroundImage = `url(${profileImageUrl})`;
  } else {
    loginButton.removeAttribute('hidden');
    logoutButton.setAttribute('hidden', 'true');
    displayName.textContent = '';
    profileImage.style.backgroundImage = 'none';
  }
});

const fileButton = document.getElementById('file');
const uploadStatusEl = document.getElementById('uploadStatus');
const uploadFileNameEl = document.getElementById('uploadFileName');
const fileSizeEl = document.getElementById('fileSize');
const progressEl = document.getElementById('progress');

document.getElementById('selectFile').addEventListener('click', (event) => {
  event.preventDefault();
  fileButton.click();
});

fileButton.addEventListener('change', (event) => {
  const file = event.currentTarget.files[0];
  const uploadTask = firebase.storage().ref(`files/${file.name}`).put(file);

  uploadStatusEl.classList.remove('hidden');
  uploadFileNameEl.textContent = file.name;
  fileSizeEl.textContent = `(${getDisplayFileSize(file.size)})`;

  uploadTask.on('state_changed', (snapshot) => {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressEl.style.width = `${progress}%`;
    progressEl.textContent = `${parseInt(progress, 10)}%`;
  }, (error) => {
    snackbar('ファイルのアップロードエラーです。' + error.code);
  }, () => {
    snackbar('ファイルのアップロードが完了しました');
  });
});

function getDisplayFileSize(plainSize) {
  var SIZE_UNIT = ['B', 'KB', 'MB', 'GB', 'TB'];

  var size = parseInt(plainSize, 10);

  for (var i = 0; i < SIZE_UNIT.length; i++) {
    if (size < 1000) break;
    size = size / 1024;
  }

  if (size === Math.floor(size)) {
    size = Math.floor(size);
  } else {
    size = size.toPrecision(3);
  }

  return size + SIZE_UNIT[i];
}

const fileNameEl = document.getElementById('fileName');
const viewButton = document.getElementById('viewButton');
const imageEl = document.getElementById('image');

var storage = firebase.storage();

viewButton.addEventListener('click', (evnet) => {
  const fileName = fileNameEl.value;
  if (!fileName) return;

  const storageRef = storage.ref(fileName);

  storageRef.getDownloadURL().then(function(url) {
    imageEl.src = url;
  }).catch(function(error) {
    snackbar('ファイルの表示エラーです。' + error.code);
  });
});

const downloadButton = document.getElementById('downloadButton');

downloadButton.addEventListener('click', (event) => {
  const fileName = fileNameEl.value;
  if (!fileName) return;

  const storageRef = storage.ref(fileName);

  storageRef.getDownloadURL().then(function(url) {
    const xhr = new XMLHttpRequest();

    xhr.responseType = 'blob';
    xhr.addEventListener('load', (event) => {
      const blob = xhr.response;
      const link = document.getElementById("downloadLink");
      link.href = URL.createObjectURL(blob);
      const splitName = fileName.split('/');
      link.download = splitName[splitName.length - 1];
      link.click();
    });
    xhr.open('GET', url);
    xhr.send();
  }).catch(function(error) {
    snackbar('ファイルのダウンロードエラーです。' + error.code);
  });
});

const deleteButton = document.getElementById('deleteButton');

deleteButton.addEventListener('click', (event) => {
  const fileName = fileNameEl.value;
  if (!fileName) return;

  const storageRef = storage.ref(fileName);

  storageRef.delete().then(() => {
    snackbar(fileName + 'を削除しました。');
  }).catch((error) => {
    snackbar('ファイルの削除エラーです。' + error.code);
  });
});

let timer;
const snackbarEl = document.getElementById('snackbar');

function snackbar(message) {
  snackbarEl.textContent = message;
  snackbarEl.classList.add('show');

  // timeoutが設定されてたら、消して設定し直す
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    snackbarEl.classList.remove('show');
  }, 3000);
}
