'use strict';

const isbnEl = document.getElementById('isbn').shadowRoot.querySelector('input');
const nameEl = document.getElementById('name').shadowRoot.querySelector('input');

const booksRef = firebase.database().ref('book');

document.getElementById('insertButton').addEventListener('click', (event) => {
  const isbn = isbnEl.value;
  const name = nameEl.value;

  if (isbn && name) {
    booksRef.push({isbn: isbn, name: name}).then(() => {
      isbnEl.value = '';
      nameEl.value = '';
    }).catch((error) => {
    });
  }
});

const bookList = document.getElementById('bookList');

const tableTemplate = document.getElementById('tableTemplate');
const bookTemplate = document.getElementById('bookTemplate');
const noBookEl = document.getElementById('noBook');
let bookTableEl = null;
let bookTbodyEl = null;

booksRef.once('value').then((snapshot) => {
  console.log(snapshot.val());
  snapshot.forEach((val) => {

    console.log(val.key,val.val().isbn, val.val().name);
  });
});

booksRef.on('child_added', (data) => {
  const book = data.val();

  bookTemplate.content.querySelector('.isbn').textContent = book.isbn;
  bookTemplate.content.querySelector('.name').textContent = book.name;

  const clone = document.importNode(bookTemplate.content, true);
  clone.querySelector('.deleteButton').addEventListener('click', (event) => {
    event.preventDefault();
    const deleteEl = event.currentTarget.parentNode.parentNode;

    deleteEl.parentNode.removeChild(deleteEl);

    booksRef.child(data.key).remove();
  });

  if (bookTableEl === null) {
    bookTableEl = document.importNode(tableTemplate.content, true);
    bookList.insertBefore(bookTableEl, noBookEl);
    bookTbodyEl = document.querySelector('tbody');
  }

  bookTbodyEl.appendChild(clone);
});
