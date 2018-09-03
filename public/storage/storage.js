'use strict';

const loaderArea = document.getElementById('loaderArea');
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
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
const progressEl = document.getElementById('progress');

document.getElementById('selectFile').addEventListener('click', (event) => {
  event.preventDefault();
  fileButton.click();
});

fileButton.addEventListener('change', (event) => {
  const file = event.currentTarget.files[0];
  console.log(file);
  const uploadTask = firebase.storage().ref(`files/${file.name}`).put(file);

  uploadTask.on('state_changed', function(snapshot) {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressEl.style.borderLeft = `solid ${progress}px #000`;
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
        // User doesn't have permission to access the object
        console.log('storage/unauthorized');
        break;
        case 'storage/canceled':
        // User canceled the upload
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  }, function() {
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log('File available at', downloadURL);
    });
  });
});
