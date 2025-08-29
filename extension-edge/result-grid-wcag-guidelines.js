/* result-grid-wcag-guidelines.js */

// Imports

import DebugLogging  from './debug.js';

import {
  guidelineIds,
  getGuidelineLabelId
} from './constants.js';


import {
  getMessage,
  setI18nLabels
} from './utils.js';

import {
  ResultGrid
} from './result-grid.js';

// Constants

const debug = new DebugLogging('[result-grid-wcag-guidelines]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <table role="grid"
         aria-label="none">
    <thead>
      <tr>
        <th class="group text"
            data-i18n="guidelines_label">
        </th>
        <th class="summ num"
            data-i18n-title="violations_label"
            data-i18n="violations_abbrev">
        </th>
        <th class="summ num"
            data-i18n-title="warnings_label"
            data-i18n="warnings_abbrev">
        </th>
        <th class="summ num"
            data-i18n-title="manual_checks_label"
            data-i18n="manual_checks_abbrev">
        </th>
        <th class="summ num"
            data-i18n-title="passed_label"
            data-i18n="passed_abbrev">
        </th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
`;

export default class ResultGridWCAGGuidelines extends ResultGrid {
  constructor () {
    super();

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    setI18nLabels(this.shadowRoot, debug.flag);

    // Save handle functions
    this.onRowActivation = null;
    this.onRowSelection = null;

    // Initialize references
    this.table   = this.shadowRoot.querySelector('table');
    this.theadTr = this.table.querySelector('thead tr');
    this.thead   = this.table.querySelector('thead');
    this.tbody   = this.table.querySelector('tbody');

    this.lastSelectedRowId = '';
    this.activationDisabled = false;

    // reference to associated details button
    this.detailsButton = null;

    guidelineIds.forEach( (id) => {
      const label = getMessage(getGuidelineLabelId(id));
      debug.log(`${id} ${getGuidelineLabelId(id)} ${label}`);
      // The row ID identifies the row as a rule category rule group and
      // includes which category using its numerical constant
      const row = this.addRow('gl' + id);
      this.addDataCell(row, label, '', 'text');
      this.addDataCell(row, '-', '', 'summ num');
      this.addDataCell(row, '-', '', 'summ num');
      this.addDataCell(row, '-', '', 'summ num');
      this.addDataCell(row, '-', '', 'summ num');
    });
  }

  clear () {
    const rows = Array.from(this.tbody.querySelectorAll('tr'));
    rows.forEach( (row) => {
      this.updateDataCell(row, 2, '-', '');
      this.updateDataCell(row, 3, '-', '');
      this.updateDataCell(row, 4, '-', '');
      this.updateDataCell(row, 5, '-', '');
    });
  }

}

window.customElements.define("result-grid-wcag-guidelines", ResultGridWCAGGuidelines);

