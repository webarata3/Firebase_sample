'use strict';

class SnackBar extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
<style>
:host {
  --snack-bar-height: 60px;

  display: none;
  background-color: #333;
  color: #fff;
  position: fixed;
  padding: 10px;
  z-index: 1;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: var(--snack-bar-height);
}

:host(.show) {
  display: flex;
  align-items: center;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@keyframes fadein {
  from {
    bottom: calc(-1 * var(--snack-bar-height));
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
    bottom: calc(-1 * var(--snack-bar-height));
  }
}
</style>
<div id="message"></div>
`;
  }

  static get observedAttributes() {
    return ['message', 'snack-bar-height'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'message':
        this.shadowRoot.getElementById('message').textContent = newVal;
        break;
      case 'snack-bar-height':
        this.style.setProperty('--snack-bar-height', newVal + 'px');
        break;
    }
  }
}

customElements.define('snack-bar', SnackBar);

let timer;
const snackBarEl = document.querySelector('snack-bar');

function snackBar(message) {
  if (!snackBarEl) return;

  snackBarEl.setAttribute('message', message);
  snackBarEl.classList.add('show');

  // timeoutが設定されてたら、消して設定し直す
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    snackBarEl.classList.remove('show');
  }, 3000);
}
