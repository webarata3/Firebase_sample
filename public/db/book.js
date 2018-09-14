'use strict';

const isbnEl = document.getElementById('isbn').shadowRoot.querySelector('input');
const nameEl = document.getElementById('name').shadowRoot.querySelector('input');

const booksRef = firebase.database().ref('book');

document.getElementById('insertButton').addEventListener('click', (event) => {
  const isbn = isbnEl.value;
  const name = nameEl.value;

  document.getElementById('isbn').setAttribute('error-message', 'すでに登録済みです');

  // booksRef.orderByChild('name').startAt('t').endAt('t')
  //   .once('value',function(snapshot) {console.log('s', snapshot.val())});

  if (isbn && name) {
    const newBookRef = booksRef.push();
    newBookRef.set({isbn: isbn, name: name}, (error) => {
      if (error) {

      } else {
        addBook(newBookRef.key, {isbn: isbn, name: name});
        isbnEl.value = '';
        nameEl.value = '';
      }
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
  snapshot.forEach((val) => {
    addBook(val.key, val.val());
  });
});

function addBook(key, book) {
  bookTemplate.content.querySelector('.isbn').textContent = book.isbn;
  bookTemplate.content.querySelector('.name').textContent = book.name;

  const clone = document.importNode(bookTemplate.content, true);
  clone.querySelector('.deleteButton').addEventListener('click', (event) => {
    event.preventDefault();
    const deleteEl = event.currentTarget.parentNode.parentNode;

    booksRef.child(key).remove((error) => {
      if (error) {
      } else {
        deleteEl.parentNode.removeChild(deleteEl);
      }
    });
  });

  if (bookTableEl === null) {
    bookTableEl = document.importNode(tableTemplate.content, true);
    bookList.insertBefore(bookTableEl, noBookEl);
    bookTbodyEl = document.querySelector('tbody');
  }

  bookTbodyEl.appendChild(clone);
}
