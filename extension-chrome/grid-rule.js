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
  getOptions,
  saveOption
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
    let valueA = a.result_value === 2 ? 0.5 : a.result_value;
    let valueB = b.result_value === 2 ? 0.5 : b.result_value;
    if (valueA === valueB) {
      // sort by ascending position
      valueA = b.position;
      valueB = a.position;
    }
    return valueB - valueA;
  });
}

function renderResult (gridObj, count, options, result) {

  if (options.resultsIncludePassNa ||
      result.result === 'V' ||
      result.result === 'W' ||
      result.result === 'MC') {

    count += 1;

    let rowAccName = '';
    let cellAccName;

    const row = gridObj.addRow(result.id);

    if (result.is_page) {
      row.classList.add('page');
    }

    if (result.is_website) {
      row.classList.add('website');
    }

    rowAccName += result.element;
    gridObj.addDataCell(row, result.element, '', 'element');

    cellAccName = getResultAccessibleName(result.result);
    rowAccName += ', ' + cellAccName;
    gridObj.addDataCell(row, result.result_abbrev, cellAccName, `result ${result.result_abbrev}`);

/*
    cellAccName = `position ${result.position}`;
    rowAccName += ', ' + cellAccName;
    gridObj.addDataCell(row, result.position, cellAccName, `position`);
*/

    cellAccName = result.action;
    rowAccName += ', ' + cellAccName;
    gridObj.addDataCell(row, result.action, '', 'action');

    gridObj.tbody.appendChild(row);
    row.setAttribute('aria-label', rowAccName);

  }

  return count;
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

    this.selectHighlightElem = this.shadowRoot.querySelector('select');
    this.selectHighlightOptions = this.selectHighlightElem.querySelectorAll('option');

    this.infoResultElem = false;
    this.sidepanelElem = false;

    this.lastSelectedRowId = '';
    this.activationDisabled = false;

    this.setRowSelectionEventHandler(this.handleRowSelection.bind(this));

    this.selectHighlightElem.addEventListener('change', this.handleSelectHighlight.bind(this));

  }

  setSidepanel (sidepanelElem) {
    this.sidepanelElem = sidepanelElem;
  }

  setInfoResult (infoResultElem) {
    this.infoResultElem = infoResultElem;
  }

  clear (message1="", message2="") {
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

  update (website_result, page_result, element_results) {
    let count = 0;
    removeChildContent(this.tbody);

    if (website_result || page_result || element_results.length) {

      getOptions().then( (options) => {

        if (website_result) {
          count = renderResult(this, count, options, website_result);
        }

        if (page_result) {
          count = renderResult(this, count, options, page_result);
        }

        element_results = sortElementResults(element_results);

        element_results.forEach( (er) => {
          count = renderResult(this, count, options, er);
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

        this.selectHighlightOptions.forEach( (option) => {
          option.selected = option.value === options.highlightOption;
        });

      });

    }
    else {
      this.addMessageRow('msg1', getMessage('no_results_msg'));
    }
  }

  setHeight (height) {
    this.table.style.height = height + 'px';
  }

  // Event handlers

  handleRowSelection(id) {
    this.lastSelectedRowId = id;
    const result = this.infoResultElem.show(id);
    if (this.sidepanelElem) {
      if (result.is_website) {
        this.sidepanelElem.highlightResult('website', result.highlightId, result.result_abbrev, true);
      }
      else {
        if (result.is_page) {
          this.sidepanelElem.highlightResult('page', result.highlightId, result.result_abbrev, true);
        }
        else {
          if (result.is_element) {
            this.sidepanelElem.highlightResult(result.position, result.highlightId, result.result_abbrev, true);
          }
          else {
            this.sidepanelElem.highlightResult('', '', false);
          }
        }
      }
    }
  }

  handleSelectHighlight() {
    saveOption('highlightOption', this.selectHighlightElem.value).then( () => {
      this.sidepanelElem.runEvaluation();
    });
  }

}

window.customElements.define("grid-rule", GridRule);

