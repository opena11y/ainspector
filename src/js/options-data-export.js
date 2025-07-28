/* options-data-export.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getOptions,
  saveOptions,
  resetDefaultOptions
} from './storage.js';

import {
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[options-export]', false);
debug.flag = true;

const optionsDataExportTemplate = document.createElement('template');
optionsDataExportTemplate.innerHTML = `
  <form>
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
              aria-describedby="options-export-prefix-desc options-export-prefix-note"/>
        <span class="feedback prefix">
          <img src="icons/error-icon-15.png" alt=""/>
          <span id="options-export-prefix-desc" aria-live="assertive"></span>
        </span>
      </div>
      <div class="desc"
           data-i18n="options_data_export_prefix_note_desc">
        Note: Prefix cannot contain spaces or <code>&lt;&gt;:"/\|?*[]</code> characters.
      </div>

      <label>
        <input type="number"
               min="1"
               data-option="filenameIndex"/>
        <span data-i18n="options_data_export_index_label">
          File name index
        </span>
      </label>

    </fieldset>

    <button id="button-reset"
            type="reset"
            data-i18n="options_reset_defaults_button">
            Reset Defaults
    </button>

  </form>
`;

class OptionsDataExport extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsDataExport.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsDataExport = this;

    const optionsDataExportClone = optionsDataExportTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsDataExportClone);

    // Add stylesheet
    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = 'options.css';
    this.shadowRoot.appendChild(linkNode);

    setI18nLabels(this.shadowRoot, debug.flag);

    this.formControls =  Array.from(this.shadowRoot.querySelectorAll('[data-option]'));

    debug.flag && debug.log(`[formControls]: ${this.formControls.length}`);

    this.updateOptions();

    getNode('button-reset').addEventListener('click', () => {
      resetDefaultOptions().then(this.updateOptions.bind(this));
    });

    optionsDataExport.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsDataExport.onFocus);
      input.addEventListener('blur',   optionsDataExport.onBlur);
      input.addEventListener('change', optionsDataExport.onChange.bind(optionsDataExport));
    });
  }

  updateOptions () {
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);

        const option = input.getAttribute('data-option');

        if (input.type === 'checkbox') {
          input.checked = options[option];
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
        debug.flag && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'checkbox') {
          options[option] = input.checked;
        }
        else {
          if (input.type === 'radio') {
            if (input.checked) {
              options[option] = input.value;
            }
          }
          else {
           options[option] = input.value;
          }
        }
      });
      saveOptions(options);
    });
  }

  // Event handlers

  onFocus (event) {
    const node = event.currentTarget.parentNode;
    const rect = node.querySelector('span').getBoundingClientRect();
    node.style.width = (rect.width + 40) + 'px';
    node.classList.add('focus');
  }

  onBlur (event) {
    event.currentTarget.parentNode.classList.remove('focus');
  }

  onChange () {
    debug && console.log(`[saveOptions]`);
    this.saveDataExportOptions();
  }

}

window.customElements.define("options-data-export", OptionsDataExport);
