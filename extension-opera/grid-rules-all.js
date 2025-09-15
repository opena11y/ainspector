/* grid-wcag-rule-all.js */

// Imports

import DebugLogging  from './debug.js';

import {
  ruleCategoryIds,
  getRuleCategoryLabelId,
  guidelineIds,
  getGuidelineLabelId
} from './constants.js';


import {
  getMessage,
  setI18nLabels
} from './utils.js';

import {
  Grid
} from './grid.js';

// Constants

const debug = new DebugLogging('[grid-wcag-guidelines]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <table class="rules-all"
         role="grid">
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

export default class GridRulesAll extends Grid {
  constructor () {
    super();


    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    setI18nLabels(this.shadowRoot, debug.flag);

    let rowIds, rowLabelIdFunct;

    if (this.getAttribute('id') === 'gl') {
      this.groupId = 'gl';
      rowIds = guidelineIds;
      rowLabelIdFunct = getGuidelineLabelId;
    }
    else {
      this.groupId = 'rc';
      rowIds = ruleCategoryIds;
      rowLabelIdFunct = getRuleCategoryLabelId;
    }

    // Initialize references
    this.table   = this.shadowRoot.querySelector('table');
    this.theadTr = this.table.querySelector('thead tr');
    this.thead   = this.table.querySelector('thead');
    this.tbody   = this.table.querySelector('tbody');

    this.sidepanelElem = false;
    this.lastSelectedRowId = '';
    this.activationDisabled = false;

    const rows = [];

    rowIds.forEach( (id) => {
      const label = getMessage(rowLabelIdFunct(id));
      // The row ID identifies the row as a rule category rule group and
      // includes which category using its numerical constant
      const row = this.addRow(`${this.groupId}-${id}`);
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

    if (this.groupId === 'gl') {
      this.thead.querySelector('th').textContent = getMessage('guideline_label');
    }


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
    results.forEach( (result) => {
      const row = this.rows.find( (row) => row.id === (`${this.groupId}-${result.id}`));

      if (row) {
        this.updateDataCell(row, 2, result.violations, '');
        this.updateDataCell(row, 3, result.warnings, '');
        this.updateDataCell(row, 4, result.manual_checks, '');
        this.updateDataCell(row, 5, result.passed, '');
      }
    });
  }

  // Event handlers

  handleRowSelection(id) {
    this.lastSelectedRowId = id;
  }

  handleRowActivation(id) {
    this.sidepanelElem.setView('rule-group', id);
  }

  handleDetailsButtonClick () {
    if (this.sidepanelElem) {
      this.sidepanelElem.setView('rule-group', this.lastSelectedRowId);
    }
  }

}

window.customElements.define("grid-rules-all", GridRulesAll);

