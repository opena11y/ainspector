/* result-grid-rule-categories.js */

// Imports

import DebugLogging  from './debug.js';

import {
  ruleCategoryIds,
  getRuleCategoryLabelId
} from './constants.js';

import {
  getMessage,
  setI18nLabels
} from './utils.js';

import {
  ResultGrid
} from './result-grid.js';

// Constants

const debug = new DebugLogging('[result-grid-rule-categories]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <table class="rules-all"
         role="grid"
         aria-label="none">
    <thead>
      <tr>
        <th class="group text"
            data-i18n="rule_category_label">
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

  <div class="details">
    <button id="details">
      <span data-i18n="details_label">
      </span>
      <svg xmlns='http://www.w3.org/2000/svg'
           class='down'
           width='12'
           height='12'
           viewBox='0 0 12 12'>
        <polygon points='1 1, 1 11, 11 6' fill='currentColor'/>
      </svg>
    </button>
  </div>
`;

// Helper functions

/*
function showRuleResult(result) {
  debug.log(`[showResult] id:${result.id} v:${result.violations}  w:${result.warnings}  mc:${result.manual_checks} p:${result.passed}`);
}
*/

export default class ResultGridRuleCategories extends ResultGrid {
  constructor () {
    super();

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    setI18nLabels(this.shadowRoot, debug.flag);

    // Initialize references
    this.table   = this.shadowRoot.querySelector('table');
    this.theadTr = this.table.querySelector('thead tr');
    this.thead   = this.table.querySelector('thead');
    this.tbody   = this.table.querySelector('tbody');

    this.sidepanelElem = false;
    this.lastSelectedRowId = '';
    this.activationDisabled = false;

    // Initialize Grid
    const rows = [];
    ruleCategoryIds.forEach( (id) => {
      const label = getMessage(getRuleCategoryLabelId(id));
      // The row ID identifies the row as a rule category rule group and
      // includes which category using its numerical constant
      const row = this.addRow('rc-' + id);
      this.addDataCell(row, label, '', 'text');
      this.addDataCell(row, '-', '', 'summ num');
      this.addDataCell(row, '-', '', 'summ num');
      this.addDataCell(row, '-', '', 'summ num');
      this.addDataCell(row, '-', '', 'summ num');
      rows.push(row);
    });
    this.rows = rows;
    this.rows[0].tabIndex = 0;

    const detailsButtonElem = this.shadowRoot.querySelector('#details');
    detailsButtonElem.addEventListener('click', this.handleDetailsButtonClick.bind(this));

    this.setRowSelectionEventHandler(this.handleRowSelection.bind(this));
    this.setRowActivationEventHandler(this.handleRowActivation.bind(this));

  }

  setSidepanel (sidepanelElem) {
    this.sidepanelElem = sidepanelElem;
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

  update (results) {
    const rg = this;
    results.forEach( (result) => {
      const row = rg.rows.find( (row) => row.id === ('rc-' + result.id));

      if (row) {
        rg.updateDataCell(row, 2, result.violations, '');
        rg.updateDataCell(row, 3, result.warnings, '');
        rg.updateDataCell(row, 4, result.manual_checks, '');
        rg.updateDataCell(row, 5, result.passed, '');
      }
    });
  }

  // Event handlers

  handleRowSelection(id) {
    debug.log(`[handleRowSelection][id]: ${id}`);
    this.sidepanelElem.setRuleGroup(id);
  }

  handleRowActivation(id) {
    debug.log(`[handleRowActivation][id]: ${id}`);
    this.sidepanelElem.setView('rule-group', id);
  }

  handleDetailsButtonClick () {
    if (this.sidepanelElem) {
      this.sidepanelElem.setView('rule-group', this.lastSelectedRowId);
    }
  }

}

window.customElements.define("result-grid-rule-categories", ResultGridRuleCategories);

