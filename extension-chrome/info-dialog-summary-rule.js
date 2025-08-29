/* info-dialog-summary-rules.js */

// Imports

import DebugLogging  from './debug.js';

import {
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[info-dialog]', false);
debug.flag = false;


const template = document.createElement('template');
template.innerHTML = `

  <div class="content">

    <h2 id="h2-result-types"
        data-i18n="rule_result_types_label"></h2>
    <table class="info result-types" aria-labelledby="h2-result-types">
      <tbody>
        <tr class="violation">
          <th scope="row"
              class="symbol">
              <span class="abbrev"
                    data-i18n="violations_abbrev"></span>
          </th>
          <td class="label"
              data-i18n="violations_label">
          </td>
        </tr>
        <tr class="warning">
          <th scope="row"
              class="symbol">
              <span class="abbrev"
                    data-i18n="warnings_abbrev"></span>
          </th>
          <td class="label"
              data-i18n="warnings_label">
          </td>
        </tr>
        <tr class="manual-check">
         <th scope="row"
              class="symbol">
              <span class="abbrev"
                    data-i18n="manual_checks_abbrev"></span>
          </th>
          <td class="label"
              data-i18n="manual_checks_label">
          </td>
        </tr>
        <tr class="passed">
         <th scope="row"
              class="symbol">
              <span class="abbrev"
                    data-i18n="passed_abbrev"></span>
          </th>
          <td class="label"
              data-i18n="passed_label">
          </td>
        </tr>
        <tr class="hidden">
         <th scope="row"
              class="symbol">
              <span class="abbrev"
                    data-i18n="hidden_abbrev"></span>
          </th>
          <td class="label"
              data-i18n="hidden_label">
          </td>
        </tr>
      </body>
    </table>

    <h2 data-i18n="numerical_results_label"></h2>
    <div data-i18n="element_number_desc"></div>
  </div>

`;

export default class InfoDialogSummaryRule extends HTMLElement {
  constructor () {

    super();
    this.attachShadow({ mode: 'open' });

    // Use external CSS stylesheets
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'base.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'dialog-content.css');
    this.shadowRoot.appendChild(link);

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    setI18nLabels(this.shadowRoot, debug.flag);
  }
}

window.customElements.define("info-dialog-summary-rule", InfoDialogSummaryRule);


