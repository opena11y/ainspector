/* grid-rule-group.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getMessage,
  getResultAccessibleName,
  removeChildContent,
  setI18nLabels
}  from './utils.js';

import {
  Grid
} from './grid.js';

import {
  getOptions
} from './storage.js';


// Constants

const debug = new DebugLogging('[grid-rule-group]', false);
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

  /* Helper functions */


  function getLevelAccessibleName (level) {
    let accName;

    switch (level){
      case 'A':
        accName = getMessage('single_a_label');
        break;

      case 'AA':
        accName = getMessage('double_a_label');
        break;

      case 'AAA':
        accName = getMessage('triple_a_label');
        break;

      default:
        break;
    }
    return accName;
  }

  /* Sorting Helper Functions */

  // returns a number for the sorting the result value
  function getResultSortingValue (result) {
    return ['', 'N/A', 'P', 'MC', 'W', 'V'].indexOf(result);
  }

  // returns a number used for representing SC for sorting
  function getSCSortingValue (sc) {
    let parts = sc.split('.');
    let p = parseInt(parts[0], 10);
    let g = parseInt(parts[1], 10);
    let s = parseInt(parts[2], 10);
    return (p * 10000 + g * 100 + s) * -1;
  }

  // returns a number used for representing level value for sorting
  function getLevelSortingValue (level) {
    return ['', 'AAA', 'AA', 'A'].indexOf(level);
  }

  // returns a number used for representing required value for sorting
  function getRequiredSortingValue (required) {
    return required ? 2 : 1;
  }

  function sortRuleResults(rule_results) {
    return rule_results.sort((a, b) => {
      let valueA = a.result_value;
      let valueB = b.result_value;
      if (valueA === valueB) {
        valueA = getLevelSortingValue(a.wcag_level);
        valueB = getLevelSortingValue(b.wcag_level);
        if (valueA === valueB) {
          valueA = getSCSortingValue(a.success_criteria_code);
          valueB = getSCSortingValue(b.success_criteria_code);
        } else {
          if (valueA === valueB) {
            valueA = getRequiredSortingValue(a.rule_required);
            valueB = getRequiredSortingValue(b.rule_required);
          }
        }
      }
      return valueB - valueA;
    });
  }


export default class GridRuleGroup extends Grid {

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
    this.infoRuleElem = false;

    this.lastSelectedRowId = '';
    this.activationDisabled = false;

    const detailsButtonElem = this.shadowRoot.querySelector('#details');
    detailsButtonElem.addEventListener('click', this.handleDetailsButtonClick.bind(this));

    this.setRowSelectionEventHandler(this.handleRowSelection.bind(this));
    this.setRowActivationEventHandler(this.handleRowActivation.bind(this));

  }

  setSidepanel (sidepanelElem) {
    this.sidepanelElem = sidepanelElem;
  }

  setInfoRule (infoRuleElem) {
    this.infoRuleElem = infoRuleElem;
  }

  clear (message1='', message2='') {
    removeChildContent(this.tbody);

    if (message1) {
      debug.flag && debug.log(`[clear][message1]: ${message1}`);
      this.addMessageRow('msg1', message1);
      this.tbody.firstElementChild.tabIndex = 0;
    }

    if (message2) {
      debug.flag && debug.log(`[clear][message2]: ${message2}`);
      this.addMessageRow('msg2', message2);
    }

  }

  update (rule_results) {
    let count = 0;

    removeChildContent(this.tbody);

    if (rule_results.length) {

      getOptions().then( (options) => {

        rule_results = sortRuleResults(rule_results);

        rule_results.forEach( (rr) => {

          if (options.resultsIncludePassNa ||
              rr.result_value_nls === 'V' ||
              rr.result_value_nls === 'W' ||
              rr.result_value_nls === 'MC'
            ) {

            count += 1;

            let rowAccName = '';
            let cellAccName;
            let sortValue;

            const row = this.addRow(rr.id);

            rowAccName += rr.rule_summary;
            this.addDataCell(row, rr.rule_summary, rr.rule_summary, 'rule');

            cellAccName = getResultAccessibleName(rr.result_value_nls);
            sortValue = getResultSortingValue(rr.result_value_nls);
            rowAccName += ', ' + cellAccName;
            this.addDataCell(row, rr.result_value_nls, cellAccName, `result ${rr.result_value_nls}`, sortValue);

            cellAccName = getMessage('success_criteria_label') + ' ' + rr.success_criteria_code;
            sortValue = getSCSortingValue(rr.success_criteria_code);
            rowAccName += ', ' + cellAccName;
            this.addDataCell(row, rr.success_criteria_code, '', 'sc', cellAccName, sortValue);

            cellAccName = getLevelAccessibleName(rr.wcag_level);
            sortValue = getLevelSortingValue(rr.wcag_level);
            rowAccName += ', ' + cellAccName;
            this.addDataCell(row, rr.wcag_level, '', 'level');

            cellAccName = rr.rule_required ? getMessage('required_label') : '';
            sortValue = getRequiredSortingValue(rr.rule_required);
            rowAccName += rr.rule_required ? ', ' + cellAccName : '';
            this.addDataCell(row, rr.rule_required ? 'Y' : '', '', 'required');

            row.setAttribute('aria-label', rowAccName);

            this.tbody.appendChild(row);
          }
        });

        if (count === 0) {
          this.addMessageRow('msg1', getMessage('no_violations_warnings_mc_results_msg'));
        }

        const rows = this.tbody.querySelectorAll('tr');
        let found = false;
        for (let i = 0; i < rows.length; i += 1) {
          const row = rows[i];
          if (row.id === this.lastSelectedRowId) {
            this.setSelectedRow(row);
            this.handleRowSelection(row.id);
            found = true;
          }
        }

        if (!found) {
          this.setSelectedRow(rows[0]);
          this.handleRowSelection(rows[0].id);
        }

      });

    }
    else {
      this.addMessageRow('msg1', getMessage('no_results_msg'));
      this.addMessageRow('msg2', getMessage('check_options_msg'));
    }
  }

  setHeight (height) {
    this.table.style.height = height + 'px';
  }

  // Event handlers

  handleRowSelection(id) {
    this.lastSelectedRowId = id;
    this.infoRuleElem.show(id);
  }

  handleRowActivation(id) {
    this.sidepanelElem.setView('rule', id);
  }

  handleDetailsButtonClick () {
    if (this.sidepanelElem) {
      this.sidepanelElem.setView('rule', this.lastSelectedRowId);
    }
  }


}

window.customElements.define("grid-rule-group", GridRuleGroup);

