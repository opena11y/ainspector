/* result-grid-rule-group.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getMessage,
  removeChildContent,
  setI18nLabels
}  from './utils.js';

import {
  ResultGrid
} from './result-grid.js';

// Constants

const debug = new DebugLogging('[result-grid-rule-group]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <table class="rule-group"
         role="grid"
         aria-label="none">
    <thead>
      <tr>
        <th class="rule"
            data-i18n="rule_label">
        </th>
        <th class="result"
            data-i18n="result_label">
        </th>
        <th class="sc"
            data-i18n-title="success_criteria_label"
            data-i18n="success_criteria_abbrev">
        </th>
        <th class="level"
            data-i18n="level_label">
        </th>
        <th class="required"
            data-i18n-title="required_label"
            data-i18n="required_abbrev">
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

export default class ResultGridRuleGroup extends ResultGrid {

  constructor() {
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

  }

  setSidepanel (sidepanelElem) {
    this.sidepanelElem = sidepanelElem;
  }

  clear (message1="", message2="") {
    removeChildContent(this.tbody);

    if (message1) {
      debug.log(`[clear][message1]: ${message1}`);
    }

    if (message2) {
      debug.log(`[clear][message2]: ${message2}`);
    }

  }

  update (rule_results) {
    removeChildContent(this.tbody);
    if (rule_results.length) {
      rule_results.forEach( (rr) => {
        const row = this.addRow(rr.id);
        this.addDataCell(row, rr.summary, '', 'text');
        this.addDataCell(row, rr.result, '', `result ${rr.result}`);
        this.addDataCell(row, rr.sc, '', 'sc');
        this.addDataCell(row, rr.level, '', 'level');
        this.addDataCell(row, rr.required ? 'Y' : '', '', 'required');
        this.tbody.appendChild(row);
      });
    }
    else {
      debug.log(`No rule group results`);
    }
  }

  getResultAccessibleName (result) {
    let accName = getMessage('not_applicable_label');

    switch (result){
      case 'MC':
        accName = getMessage('manual_check_label');
        break;

      case 'P':
        accName = getMessage('passed_label');
        break;

      case 'V':
        accName = getMessage('violationLabel');
        break;

      case 'W':
        accName = getMessage('warning_label');
        break;

      default:
        break;
    }
    return accName;
  }

  handleRowSelection (id) {
    if (id) {
      this.ruleResultInfo.update(this.detailsActions[id]);
    }
  }

  onDetailsButtonClick () {
    const rowId = this.ruleResultGrid.getSelectedRowId();
    if (this.handleRowActivation && rowId) {
      this.handleRowActivation(rowId);
    }
  }

  setHeight (height) {
    this.table.style.height = height + 'px';
  }

}

window.customElements.define("result-grid-rule-group", ResultGridRuleGroup);

