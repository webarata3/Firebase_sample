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

const template = document.getElementById('bookTemplate');

booksRef.on('child_added', (data) => {
  const book = data.val();

  template.content.querySelector('.isbn').textContent = book.isbn;
  template.content.querySelector('.bookName').textContent = book.name;

  const clone = document.importNode(template.content, true);
  clone.querySelector('.deleteButton').addEventListener('click', (event) => {
    event.preventDefault();
    const deleteEl = event.currentTarget.parentNode;
    deleteEl.parentNode.removeChild(deleteEl);

    booksRef.child(data.key).remove();
  });

  bookList.insertBefore(clone, bookList.firstChild);
});
