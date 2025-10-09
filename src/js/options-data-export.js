/* options-data-export.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getOptions,
  saveOptions,
  resetExportOptions
} from './storage.js';

import {
  getMessage,
  setI18nLabels
} from './utils.js';

import {
  isCharacterAllowed,
  validatePrefix
} from './options-validate.js';

import {
  MAX_PREFIX_LENGTH
} from './constants.js';

// Constants

const debug = new DebugLogging('[options-export]', false);
debug.flag = false;

const optionsDataExportTemplate = document.createElement('template');
optionsDataExportTemplate.innerHTML = `
  <form class="options">
    <fieldset>
      <legend data-i18n="options_data_export_button_legend">
        Export Data Button
      </legend>
      <label>
        <input type="checkbox"
               data-option="promptForExportOptions"/>
        <span data-i18n="options_data_export_prompt_label">
          Prompt for data export options
        </span>
      </label>
    </fieldset>

    <fieldset>
      <legend data-i18n="options_data_export_format_legend">
        Export Format
      </legend>
      <label>
        <input type="radio"
               name="export-format"
               value="CSV"
               data-option="exportFormat"/>
        <span data-i18n="options_data_export_csv_label" >
          CSV
        </span>
      </label>
      <label>
        <input type="radio"
               name="export-format"
               value="JSON"
               data-option="exportFormat"/>
        <span data-i18n="options_data_export_json_label" >
          JSON
        </span>
      </label>
    </fieldset>

    <fieldset>
      <legend data-i18n="options_data_export_filename_legend">
        Filename Options
      </legend>

      <label id="options-export-prefix-label"
             for="options-export-prefix"
             data-i18n="options_data_export_prefix_label">
          Export File Prefix (up to 16 characters)
      </label>

      <div class="input">
        <input id="options-export-prefix"
              type="text"
              size="30"
              data-option="filenamePrefix"
              aria-describedby="options-export-prefix-error options-export-prefix-note"/>

        <span class="feedback prefix" role="status">
          <img src="icons/error-icon-15.png" alt="" />
          <span id="options-export-prefix-error"></span>
        </span>

      </div>

      <div class="desc">
        <span data-i18n="options_data_export_prefix_note_desc">
          Note: Prefix cannot contain spaces or the following characters
        </span>
        : <code>&lt;&gt;:"/|?*[]</code>.
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

      <label>
        <input type="checkbox"
               data-option="includeIndex"/>
        <span data-i18n="options_data_export_include_index_label">
          Include index in file name
        </span>
      </label>

      <label>
        <input type="checkbox"
               data-option="includeDateTime"/>
        <span data-i18n="options_data_export_include_date_time_label">
          Include date and time in file name
        </span>
      </label>


    </fieldset>

    <button id="button-reset"
            type="reset"
            data-i18n="options_reset_export_defaults_button">
            Reset Export Data Defaults
    </button>

  </form>
`;

class OptionsDataExport extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsDataExport = this;

    const optionsDataExportClone = optionsDataExportTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsDataExportClone);

     // Use external CSS stylesheets
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'base.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'options.css');
    this.shadowRoot.appendChild(link);

    setI18nLabels(this.shadowRoot, debug.flag);

    this.formControls =  Array.from(this.shadowRoot.querySelectorAll('[data-option]'));

    this.updateOptions();

    this.shadowRoot.querySelector('#button-reset').addEventListener('click', () => {
      resetExportOptions().then(this.updateOptions.bind(this));
    });

    this.shadowRoot.querySelectorAll('input').forEach( input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.addEventListener('focus',  optionsDataExport.handleFocus);
        input.addEventListener('blur',   optionsDataExport.handleBlur);
        input.parentNode.addEventListener('pointerover',   optionsDataExport.handlePointerover);
      }
      input.addEventListener('change', optionsDataExport.handleChange.bind(optionsDataExport));
    });

    this.exportPrefixInput = this.shadowRoot.querySelector('#options-export-prefix');
    this.exportPrefixInput.addEventListener('keydown', this.handleKeydownValidatePrefix.bind(this));
    this.exportPrefixInput.addEventListener('keyup', this.handleKeyupValidatePrefix.bind(this));

    this.exportPrefixError = this.shadowRoot.querySelector('#options-export-prefix-error');

    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  updateOptions () {
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {

        const option = input.getAttribute('data-option');

        if (input.type === 'checkbox') {
          input.checked = (option === 'promptForExportOptions') ?
                                      !options[option] :
                                      options[option];
        }
        else {
          if (input.type === 'radio') {
            input.checked = input.value === options[option];
          }
          else {
            input.value = options[option];
          }
        }
      });
    });
  }

  saveDataExportOptions () {
   const formControls = this.formControls;
  getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && debug.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'checkbox') {
          options[option] = !input.checked;
        }
        else {
          if (input.type === 'radio') {
            if (input.checked) {
              options[option] = input.value;
            }
          }
          else {
           if (option === 'filenameIndex') {
              const value = parseInt(input.value);
              if (!value || value < 1) {
                input.value = 1;
              }
           }
           options[option] = input.value;
          }
        }
      });
      saveOptions(options);
    });
  }

  hidePrefixError() {
    this.exportPrefixError.parentNode.classList.remove('show');
  }

  showPrefixError(message) {
    this.exportPrefixError.parentNode.classList.add('show');
    this.exportPrefixError.textContent = message;
  }

  // Event handlers

  handleFocus (event) {
    const pNode = event.currentTarget.parentNode;
    pNode.classList.add('focus');
    const rect = pNode.querySelector('span').getBoundingClientRect();
    pNode.style.width = (rect.width + 40) + 'px';
  }

  handlePointerover (event) {
    const pNode = event.currentTarget;
    const rect = pNode.querySelector('span').getBoundingClientRect();
    pNode.style.width = (rect.width + 40) + 'px';
  }

  handleBlur (event) {
    event.currentTarget.parentNode.classList.remove('focus');
  }

  handleChange () {
    debug.flag && debug.log(`[saveOptions]`);
    this.saveDataExportOptions();
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
    const value = validatePrefix(this.exportPrefixInput.value, MAX_PREFIX_LENGTH);
    if (value !== this.exportPrefixInput.value) {
      if (this.exportPrefixInput.value.length >= MAX_PREFIX_LENGTH) {
        this.showPrefixError(getMessage('options_data_export_prefix_error_to_long', MAX_PREFIX_LENGTH.toString()));
      }
    }
    this.exportPrefixInput.value = value;
  }

  handleResize() {
    this.shadowRoot.querySelectorAll('input[type=radio], input[type=checkbox]').forEach( input => {
      const node = input.parentNode;
      if (node) {
        node.style.width = 'auto';
      }
    });
  }

}

window.customElements.define("options-data-export", OptionsDataExport);
