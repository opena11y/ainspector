/* copy-button.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getMessage
} from './utils.js';

// Constants

const debug = new DebugLogging('copy-button', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <button>
    <img class="copy"   src="../icons/icon-copy.png"  alt="">
    <img class="copied" src="../icons/icon-check.png" alt="">
  </button>
`;

export default class CopyButton extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Use external CSS stylesheet
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './copy-button.css');
    this.shadowRoot.appendChild(link);

    // Get constants
    this.copyLabel   = getMessage('copyLabel');
    this.copiedLabel = getMessage('copySuccessLabel');
    this.failedLabel = getMessage('copyFailedLabel');

    // Get references
    this.copyButton  = this.shadowRoot.querySelector('button');
    this.copyButton.ariaLabel = this.copyLabel;
    this.copyButton.addEventListener('click', this.onCopyButtonClick.bind(this));
    this.getTextFunct = false;

  }

  set disabled (value) {
    this.copyButton.disabled = value;
  }

  get disabled () {
    return this.copyButton.disabled;
  }

  set title (value) {
    this.copyButton.title = value;
  }

  get title () {
    return this.copyButton.title;
  }

  set ariaLabel (value) {
    this.copyButton.setAttribute('aria-label', value);
  }

  get ariaLabel () {
    return this.copyButton.getAttribute('aria-label');
  }

  click () {
    this.copyButton.click();
  }

  setGetTextFunct (getTextFunct) {
    this.getTextFunct = getTextFunct;
  }

  getText () {
    if (typeof this.getTextFunct === 'function') {
      return this.getTextFunct();
    }
    return '';
  }

  restoreCopyLabel () {
    this.copyButton.ariaLabel = this.copyLabel;
    this.copyButton.classList.remove('copied');
    this.copyButton.classList.remove('failed');
  }

  onCopyButtonClick () {
    let text = '';

    if (this.getText) {
      text = this.getText();
    }

    if (text) {
      navigator.clipboard.writeText(text).then(
        () => {
          this.copyButton.ariaLabel = this.copiedLabel;
          this.copyButton.classList.add('copied');
        },
        () => {
          this.copyButton.ariaLabel = this.failedLabel;
          this.copyButton.classList.add('failed');
        }
      );
    }
    else {
      this.copyButton.ariaLabel = this.failedLabel;
      this.copyButton.classList.add('failed');
    }
    setTimeout(this.restoreCopyLabel.bind(this), 1500);
  }
}

window.customElements.define("copy-button", CopyButton);
