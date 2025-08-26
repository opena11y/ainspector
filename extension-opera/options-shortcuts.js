/* options-shortcuts.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getOptions,
  saveOptions,
  resetShortcutOptions
} from './storage.js';

import {
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[options-shortcuts]', false);
debug.flag = false;

const optionsShortcutsTemplate = document.createElement('template');
optionsShortcutsTemplate.innerHTML = `
  <form class="options">

    <label>
      <input type="checkbox"
             data-option="shortcutsEnabled"/>
      <span data-i18n="options_shortcuts_enable">
        Enable keyboard shortcuts
      </span>
    </label>

    <table class="shortcuts">
      <thead>
        <tr>
          <th data-i18n="options_shortcuts_heading_shortcuts">
            Shortcut
          </th>
          <th data-i18n="options_shortcuts_heading_actions">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <kbd data-i18n="options_shortcuts_backspace">
              Backspace
            </kbd>/<br/><kbd data-i18n="options_shortcuts_delete">
              Delete
            </kbd>
          </td>
          <td>
            <div class="nofeedback"
              data-i18n="options_shortcuts_back_button">
              Activates Back button.
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <input type="text"
                   size="1"
                   data-option="shortcutCopy"
                   id="shortcut-copy"
                   aria-describedby="shortcut-copy-desc">
            <div class="feedback shortcut">
              <img src="icons/error-icon-15.png"
                   alt=""/>
              <span id="shortcut-copy-desc"
                    role="status">
              </span>
            </div>
          </td>
          <td>
            <label for="shortcut-copy"
                   data-i18n="options_shortcuts_copy">
              Activates Copy button.
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <input type="text"
                   size="1"
                   data-option="shortcutExport"
                   id="shortcut-export"
                   aria-describedby="shortcut-export-desc">
            <div class="feedback shortcut">
              <img src="icons/error-icon-15.png"
                   alt=""/>
              <span id="shortcut-export-desc"
                    role="status">
              </span>
            </div>
          </td>
          <td>
            <label for="shortcut-export"
                   data-i18n="options_shortcuts_export">
              Activates Export button.
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <input type="text"
                   size="1"
                   data-option="shortcutRerun"
                   id="shortcut-rerun"
                   aria-describedby="shortcut-rerun-desc">
            <div class="feedback shortcut">
              <img src="icons/error-icon-15.png"
                   alt=""/>
              <span id="shortcut-rerun-desc"
                    role="status">
              </span>
            </div>
          </td>
          <td>
            <label for="shortcut-rerun"
                   data-i18n="options_shortcuts_rerun">
              Activates Rerun Evaluation button.
            </label>
          </td>
        </tr>
        <tr>
          <td>
            <input type="text"
                   size="1"
                   data-option="shortcutViews"
                   id="shortcut-views"
                   aria-describedby="shortcut-views-desc">
            <div class="feedback shortcut">
              <img src="icons/error-icon-15.png"
                   alt=""/>
              <span id="shortcut-views-desc"
                    role="status">
              </span>
            </div>
          </td>
          <td>
            <label for="shortcut-views"
                   data-i18n="options_shortcuts_view">
             Activates View button.
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="note"
       data-i18n="options_shortcuts_note">
       Note: Leaving the shortcut key value empty disables the shortcut.
    </p>

    <button id="button-reset"
            type="reset"
            data-i18n="options_reset_shortcut_defaults_button">
            Reset Shortcut Defaults
    </button>

  </form>
`;

class OptionsShortcuts extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsShortcuts = this;

    const optionsShortcutsClone = optionsShortcutsTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsShortcutsClone);

    // Use external CSS stylesheets
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'base.css');
    this.shadowRoot.appendChild(link);

    const linkNode = document.createElement('link');
    linkNode.rel = 'stylesheet';
    linkNode.href = 'options.css';
    this.shadowRoot.appendChild(linkNode);

    setI18nLabels(this.shadowRoot, debug.flag);

    this.formControls =  Array.from(this.shadowRoot.querySelectorAll('[data-option]'));

    debug.flag && debug.log(`[formControls]: ${this.formControls.length}`);

    this.updateOptions();

    this.shadowRoot.querySelector('#button-reset').addEventListener('click', () => {
      resetShortcutOptions().then(this.updateOptions.bind(this));
    });

    optionsShortcuts.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsShortcuts.onFocus);
      input.addEventListener('blur',   optionsShortcuts.onBlur);
      input.addEventListener('change', optionsShortcuts.onChange.bind(optionsShortcuts));
      input.parentNode.addEventListener('pointerover',   optionsShortcuts.onPointerover);
    });

    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  updateOptions () {
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && debug.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);

        const option = input.getAttribute('data-option');

        if (input.type === 'checkbox') {
          input.checked = options[option];
        }
        else {
          if (input.type === 'radio') {
            const checkedValue = input.getAttribute('data-option-checked');
            const value = options[option] ? 'true' : 'false';
            input.checked = checkedValue === value;
          }
          else {
            input.value = options[option];
          }
        }
      });
    });
  }

  saveShortcutsOptions () {
   const formControls = this.formControls;
  getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && debug.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'checkbox') {
          options[option] = input.checked;
        }
        else {
          if (input.type === 'radio') {
            if (input.checked) {
              const checkedValue = input.getAttribute('data-option-checked');
              options[option] = checkedValue === 'true';
            }
          }
          else {
            if (input.type === 'text') {
             options[option] = input.value;
            }
          }
        }
      });
      saveOptions(options);
    });
  }

  // Event handlers

  onFocus (event) {
    const pNode = event.currentTarget.parentNode;
    pNode.classList.add('focus');
    const rect = pNode.querySelector('span').getBoundingClientRect();
    pNode.style.width = (rect.width + 40) + 'px';
  }

  onPointerover (event) {
    const pNode = event.currentTarget;
    const rect = pNode.querySelector('span').getBoundingClientRect();
    pNode.style.width = (rect.width + 40) + 'px';
  }

  onBlur (event) {
    event.currentTarget.parentNode.classList.remove('focus');
  }

  onChange () {
    debug.flag && debug.log(`[saveOptions]`);
    this.saveShortcutsOptions();
  }

  onResize() {
    this.shadowRoot.querySelectorAll('input[type=radio], input[type=checkbox]').forEach( input => {
      const node = input.parentNode;
      if (node) {
        node.style.width = 'auto';
      }
    });
  }
}

window.customElements.define("options-shortcuts", OptionsShortcuts);
