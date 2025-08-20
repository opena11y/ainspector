/* options-general.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getOptions,
  saveOptions,
  resetGeneralOptions
} from './storage.js';

import {
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[options-general]', false);
debug.flag = false;

const optionsGeneralTemplate = document.createElement('template');
optionsGeneralTemplate.innerHTML = `
  <form class="options">
    <fieldset>
      <legend data-i18n="options_general_rule_results_legend">
        Rule Results
      </legend>
      <label>
        <input type="checkbox"
               data-option="resultsIncludePassNa"/>
        <span data-i18n="options_general_incl_pass_na_label">
          Include 'Pass' and 'N/A' results
        </span>
      </label>
    </fieldset>

    <fieldset>
      <legend data-i18n="option_general_rerun_evaluation_legend">'
        Rerun Evaluation' Button
      </legend>
      <label>
        <input type="radio"
               name="delay"
               value="false"
               data-option="rerunDelayEnabled"
               data-option-checked="false"/>
        <span data-i18n="options_general_no_delay_label">
          Rerun with no delay
        </span>
      </label>
      <label>
        <input type="radio"
              name="delay"
              value="true"
              data-option="rerunDelayEnabled"
               data-option-checked="true"/>
        <span data-i18n="options_general_prompt_for_delay_label">
          Prompt for delay setting
        </span>
      </label>
    </fieldset>

    <fieldset>
      <legend data-i18n="options_general_views_menu_legend">
        'Views' menu
      </legend>
      <label>
        <input type="Checkbox"
               data-option="viewsMenuIncludeGuidelines"/>
        <span id="options_general_incl_wcag_gl_label">
          Include WCAG Guidelines
        </span>
      </label>
    </fieldset>

    <button id="button-reset"
            type="reset"
            data-i18n="options_reset_general_defaults_button">
            Reset General Defaults
    </button>

  </form>
`;

class OptionsGeneral extends HTMLElement {

  constructor() {

    // Helper function
    function getNode (id) {
      return optionsGeneral.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsGeneral = this;

    const optionsGeneralClone = optionsGeneralTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsGeneralClone);

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
      resetGeneralOptions().then(this.updateOptions.bind(this));
    });

    optionsGeneral.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsGeneral.onFocus);
      input.addEventListener('blur',   optionsGeneral.onBlur);
      input.addEventListener('change', optionsGeneral.onChange.bind(optionsGeneral));
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

  saveGeneralOptions () {
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
    this.saveGeneralOptions();
  }

}

window.customElements.define("options-general", OptionsGeneral);
