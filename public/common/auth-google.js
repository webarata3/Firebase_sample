'use strict';

class AuthGoogle extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
<style>
.auth_button {
  background-color: #fff;
  border: 1px solid var(--blue);
  border-radius: 5px;
  color: var(--blue);
  padding: 4px 8px;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  outline: none;
}

.auth_button:hover {
  background-color: var(--blue);
  color: #fff;
}

#profileImage {
  width: 32px;
  height: 32px;
  background-size: 32px;
  border-radius: 16px;
}

/*
 * flex-boxを指定していると、hidden属性が効かない
 * そのため、class="hidden"を付けてhidden属性の代わりにする
 * https://stackoverflow.com/questions/23772673/hidden-property-does-not-work-with-flex-box
 */
#loaderArea {
  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;
}

#loaderArea.hidden {
  display: none;
}

#loaderArea > div {
  text-align: center;
}

/* ぐるぐる https://codelabs.developers.google.com/codelabs/your-first-pwapp-ja/#0 */

.loader #spinner {
  box-sizing: border-box;
  stroke: #fff;
  stroke-width: 3px;
  transform-origin: 50%;
  animation: line 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite, rotate 1.6s linear infinite;
}

#loaderMessage {
  color: #fff;
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(450deg);
  }
}

@keyframes line {
  0% {
    stroke-dasharray: 2, 85.964;
    transform: rotate(0);
  }
  50% {
    stroke-dasharray: 65.973, 21.9911;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 2, 85.964;
    stroke-dashoffset: -65.973;
    transform: rotate(90deg);
  }
}

.loginUser {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: 10px;
}

.loginUser > div:not(:last-child) {
  margin-right: 10px;
}
</style>
  <div id="loaderArea">
   <div>
    <div class="loader">
     <svg viewBox="0 0 32 32" width="32" height="32">
      <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
     </svg>
    </div>
    <div id="loaderMessage">読み込み中...</div>
   </div>
  </div>
  <div class="loginUser">
   <div id="profileImage"></div>
   <div id="displayName"></div>
   <div>
    <button id="loginButton" class="auth_button">Googleでログイン</button>
    <button id="logoutButton" class="auth_button" hidden>ログアウト</button>
   </div>
  </div>
`;

    const loaderArea = this.shadowRoot.getElementById('loaderArea');
    const loginButton = this.shadowRoot.getElementById('loginButton');
    const logoutButton = this.shadowRoot.getElementById('logoutButton');
    const displayName = this.shadowRoot.getElementById('displayName');
    const profileImage = this.shadowRoot.getElementById('profileImage');

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
  }
}

customElements.define('auth-google', AuthGoogle);
