/* summary-rule-group.js */

// Imports

import DebugLogging  from './debug.js';

import {
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[summary-rule-group]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <div class="summary">
    <div class="left">
    </div>
    <div class="center">
      <table data-i18n-aria-label="summary_rule_results">
        <tbody>
          <tr>
            <th data-i18n="violations_abbrev"
                data-i18n-aria-label="violations_label"
                data-i18n-ttile="violations_label">
              V
            </th>
            <th data-i18n="warnings_abbrev"
                data-i18n-aria-label="warnings_label"
                data-i18n-title="warnings_label">
              W
            </th>
            <th data-i18n="manual_checks_abbrev"
                data-i18n-aria-label="manual_checks_label"
                data-i18n-title="manual_checks_label">
              MC
            </th>
            <th data-i18n="passed_abbrev"
                data-i18n-aria-label="passed_label"
                data-i18n-title="passed_label">
              MC
            </th>
          </tr>
          <tr>
            <td id="violations-value">-</td>
            <td id="warnings-value">-</td>
            <td id="manual-checks-value">-</td>
            <td id="passed-value">-</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="right">
        <info-dialog
          data-more-info-url="https://opena11y.github.io/evaluation-library/concepts.html">
          <div slot="content">
            <info-dialog-summary-rule-group></info-dialog-summary-rule-group>
          </div>
          <span slot="open-button"
               data-i18n="info_dialog_summary_title">
            Results Legend
          </span>
          <span slot="more-button"
               data-i18n="more_button_label">
            Terms and Concepts
          </span>
        </info-dialog>
    </div>
  </div>
`;

export default class SummaryRuleGroup extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    // Use external CSS stylesheet
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'summary.css');
    this.shadowRoot.appendChild(link);

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    setI18nLabels(this.shadowRoot, debug.flag);

    // Initialize abbreviations and labels

    // Initialize references
    this.violationsTd   = this.shadowRoot.querySelector('#violations-value');
    this.warningsTd     = this.shadowRoot.querySelector('#warnings-value');
    this.manualChecksTd = this.shadowRoot.querySelector('#manual-checks-value');
    this.passedTd       = this.shadowRoot.querySelector('#passed-value');

  }

  set violations (value) {
    this.violationsTd.textContent = value;
  }

  set warnings (value) {
    this.warningsTd.textContent = value;
  }

  set manualChecks (value) {
    this.manualChecksTd.textContent = value;
  }

  set passed (value) {
    this.passedTd.textContent = value;
  }

  get violations () {
    return this.violationsTd.textContent;
  }

  get warnings () {
    return this.warningsTd.textContent;
  }

  get manual_checks () {
    return this.manualChecksTd.textContent;
  }

  get passed () {
    return this.passedTd.textContent;
  }


  clear () {
    this.violationsTd.textContent   = '-';
    this.warningsTd.textContent     = '-';
    this.manualChecksTd.textContent = '-';
    this.passedTd.textContent       = '-';
  }
}

window.customElements.define("summary-rule-group", SummaryRuleGroup);

