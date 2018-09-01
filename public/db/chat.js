'use strict';

const messageEl = document.getElementById('message');
const nameEl = document.getElementById('name');
const messageList = document.getElementById('messageList');

const messagesRef = firebase.database().ref('chat');

const registerMessage = (event) => {
  if (event.key === 'Enter') {
    const name = nameEl.value;
    const message = messageEl.value;
    if (name && message) {
      messagesRef.push({name: name, message: message});
      messageEl.value = '';
    }
  }
};

nameEl.addEventListener('keypress', registerMessage);
messageEl.addEventListener('keypress', registerMessage);

messagesRef.on('child_added', (data) => {
  const message = data.val();

  const messageArea = document.createElement('div');
  messageList.insertBefore(messageArea, messageList.firstChild);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('deleteButton');
  deleteButton.textContent = '☓';
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    const deleteEl = deleteButton.parentNode;
    deleteEl.parentNode.removeChild(deleteEl);

    messagesRef.child(data.key).remove();
  });
  messageArea.appendChild(deleteButton);

  const nameDiv = document.createElement('div');
  nameDiv.classList.add('name');
  nameDiv.textContent = message.name;
  messageArea.appendChild(nameDiv);

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.textContent = message.message;
  messageArea.appendChild(messageDiv);
});
