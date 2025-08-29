/* rerun-evaluation-button.js */

// imports

import DebugLogging  from './debug.js';

import {
  getOptions,
  saveOptions
} from '../../storage.js';

import {
  getMessage,
  isOverElement,
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[rerun-evaluation-button]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
    <div class="rerun-evaluation-button">
      <button id="rerun"
        aria-haspop="true"
        aria-controls="dialog"
        aria-live="off"
        data-i18n="rerun_eval_button_label">
        Rerun Evaluation
      </button>

      <dialog
        class="rerun"
        aria-labelledby="title">
        <div class="header">
          <h2 id="title"
              data-i18n="rerun_eval_dialog_title">
          </h2>
          <button id="close-button"
                  data-i18n-aria-label="close_button_label"
                  tabindex="-1">
            ✕
          </button>
        </div>

        <div class="content">
          <div class="select">
            <label for="select"
                   data-i18n="rerun_eval_select_label">
            </label>
            <select id="select">
              <option value="5" selected>5 sec.</option>
              <option value="10">10 sec.</option>
              <option value="20">20 sec.</option>
              <option value="40">40 sec.</option>
              <option value="60">1 min.</option>
            </select>
          </div>
          <label class="checkbox">
            <input id="prompt-for-delay" type="checkbox">
            <span data-i18n="rerun_eval_prompt_for_delay_label"></span>
          </label>
        </div>
        <div class="buttons">
          <button id="cancel-button"
                  data-i18n="cancel_button_label">
            Cancel
          </button>
          <button id="ok-button"
                  data-i18n="ok_button_label">
            Ok
          </button>
        </div>
      </dialog>
    </div>
`;

export default class RerunEvaluationButton extends HTMLElement {
  constructor () {

    super();

    this.attachShadow({ mode: 'open' });

    // Use external CSS style sheets
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './base.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './dialog.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './dialog-content.css');
    this.shadowRoot.appendChild(link);

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Get references

    this.callback = null;
    this.timerValue = 0;

    setI18nLabels(this.shadowRoot, debug.flag);

    this.rerunButton  = this.shadowRoot.querySelector('#rerun');
    this.rerunButton.addEventListener('click', this.onRerunButtonClick.bind(this));

    this.dialog = this.shadowRoot.querySelector('dialog');
    this.dialog.addEventListener('keydown', this.onDialogKeydown.bind(this));

    this.select = this.shadowRoot.querySelector('select');
    this.select.addEventListener('keydown', this.onSelectKeydown.bind(this));
    this.select.addEventListener('focus', this.onFocus.bind(this));
    this.select.addEventListener('blur', this.onBlur.bind(this));

    this.checkbox = this.shadowRoot.querySelector('#prompt-for-delay');
    this.checkbox.addEventListener('focus', this.onFocus.bind(this));
    this.checkbox.addEventListener('blur', this.onBlur.bind(this));

    this.closeButton = this.shadowRoot.querySelector('#close-button');
    this.closeButton.addEventListener('click', this.onCancelButtonClick.bind(this));

    this.cancelButton = this.shadowRoot.querySelector('#cancel-button');
    this.cancelButton.addEventListener('click', this.onCancelButtonClick.bind(this));

    this.okButton = this.shadowRoot.querySelector('#ok-button');
    this.okButton.addEventListener('click', this.onOkButtonClick.bind(this));
    this.okButton.addEventListener('keydown', this.onOkButtonKeydown.bind(this));

    window.addEventListener(
      'pointerdown',
      this.onBackgroundPointerdown.bind(this),
      true
    );

  }

  set disabled (value) {
    this.rerunButton.disabled = value;
  }

  get disabled () {
    return this.rerunButton.disabled;
  }

  setActivationCallback (callback) {
    this.callback = callback;
  }

  openDialog () {
    debug.log(`[openDialog]`);
    getOptions().then( (options) => {
      this.checkbox.checked = !options.rerunDelayEnabled;
      for (let i = 0; i < this.select.options.length; i += 1) {
        let option = this.select.options[i];
        if (option.value === options.rerunDelayValue) {
          option.selected = true;
        }
      }
      debug.log(`[openDialog]: showModal`);
      this.dialog.showModal();
      this.okButton.focus();
      this.rerunButton.setAttribute('aria-expanded', 'true');
    });
  }

  closeDialog () {
    this.dialog.close();
  }

  checkTimeout() {
    if (this.timerValue < 1) {
      this.rerunButton.setAttribute('aria-live', 'off');
      this.rerunButton.textContent = getMessage('rerun_eval_button_label');
      this.callback();
    } else {
      this.rerunButton.textContent = this.timerValue + ' seconds';
      this.timerValue -= 1;
      setTimeout(this.checkTimeout.bind(this), 1000);
    }
  }

  delayedRerun () {
    getOptions().then( (options) => {
      this.timerValue = parseInt(options.rerunDelayValue);
      this.checkTimeout();
    });
  }

  onRerunButtonClick () {
    getOptions().then( (options) => {
      if (options.rerunDelayEnabled) {
        this.rerunButton.setAttribute('aria-live', 'polite');
        this.openDialog();
      } else {
        this.callback();
      }

    });
  }

  onCancelButtonClick () {
    this.closeDialog();
  }

  onOkButtonClick () {
    getOptions().then( (options) => {
      options.rerunDelayValue = this.select.value;
      options.rerunDelayEnabled = !this.checkbox.checked;
      saveOptions(options).then( () => {
        this.closeDialog();
        this.delayedRerun();        
      });
    });
  }

  onSelectKeydown(event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if ((event.currentTarget === event.target) &&
        (event.key === 'Tab') &&
        event.shiftKey) {
      this.okButton.focus();
      event.stopPropagation();
      event.preventDefault();
    }
  }

  onDialogKeydown(event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if ((event.currentTarget === event.target) &&
        (event.key === 'Tab') &&
        event.shiftKey) {
      this.okButton.focus();
      event.stopPropagation();
      event.preventDefault();
    }

    if (event.key === 'Escape') {
      this.closeDialog();
    }
  }

  onOkButtonKeydown(event) {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.key === 'Tab' && !event.shiftKey) {
        this.select.focus();
        event.stopPropagation();
        event.preventDefault();
      }
  }

  onBackgroundPointerdown(event) {
    if (!isOverElement(this.dialog, event.clientX, event.clientY)) {
      this.closeDialog();
    }
  }

  onFocus (event) {
    const tgt = event.currentTarget;
    tgt.parentNode.classList.add('focus');
  }

  onBlur (event) {
    const tgt = event.currentTarget;
    tgt.parentNode.classList.remove('focus');
  }

}

window.customElements.define("rerun-evaluation-button", RerunEvaluationButton);

