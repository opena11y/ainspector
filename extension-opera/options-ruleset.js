/* options-ruleset.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getOptions,
  saveOptions,
  resetRulesetOptions
} from './storage.js';

import {
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[options-ruleset]', false);
debug.flag = false;

const optionsRulesetTemplate = document.createElement('template');
optionsRulesetTemplate.innerHTML = `
  <form class="options">
    <fieldset>
      <legend>
        <span data-i18n="options_ruleset_legend">
          Ruleset
        </span>
        <info-dialog
          data-more-info-url="https://opena11y.github.io/evaluation-library/rulesets.html">
          <span slot="title"
                data-i18n="options_info_dialog_title">
          </span>
          <div slot="content">
            <info-dialog-ruleset></info-dialog-ruleset>
          </div>
          <span slot="open-button"
               data-i18n="info_dialog_ruleset_info_button">
            Ruleset Information
          </span>
          <span slot="more-button"
               data-i18n="info_dialog_more_ruleset_info_button">
            More Ruleset Information
          </span>
        </info-dialog>
      </legend>

      <label>
        <input type="radio"
               data-option="ruleset"
               name="ruleset"
               value="WCAG22""/>
        <span data-i18n="options_ruleset_wcag_22_label">
          WCAG 2.2
        </span>
      </label>

      <label>
        <input type="radio"
               data-option="ruleset"
               name="ruleset"
               value="WCAG21""/>
        <span data-i18n="options_ruleset_wcag_21_label">
          WCAG 2.1
        </span>
      </label>

      <label>
        <input type="radio"
               data-option="ruleset"
               name="ruleset"
               value="WCAG20""/>
        <span data-i18n="options_ruleset_wcag_20_label">
          WCAG 2.0
        </span>
      </label>

      <label>
        <input type="radio"
               data-option="ruleset"
               name="ruleset"
               value="FIRSTSTEP"/>
        <span data-i18n="options_ruleset_first_step_label">
          First Step Rules
        </span>
      </label>

<!--
      <label>
        <input type="radio"
               data-option="ruleset"
               name="ruleset"
               value="AXE"/>
        <span data-i18n="options_ruleset_axe_label">
          Only Related aXe Rules
        </span>
      </label>

      <label>
        <input type="radio"
               data-option="ruleset"
               name="ruleset"
               value="WAVE"/>
        <span data-i18n="options_ruleset_wave_label">
          Only Related WAVE/popetech Rules
        </span>
      </label>
-->

    </fieldset>

    <fieldset id="level">
      <legend>
        <span data-i18n="options_ruleset_wcag_levels_legend">
          WCAG Rule Levels
        </span>
        <info-dialog
          data-more-info-url="https://www.w3.org/WAI/WCAG22/Understanding/conformance#levels">
          <span slot="title"
                data-i18n="options_info_dialog_title">
          </span>
          <div slot="content">
            <info-dialog-wcag-levels></info-dialog-wcag-levels>
          </div>
          <span slot="open-button"
               data-i18n="info_dialog_wcag_level_info_button">
            WCAG Level Information
          </span>
          <span slot="more-button"
               data-i18n="info_dialog_more_wcag_level_info_button">
            More Rule Scope Information
          </span>
        </info-dialog>
      </legend>

      <label>
        <input type="radio"
               data-option="level"
               name="level"
               value="A"/>
        <span data-i18n="options_ruleset_wcag_level_a_label">
          Level A only
        </span>
      </label>

      <label>
        <input type="radio"
               data-option="level"
               name="level"
               value="AA"/>
        <span data-i18n="options_ruleset_wcag_level_aa_label">
          Levels A and AA
        </span>
      </label>

      <label>
        <input type="radio"
               data-option="level"
               name="level"
               value="AAA"/>
        <span data-i18n="options_ruleset_wcag_level_enhanced_label">
          Levels A, AA and Enhanced Color Contrast and Enhanced Target Size rules (Level AAA)
        </span>
      </label>

    </fieldset>

    <fieldset id="scope">
      <legend>
        <span data-i18n="options_rule_scope_legend">
          Rule Scope filter
        </span>
        <info-dialog
          data-more-info-url="https://ainspector.disability.illinois.edu/concepts-and-terms/#scope">
          <span slot="title"
                data-i18n="options_info_dialog_title">
          </span>
          <div slot="content">
            <info-dialog-scopes></info-dialog-scopes>
          </div>
          <span slot="open-button"
               data-i18n="info_dialog_rule_scope_info_button">
          </span>
          <span slot="more-button"
               data-i18n="info_dialog_more_rule_scope_info_button">
          </span>
        </info-dialog>
      </legend>

      <label>
        <input type="radio"
               data-option="scopeFilter"
               name="scopeFilter"
               value="ALL"
               checked/>
        <span data-i18n="options_rule_scope_all_label">
          All rules (Element, Page, and Website scopes)
        </span>
      </label>

      <label>
        <input type="radio"
               data-option="scopeFilter"
               name="scopeFilter"
               value="PAGE"/>
        <span data-i18n="options_rule_scope_page_label">
          Page scope rules only
        </span>
      </label>


      <label>
        <input type="radio"
               data-option="scopeFilter"
               name="scopeFilter"
               value="WEBSITE"/>
          <span data-i18n="options_rule_scope_website_label">
            Website scope rules only
          </span>
      </label>
    </fieldset>


    <fieldset>
      <legend>
        <span data-i18n="options_ruleset_aria_version_legend">
          xyz
        </span>
        <info-dialog
          data-more-info-url="https://ainspector.disability.illinois.edu/concepts-and-terms/#aria">
          <span slot="title"
                data-i18n="options_info_dialog_title">
          </span>
          <div slot="content">
            <info-dialog-aria-versions></info-dialog-aria-versions>
          </div>
          <span slot="open-button"
                data-i18n="info_dialog_aria_version_info_button">
          </span>
          <span slot="more-button"
                data-i18n="info_dialog_more_aria_version_info_button">
          </span>
        </info-dialog>
      </legend>

      <label>
        <input type="radio"
               data-option="ariaVersion"
               name="aria"
               value="ARIA12"/>
          <span data-i18n="options_ruleset_aria_12_label">
          </span>
      </label>

      <label>
        <input type="radio"
               data-option="ariaVersion"
               name="aria"
               value="ARIA13"/>
          <span data-i18n="options_ruleset_aria_13_label">
          </span>
      </label>
    </fieldset>

    <button id="button-reset"
            type="reset"
            data-i18n="options_reset_ruleset_defaults_button">
            Reset Ruleset Defaults
    </button>

  </form>
`;

class OptionsRuleset extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsRuleset = this;

    const optionsRulesetClone = optionsRulesetTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsRulesetClone);

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

    this.firstStepRadioButton   = this.shadowRoot.querySelector('[value="FIRSTSTEP');
    this.relatedAxeRadioButton  = this.shadowRoot.querySelector('[value="AXE');
    this.relatedWaveRadioButton = this.shadowRoot.querySelector('[value="WAVE');

    this.levelFieldset = this.shadowRoot.querySelector('#level');
    this.scopeFieldset = this.shadowRoot.querySelector('#scope');

    this.updateOptions();

    this.shadowRoot.querySelector('#button-reset').addEventListener('click', () => {
      resetRulesetOptions().then(this.updateOptions.bind(this));
    });

    optionsRuleset.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsRuleset.handleFocus);
      input.addEventListener('blur',   optionsRuleset.handleBlur);
      input.addEventListener('change', optionsRuleset.handleChange.bind(optionsRuleset));

      input.parentNode.addEventListener('pointerover',   optionsRuleset.handlePointerover);

    });

    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  setDisabled () {
    const disable = this.firstStepRadioButton.checked ||
                    this.relatedAxeRadioButton.checked ||
                    this.relatedWaveRadioButton.checked;

    this.levelFieldset.disabled = disable;
    this.scopeFieldset.disabled = disable;
  }

  updateOptions () {
    const formControls = this.formControls;

    getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);

        if (input.type === 'checkbox') {
          input.checked = options.displayOption === 'popup-border';
        }
        else {
          if (input.type === 'radio') {
            input.checked = input.value === options[input.getAttribute('data-option')];
          }
          else {
            input.value = options[input.getAttribute('data-option')];
          }
        }
      });
      this.setDisabled();
    });
  }

  saveRulesetOptions () {
   const formControls = this.formControls;
  getOptions().then( (options) => {

      formControls.forEach( input => {
        debug.flag && console.log(`[update][${input.id}]: ${options[input.getAttribute('data-option')]} (${input.getAttribute('data-option')})`);
        const option = input.getAttribute('data-option');
        if (input.type === 'radio') {
          if (input.checked) {
            options[option] = input.value;
          }
        }
        else {
          if (input.type === 'text') {
           options[option] = input.value;
          }
        }
      });
      saveOptions(options);
    });
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
    debug && console.log(`[saveOptions]`);

    this.setDisabled();

    this.saveRulesetOptions();
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

window.customElements.define("options-ruleset", OptionsRuleset);
