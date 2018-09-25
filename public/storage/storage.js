'use strict';

const fileButton = document.getElementById('fileButton');
const uploadStatusEl = document.getElementById('uploadStatus');
const uploadFileNameEl = document.getElementById('uploadFileName');
const fileSizeEl = document.getElementById('fileSize');
const progressEl = document.getElementById('progress');

document.getElementById('selectFileButton').addEventListener('click', event => {
  event.preventDefault();
  fileButton.click();
});

fileButton.addEventListener('change', event => {
  const file = event.currentTarget.files[0];
  const uploadTask = firebase.storage().ref(`files/${file.name}`).put(file);

  uploadStatusEl.classList.remove('hidden');
  uploadFileNameEl.textContent = file.name;
  fileSizeEl.textContent = `(${getDisplayFileSize(file.size)})`;

  uploadTask.on('state_changed', snapshot => {
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressEl.style.width = `${progress}%`;
    progressEl.textContent = `${parseInt(progress, 10)}%`;
  }, error => {
    snackBar('ファイルのアップロードエラーです。' + error.code);
  }, () => {
    snackBar('ファイルのアップロードが完了しました。');
  });
});

function getDisplayFileSize(plainSize) {
  const SIZE_UNIT = ['B', 'KB', 'MB', 'GB', 'TB'];

  let size = parseInt(plainSize, 10);

  let i;
  for (i = 0; i < SIZE_UNIT.length; i++) {
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

viewButton.addEventListener('click', evnet => {
  const fileName = fileNameEl.value;
  if (!fileName) return;

  const storageRef = storage.ref(fileName);

  storageRef.getDownloadURL().then(url => {
    imageEl.src = url;
  }).catch(error => {
    snackBar('ファイルの表示エラーです。' + error.code);
  });
});

document.getElementById('downloadButton').addEventListener('click', event => {
  const fileName = fileNameEl.value;
  if (!fileName) return;

  const storageRef = storage.ref(fileName);

  storageRef.getDownloadURL().then(url => {
    const xhr = new XMLHttpRequest();

    xhr.responseType = 'blob';
    xhr.addEventListener('load', event => {
      const blob = xhr.response;
      const link = document.getElementById("downloadLink");
      link.href = URL.createObjectURL(blob);
      const splitName = fileName.split('/');
      link.download = splitName[splitName.length - 1];
      link.click();
    });
    xhr.open('GET', url);
    xhr.send();
  }).catch(error => {
    snackBar('ファイルのダウンロードエラーです。' + error.code);
  });
});

document.getElementById('deleteButton').addEventListener('click', event => {
  const fileName = fileNameEl.value;
  if (!fileName) return;

  const storageRef = storage.ref(fileName);

  storageRef.delete().then(() => {
    snackBar(fileName + 'を削除しました。');
  }).catch(error => {
    snackBar('ファイルの削除エラーです。' + error.code);
  });
});
