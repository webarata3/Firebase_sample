class SnackBar extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
<style>
:host {
  display: flex;
  align-items: center;
  visibility: hidden;
  background-color: #333;
  color: #fff;
  position: fixed;
  padding: 10px;
  z-index: 1;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 60px;
}

:host(.show) {
  visibility: visible;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@keyframes fadein {
  from {
    bottom: -60px;
  }
  to {
    bottom: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 0;
  }
  to {
    bottom: -60px;
  }
}
</style>
<div id="message"></div>
`;
  }

  static get observedAttributes() {
    return ['message'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.shadowRoot.getElementById('message').textContent = this.getAttribute('message');
    this.textContent = this.getAttribute('message');
  }
}

customElements.define('snack-bar', SnackBar);

let timer;
const snackbarEl = document.getElementById('snackbar');

function snackbar(message) {
  snackbarEl.setAttribute('message', message);
  snackbarEl.classList.add('show');

  // timeoutが設定されてたら、消して設定し直す
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    snackbarEl.classList.remove('show');
  }, 3000);
}
