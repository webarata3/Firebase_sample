'use strict';

const isbnEl = document.getElementById('isbn');
const nameEl = document.getElementById('name');
const isbnInputEl = isbnEl.shadowRoot.querySelector('input');
const nameInputEl = nameEl.shadowRoot.querySelector('input');

const booksRef = firebase.database().ref('book');

document.getElementById('insertButton').addEventListener('click', async function (event) {
  clearErrorMessage(isbnEl, nameEl);

  const isbn = isbnInputEl.value;
  const name = nameInputEl.value;

  // 入力チェック
  const [isbnError, nameError] = await Promise.all([
    validateIsbn(isbn),
    validateName(name)
  ]);

  setErrorMessage(
    {el: isbnEl, message: isbnError},
    {el: nameEl, message: nameError}
  );

  if (!isbnError && !nameError) {
    const newBookRef = booksRef.push();
    newBookRef.set({isbn: isbn, name: name}, (error) => {
      if (error) {

      } else {
        addBook(newBookRef.key, {isbn: isbn, name: name});
        isbnInputEl.value = '';
        nameInputEl.value = '';
      }
    });
  }
});

function clearErrorMessage(...inputBoxes) {
  inputBoxes.forEach((inputBox) => {
    inputBox.setAttribute('error-message', '');
  });
}

async function validateIsbn(value) {
  return validateRequire(value)
    || validateLength(value, 40)
    || await validateExistsIsbn(value);
}

function validateName(value) {
  return validateRequire(value)
    || validateLength(value, 40);
}

function validateRequire(value) {
  if (!value || value.length === 0) {
    return '入力してください';
  }
  return null;
}

function validateLength(value, maxLength) {
  if (value.length > maxLength) {
    return `${maxLength}文字以内で入力してください`
  }
}

async function validateExistsIsbn(value) {
  const result = await booksRef.orderByChild('isbn').startAt(value).endAt(value).once('value');
  if (result.val()) {
    return '登録済みのISBNです';
  }

  return null;
}

function setErrorMessage(...messages) {
  messages.forEach((message) => {
    if (message.message) {
      message.el.setAttribute('error-message', message.message);
    }
  });
}

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
