/* grid-rule.js */

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

const debug = new DebugLogging('[grid-rule]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <table class="rule"
         role="grid"
         aria-label="none">
    <thead>
      <tr>
        <th class="element"
            data-i18n="element_label">
        </th>
        <th class="result"
            data-i18n="result_label">
        </th>
        <th class="position"
            data-i18n-title="position_label"
            data-i18n="position_abbrev">
        </th>
        <th class="action"
            data-i18n="action_label">
        </th>
        </th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>

  <div class="highlight-select">
    <div class="highlight-group">
      <label for="highlight" data-i18n="highlight_label"></label>
      <select id="highlight">
        <option value="none"
                data-i18n="highlight_option_none">
        </option>
        <option value="selected"
                data-i18n="highlight_option_selected">
        </option>
        <option value="vw"
                data-i18n="highlight_option_vw">
        </option>
        <option value="all"
                data-i18n="highlight_option_all">
        </option>
      </select>
    </div>
  </div>
`;

  /* Helper functions */

  function sortElementResults(element_results) {
    return element_results.sort((a, b) => {
      let valueA = a.result_value;
      let valueB = b.result_value;
      if (valueA === valueB) {
        valueA = a.position;
        valueB = b.position;
      }
      return valueB - valueA;
    });
  }

export default class GridRule extends Grid {

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

    this.infoElementElem = false;
    this.sidepanelElem = false;

    this.lastSelectedRowId = '';
    this.activationDisabled = false;

    this.setRowSelectionEventHandler(this.handleRowSelection.bind(this));

  }


  setSidepanel (sidepanelElem) {
    this.sidepanelElem = sidepanelElem;
  }

  setInfoElement (infoElementElem) {
    this.infoElementElem = infoElementElem;
  }

  clear (message1="", message2="") {
    removeChildContent(this.tbody);

    if (message1) {
      debug.flag && debug.log(`[clear][message1]: ${message1}`);
    }

    if (message2) {
      debug.flag && debug.log(`[clear][message2]: ${message2}`);
    }

  }

  update (element_results) {
    debug.log(`[update]: ${element_results}`);

    let count = 0;
    removeChildContent(this.tbody);

    if (element_results.length) {

      getOptions().then( (options) => {

        element_results = sortElementResults(element_results);

        element_results.forEach( (er) => {

          if (options.resultsIncludePassNa ||
              er.result === 'V' ||
              er.result === 'W' ||
              er.result === 'MC'
            ) {

            count += 1;

            let rowAccName = '';
            let cellAccName;

            const row = this.addRow(er.id);

            rowAccName += er.element;
            this.addDataCell(row, er.element, '', 'element');

            cellAccName = getResultAccessibleName(er.result);
            rowAccName += ', ' + cellAccName;
            this.addDataCell(row, er.result_abbrev, cellAccName, `result ${er.result_abbrev}`);


            cellAccName = `position ${er.position}`;
            rowAccName += ', ' + cellAccName;
            this.addDataCell(row, er.position, cellAccName, `position`);

            cellAccName = er.action;
            rowAccName += ', ' + cellAccName;
            this.addDataCell(row, er.action, '', 'action');

            this.tbody.appendChild(row);
            row.setAttribute('aria-label', rowAccName);
          }
        });

        if (count === 0) {
          this.addMessageRow(getMessage('no_violations_warnings_mc_results_msg'));
        }

        const tr = this.tbody.firstElementChild;
        if (tr) {
          this.setSelectedRow(tr);
          this.handleRowSelection(tr.id);
        }

      });

    }
    else {
      this.addMessageRow(getMessage('no_results_msg'));
    }
  }

  setHeight (height) {
    this.table.style.height = height + 'px';
  }

  // Event handlers

  handleRowSelection(id) {
    debug.log(`[handleRowSelection][id]: ${id}`);
    this.lastSelectedRowId = id;
    this.infoElementElem.show(id);
  }



}

window.customElements.define("grid-rule", GridRule);

