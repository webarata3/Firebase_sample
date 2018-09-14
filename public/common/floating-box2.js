'use strict';

class FloatingBox2 extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
<style>
* {
  box-sizing: border-box;
}

/* https://www.pc-weblog.com/floating-label/ */

:host {
  --font-size: 14px;
  display: inline-block;
}

.inputArea {
  position: relative;
  margin-top: calc(var(--font-size) - 9px);
  margin-bottom: 0;
  border: 1px solid #666;
  display: inline-block;
}

input {
  padding: calc(var(--font-size) - 5px) 6px 8px;
  font-size: var(--font-size);
  border: none;
  outline: none;
  box-sizing: border-box;
  width: 100%;
}

label {
  position: absolute;
  top: 50%;
  left: 10px;
  font-size: calc(var(--font-size) - 2px);
  color: #666;
  transform: translate(0, -50%);
  cursor: text;
}

input:focus + label, input:not(:placeholder-shown) + label {
  top: 0;
  left: 10px;
  font-size: calc(var(--font-size) - 4px);
  transition: 0.5s;
  background: #fff;
  color: #1869fe;
  padding: 0 0.2rem;
}

input:not(:placeholder-shown) + label {
  color: #666;
}

/* 入力中のみ青色 */
input:focus + label {
  color: #1869fe;
  font-weight: bold;
}

.errorMessage {
  color: #f00;
  font-size: calc(var(--font-size) - 4px);
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
}
</style>
<div class="inputArea">
 <input type="text" placeholder="&nbsp;">
 <label></label>
</div>
<div class="errorMessage">&nbsp;</div>
`;

    this.style.setProperty('--font-size', '14px');

    // ラベルをクリックしたときにフォーカスが当たるようにする。
    const input = shadowRoot.querySelector('input');

    this.addEventListener('click', (event) => {
      input.focus();
    });

    // エラーメッセージのサイズを入力欄に合わせる
    const inputArea = shadowRoot.querySelector('.inputArea');
    const errorMessage = shadowRoot.querySelector('.errorMessage');
    errorMessage.style.width = inputArea.clientWidth + 'px';
  }

  static get observedAttributes() {
    return ['label', 'size', 'font-size', 'error-message'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'label':
        this.shadowRoot.querySelector('label').textContent = newVal;
        break;
      case 'font-size':
        const fontSize = newVal || '14';
        this.style.setProperty('--font-size', fontSize + 'px');
        break;
      case 'size':
        this.shadowRoot.querySelector('input').setAttribute('size', newVal);
        break;
      case 'error-message':
        this.shadowRoot.querySelector('.errorMessage').textContent = newVal;
        break;
    }
  }
}

customElements.define('floating-box2', FloatingBox2);
