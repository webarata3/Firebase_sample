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
const fileNameEl = document.getElementById('fileName');
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
  fileNameEl.textContent = file.name;
  fileSizeEl.textContent = `(${getDisplayFileSize(file.size)})`;

  uploadTask.on('state_changed', function(snapshot) {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressEl.style.width = `${progress}%`;
    progressEl.textContent = `${parseInt(progress, 10)}%`;
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
    console.log(error);
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        console.log('storage/unauthorized');
        break;
      case 'storage/unknown':
        break;
    }
  }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
    });
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
