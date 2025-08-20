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
          <div slot="content">
            <info-ruleset></info-ruleset>
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
               value="FIRSTSTEP""/>
        <span data-i18n="options_ruleset_first_step_label">
          First Step Rules
        </span>
      </label>
    </fieldset>

    <fieldset>
      <legend>
        <span data-i18n="options_ruleset_wcag_levels_legend">
          WCAG Rule Levels
        </span>
        <info-dialog
          data-more-info-url="https://www.w3.org/WAI/WCAG22/Understanding/conformance#levels">
          <div slot="content">
            <info-wcag-levels></info-wcag-levels>
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

    <fieldset>
      <legend>
        <span data-i18n="options_rule_scope_legend">
          Rule Scope filter
        </span>
        <info-dialog
          data-more-info-url="https://ainspector.disability.illinois.edu/concepts-and-terms/#scope">
          <div slot="content">
            <info-scopes></info-scopes>
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
          <div slot="content">
            <info-aria-versions></info-aria-versions>
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

    // Helper function
    function getNode (id) {
      return optionsRuleset.shadowRoot.querySelector(`#${id}`);
    }

    super();

    this.attachShadow({ mode: 'open' });
    // const used for help function

    const optionsRuleset = this;

    const optionsRulesetClone = optionsRulesetTemplate.content.cloneNode(true);
    this.shadowRoot.appendChild(optionsRulesetClone);

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
      resetRulesetOptions().then(this.updateOptions.bind(this));
    });

    optionsRuleset.shadowRoot.querySelectorAll('input[type=checkbox], input[type=radio]').forEach( input => {
      input.addEventListener('focus',  optionsRuleset.onFocus);
      input.addEventListener('blur',   optionsRuleset.onBlur);
      input.addEventListener('change', optionsRuleset.onChange.bind(optionsRuleset));

      input.parentNode.addEventListener('pointerover',   optionsRuleset.onPointerover);

    });

    this.onResize();
    window.addEventListener('resize', this.onResize.bind(this));
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
    debug && console.log(`[saveOptions]`);
    this.saveRulesetOptions();
  }

  onResize() {
    this.shadowRoot.querySelectorAll('input[type=radio], input[type=checkbox]').forEach( input => {
      const node = input.parentNode;
      if (node) {
        node.style.width = 'auto';
        const rect = node.querySelector('span').getBoundingClientRect();
        node.style.width = (rect.width + 40) + 'px';
      }
    });
  }
}

window.customElements.define("options-ruleset", OptionsRuleset);
