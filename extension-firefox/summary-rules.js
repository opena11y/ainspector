/* summary-rules.js */

// Imports

import DebugLogging  from './debug.js';

import {
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[summary-rules]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <div class="summary">
    <div class="left">
    </div>
    <div class="center">
      <table data-i18n-aria-label="summary_rule_results">
        <thead>
          <tr>
            <th data-i18n="violations_abbrev"
                data-i18n-aria-label="violations_label"
                data-i18n-title="violations_label">
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
        </thead>
        <tbody>
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
          <span slot="title"
                data-i18n="info_dialog_results_legend">
          </span>
          <div slot="content">
            <info-dialog-summary-rules></info-dialog-summary-rules>
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

export default class SummaryRules extends HTMLElement {
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

  update (summary) {
    this.violationsTd.textContent   = summary.violations;
    this.violationsTd.title         = '';

    this.warningsTd.textContent     = summary.warnings;
    this.warningsTd.title           = '';

    this.manualChecksTd.textContent = summary.manual_checks;
    this.manualChecksTd.title       = '';

    this.passedTd.textContent       = summary.passed;
    this.passedTd.title             = '';
  }

  clear () {
    this.violationsTd.textContent   = '-';
    this.violationsTd.title         = '';

    this.warningsTd.textContent     = '-';
    this.warningsTd.title           = '';

    this.manualChecksTd.textContent = '-';
    this.manualChecksTd.title       = '';

    this.passedTd.textContent       = '-';
    this.passedTd.title             = '';
  }
}

window.customElements.define("summary-rules", SummaryRules);

