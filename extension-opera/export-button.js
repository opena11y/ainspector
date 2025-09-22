/* export-button.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getOptions,
  saveOptions
} from '../../storage.js';

import {
  isCharacterAllowed,
  validatePrefix
} from '../../validate.js';

import {
  getMessage,
  isOverElement,
  setI18nLabels
} from './utils.js';

import {
  MAX_PREFIX_LENGTH
} from './constants.js';

// Constants

const debug = new DebugLogging('[export-button]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
    <div class="export-button">
      <button id="export-data"
        aria-haspop="true"
        aria-controls="dialog"
        aria-live="off"
        data-i18n="export_data_button_label">
        Export
      </button>

      <dialog
        class="export"
        aria-labelledby="title">
        <div class="header">
          <div id="title"
               data-i18n="export_data_dialog_title">
          </div>
          <button id="close-button"
                  data-i18n-aria-label="cancel_button_label"
                  tabindex="-1">
            ✕
          </button>
        </div>
        <div class="content">
          <fieldset>
            <legend data-i18n="options_data_export_format_legend">
              Export Format
            </legend>
            <label>
              <input type="radio"
                     name="export-format"
                     id="options-export-csv"/>
              <span data-i18n="options_data_export_csv_label">
                CSV
              </span>
            </label>
            <label>
              <input type="radio"
                     name="export-format"
                     id="options-export-json"/>
              <span data-i18n="options_data_export_json_label">
                JSON
              </span>
            </label>
          </fieldset>

          <fieldset>
            <legend data-i18n="options_data_export_filename_legend">
              Filename Options
            </legend>

            <label class="input"
                  data-i18n="options_data_export_prefix_label"
                  for="options-export-prefix">
                  Export File Prefix
            </label>

            <div class="input">
              <input id="options-export-prefix"
                     type="text" size="20"
                     aria-describedby="option-export-prefix-desc options-export-prefix-note" />
              <div class="feedback prefix">
                <img src="../icons/error-icon-15.png" alt=""/>
                <span id="options-export-prefix-desc" aria-live="assertive"></span>
              </div>
            </div>
            <div class="note"
                 data-i18nid="options_data_export_prefix_note_desc">
            </div>

            <label for="options-export-index"
                   data-i18n="options_data_export_index_label">
              File name index
            </label>

            <div class="input">
              <input id="options-export-index"
                     type="number"
                     min="1"
                     data-option="filenameIndex"/>
            </div>

          </fieldset>

          <label>
            <input type="checkbox"
                  id="options-export-prompt">
              <span data-i18n="options_data_export_prompt_label">
                Do not prompt me for export options.
              </span>
          </label>
        </div>
        <div class="buttons">
          <button id="cancel-button"
                  data-i18n="cancel_button_label">
            Cancel
          </button>
          <button id="ok-button"
                  data-i18n="ok_button_label">
            OK
          </button>
        </div>
      </dialog>
    </div>
`;

export default class ExportButton extends HTMLElement {
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
    this.promptForDelay = true;
    this.delayValue = 5;
    this.timerValue = 0;

    this.exportButton  = this.shadowRoot.querySelector('#export-data');
    this.exportButton.addEventListener('click', this.handleExportButtonClick.bind(this));

    this.dialog = this.shadowRoot.querySelector('dialog');
    this.dialog.addEventListener('keydown', this.handleDialogKeydown.bind(this));

    this.exportCSV      = this.shadowRoot.querySelector('input[id="options-export-csv"]');
    this.exportCSV.addEventListener('keydown', this.handleFirstControlKeydown.bind(this));
    this.exportCSV.addEventListener('focus', this.handleFocus.bind(this));
    this.exportCSV.addEventListener('blur', this.handleBlur.bind(this));

    this.exportJSON     = this.shadowRoot.querySelector('input[id="options-export-json"]');
    this.exportJSON.addEventListener('keydown', this.handleFirstControlKeydown.bind(this));
    this.exportJSON.addEventListener('focus', this.handleFocus.bind(this));
    this.exportJSON.addEventListener('blur', this.handleBlur.bind(this));

    this.exportPrefix   = this.shadowRoot.querySelector('#options-export-prefix');
    this.exportPrefix.addEventListener('keydown', this.handleKeydownValidatePrefix.bind(this));
    this.exportPrefix.addEventListener('keyup', this.handleKeyupValidatePrefix.bind(this));
    this.exportPrefix.addEventListener('blur', this.hidePrefixError.bind(this));

    this.exportPrefixDesc = this.shadowRoot.querySelector('#options-export-prefix-desc');

    this.exportIndex = this.shadowRoot.querySelector('#options-export-index');
    this.exportIndex.addEventListener('focus', this.handleFocus.bind(this));
    this.exportIndex.addEventListener('blur', this.handleBlur.bind(this));

    this.exportPrompt   = this.shadowRoot.querySelector('#options-export-prompt');
    this.exportPrompt.addEventListener('focus', this.handleFocus.bind(this));
    this.exportPrompt.addEventListener('blur', this.handleBlur.bind(this));

    this.closeButton = this.shadowRoot.querySelector('#close-button');
    this.closeButton.addEventListener('click', this.handleCancelButtonClick.bind(this));

    this.cancelButton = this.shadowRoot.querySelector('#cancel-button');
    this.cancelButton.addEventListener('click', this.handleCancelButtonClick.bind(this));

    this.okButton = this.shadowRoot.querySelector('#ok-button');
    this.okButton.addEventListener('click', this.handleOkButtonClick.bind(this));
    this.okButton.addEventListener('keydown', this.handleOkButtonKeydown.bind(this));

    window.addEventListener(
      'pointerdown',
      this.handleBackgroundPointerdown.bind(this),
      true
    );

    setI18nLabels(this.shadowRoot, debug.flag);
  }

  set disabled (value) {
    this.exportButton.disabled = value;
  }

  get disabled () {
    return this.exportButton.disabled;
  }

  setActivationCallback (callback) {
    this.callback = callback;
  }

  tryActivationCallback () {
    if (this.callback) {
      this.callback();
    }
  }

  openDialog () {
    this.dialog.showModal();
    this.okButton.focus();
  }

  closeDialog (value) {
    this.dialog.close(value);
    this.exportButton.focus();
  }

  hidePrefixError () {
    this.exportPrefixDesc.textContent = '';
    this.exportPrefixDesc.parentNode.classList.remove('show');
  }

  showPrefixError(message) {
    this.exportPrefixDesc.textContent = message;
    this.exportPrefixDesc.parentNode.classList.add('show');
  }

  handleKeydownValidatePrefix (event) {
    this.hidePrefixError();
    const key = event.key;
    if (!isCharacterAllowed(key)) {
      this.showPrefixError(getMessage('options_data_export_prefix_error_char_not_allowed', key));
      event.stopPropagation();
      event.preventDefault();
    } else {
      if ((key.length === 1) &&
          (this.exportPrefixInput.value.length === MAX_PREFIX_LENGTH)) {
        this.showPrefixError(getMessage('options_data_export_prefix_error_to_long', MAX_PREFIX_LENGTH.toString()));
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }

  handleKeyupValidatePrefix () {
    const value = validatePrefix(this.exportPrefix.value);
    if (value !== this.exportPrefix.value) {
      if (this.exportPrefix.value.length >= MAX_PREFIX_LENGTH) {
        this.showPrefixError(getMessage('options_data_export_prefix_error_to_long', MAX_PREFIX_LENGTH.toString()));
      }
    }
    this.exportPrefix.value = value;
  }

  handleExportButtonClick () {
    getOptions().then( (options) => {
      if (options.promptForExportOptions) {
        this.exportCSV.checked     = options.exportFormat === 'CSV';
        this.exportJSON.checked    = options.exportFormat === 'JSON';
        this.exportPrefix.value    = options.filenamePrefix;
        this.exportIndex.value     = options.filenameIndex;
        this.exportPrompt.checked  = !options.promptForExportOptions;
        this.openDialog();
      } else {
        this.tryActivationCallback();
      }
    });
  }

  handleCancelButtonClick () {
    this.closeDialog('cancel');
  }

  handleOkButtonClick () {
    this.closeDialog('export');
    const options = {
      exportFormat: (this.exportCSV.checked ? 'CSV' :    'JSON'),
      filenamePrefix: validatePrefix(this.exportPrefix.value),
      filenameIndex: this.exportIndex.value,
      promptForExportOptions: !this.exportPrompt.checked
    };
    saveOptions(options).then(this.tryActivationCallback(options));
  }

  handleDialogKeydown(event) {
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
      this.closeDialog('cancel');
    }
  }

  handleFirstControlKeydown(event) {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.key === 'Tab' && event.shiftKey) {
        this.okButton.focus();
        event.stopPropagation();
        event.preventDefault();
      }
  }

  handleOkButtonKeydown(event) {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.key === 'Tab' && !event.shiftKey) {
        if (this.exportCSV.checked) {
          this.exportCSV.focus();
        } else {
          this.exportJSON.focus();
        }
        event.stopPropagation();
        event.preventDefault();
      }
  }

  handleBackgroundPointerdown(event) {
    if (!isOverElement(this.dialog, event.clientX, event.clientY)) {
      this.closeDialog('cancel');
    }
  }

  handleFocus (event) {
    const tgt = event.currentTarget;
    tgt.parentNode.classList.add('focus');
  }

  handleBlur (event) {
    const tgt = event.currentTarget;
    tgt.parentNode.classList.remove('focus');
  }
}

window.customElements.define("export-button", ExportButton);
