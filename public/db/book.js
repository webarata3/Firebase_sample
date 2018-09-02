'use strict';

const isbnField = document.getElementById('isbn');
const nameField = document.getElementById('name');

const booksRef = firebase.database().ref('book');

document.getElementById('insertButton').addEventListener('click', (event) => {
  const isbn = isbnField.value;
  const name = nameField.value;

  if (isbn && name) {
    booksRef.push({isbn: isbn, name: name}).then(() => {
      isbnField.value = '';
      nameField.value = '';
      console.log('OK!!');
    }).catch((error) => {
      console.log('error: ', error);
    });
  }
});

const bookList = document.getElementById('bookList');

booksRef.on('child_added', (data) => {
  const book = data.val();

  const bookEl = document.createElement('div');
  bookList.insertBefore(bookEl, bookList.firstChild);

  // !!危険!! 本番はエスケープしましょう
  bookEl.innerHTML =
    `<div class="isbn">${book.isbn}</div>` +
    `<div class="name">${book.name}</div>`;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '削除';
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    const deleteEl = deleteButton.parentNode;
    deleteEl.parentNode.removeChild(deleteEl);

    booksRef.child(data.key).remove();
  });
  bookEl.appendChild(deleteButton);
});
