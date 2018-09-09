'use strict';

const nameEl = document.getElementById('name').shadowRoot.querySelector('input');
const messageEl = document.getElementById('message').shadowRoot.querySelector('input');
const chatList = document.getElementById('chatList');

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

  const template = document.getElementById('messageTemplate');
  template.content.querySelector('.name').textContent = message.name;
  template.content.querySelector('.message').textContent = message.message;

  const clone = document.importNode(template.content, true);
  clone.querySelector('.deleteButton').addEventListener('click', (event) => {
    event.preventDefault();
    const deleteEl = event.currentTarget.parentNode;
    deleteEl.parentNode.removeChild(deleteEl);

    messagesRef.child(data.key).remove();
  });

  chatList.insertBefore(clone, chatList.firstChild);
});
