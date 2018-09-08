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
    console.log(error);
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
      link.download = 'ダウンロードテストファイル';
      link.click();
    });
    xhr.open('GET', url);
    xhr.send();
  }).catch(function(error) {
    console.log(error);
  });
});
