/* grid.js */

// Imports

import DebugLogging  from './debug.js';

import {
  addContentToElement
} from './utils.js';

// Constants

const debug = new DebugLogging('[result-grid]', false);
debug.flag = false;



export class Grid extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    // Use external CSS stylesheet
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'base.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './result-grid.css');
    this.shadowRoot.appendChild(link);

    // reference to associated details button
    this.detailsButton = this.shadowRoot.querySelector('#details');

    // Save handle functions
    this.onRowActivation = null;
    this.onRowSelection = null;

  }

  set disabled (value) {
    this.activationDisabled = value;
  }

  get disabled () {
    return this.activationDisabled;
  }

  focus () {
    let elem = this.table.querySelector('[tabindex="0"]');
    if (elem) {
      elem.focus();
    }
  }

  setDetailsButtonDisabled (value) {
    if (typeof value !== 'boolean') {
      value = true;
    }
    value = this.disabled ? true : value;
    if (this.detailsButton) {
      this.detailsButton.disabled = value;
    }
  }

  addClassNameToTable (name) {
    return this.table.classList.add(name);
  }

  setRowActivationEventHandler (handler) {
    this.onRowActivation = handler;
  }

  setRowSelectionEventHandler (handler) {
    this.table.classList.add('show-selection');
    this.onRowSelection = handler;
  }

  disable () {
    this.table.setAttribute('aria-disabled', 'true');
    this.disabled = true;
    if (this.detailsButton) {
      this.setDetailsButtonDisabled (true);
    }
  }

  enable () {
    this.table.setAttribute('aria-disabled', 'false');
    this.disabled = false;
    this.setDetailsButtonDisabled (false);
  }

  getRowCount () {
    return this.table.querySelectorAll('tr').length;
  }

  getRowByPosition (pos) {
    if (pos < 1) {
      return this.theadTr;
    }
    let rows =  this.table.querySelectorAll('tr');
    if (pos > rows.length) {
      return this.tbody.lastElementChild;
    }
    return rows[pos-1];
  }

  getRowCurrentPosition (row) {
    let rows =  this.table.querySelectorAll('tr');
    for (let i = 0; i < rows.length; i += 1) {
      if (rows[i] === row) {
        return i + 1;
      }
    }
    // if not found return zero
    return 0;
  }

  getRowById (id) {
    return this.table.querySelector(`#${id}`);
  }

  getColCount (row) {
    return row.querySelectorAll('th, td').length;
  }

  getCellByPosition (row, pos) {
    let cells = row.querySelectorAll('th, td');
    if (pos < 2) {
      return cells[0];
    }
    for (let i = 0; i < cells.length; i += 1) {
      if (i === (pos-1)) {
        return cells[i];
      }
    }
    return cells[cells.length-1];
  }

  getCellCurrentPosition (row, cell) {
    let cells = row.querySelectorAll('th, td');
    for (let i = 0; i < cells.length; i += 1) {
      if (cells[i] === cell) {
        return i + 1;
      }
    }
    // if not found return zero
    return 0;
  }

  // This grid only supports one row of headers
  addHeaderCell (txt, cName, title) {
    let th = document.createElement('th');
    th.textContent = txt;
    if (cName) {
      th.className = cName;
    }
    if (title) {
      th.title = title;
    }
    this.theadTr.appendChild(th);
    return th;
  }

  // This grid only supports one row of headers
  updateHeaderCell (txt, className, title) {
    const th = this.theadTr.querySelector(`.${className}`);
    th.textContent = txt;
    if (title) {
      th.title = title;
    }
  }

  getNumberOfColumns () {
    return this.theadTr.querySelectorAll('th').length;
  }

  addMessageRow (message) {
    let tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.setAttribute('aria-label', message);

    let td = document.createElement('td');
    td.className = 'message';
    td.setAttribute('colspan', this.getNumberOfColumns());
    td.textContent = message;
    tr.appendChild(td);
    this.tbody.appendChild(tr);
  }

  // The id is used by event handlers for actions related to the row content
  addRow (id) {
    let tr = document.createElement('tr');
    tr.id = id;
    this.tbody.appendChild(tr);

    tr.addEventListener('keydown', this.handleRowKeydown.bind(this));
    tr.addEventListener('click', this.handleRowClick.bind(this));
    tr.addEventListener('dblclick', this.handleRowDoubleClick.bind(this));
    return tr;
  }

  addDataCell (row, txt, accName, cName, sortValue) {
    let span1, span2;
    let td = document.createElement('td');
    td.tabIndex = -1;
    if (accName) {
      // Hide the visually rendered text content from AT
      span1 = document.createElement('span');
      addContentToElement(span1, txt);
      span1.setAttribute('aria-hidden', 'true');
      td.appendChild(span1);
      // Hide the content available to AT from visual rendering
      span2 = document.createElement('span');
      span2.textContent = accName;
      span2.className = 'sr-only';
      td.appendChild(span2);
    } else {
      addContentToElement(td, txt);
    }

    if (cName) {
      td.className = cName;
    }
    if (sortValue) {
      td.setAttribute('data-sort-value', sortValue);
    }
    row.appendChild(td);
    td.addEventListener('keydown', this.onCellKeydown.bind(this));

    return td;
  }

  updateDataCell (row, pos, txt, name, cName, sortValue) {
    let cell = this.getCellByPosition(row, pos);
    addContentToElement(cell, txt, true);
    if (name) {
      cell.setAttribute('aria-label', name);
    }
    if (cName) {
      cell.className = cName;
    }
    if (sortValue) {
      cell.attribute('data-sort-value', sortValue);
    }
    return cell;
  }

  clearRow (id) {
    let row = this.tbody.querySelector('#' + id);
    let tds = row.querySelectorAll('td');

    // Leave first cell and clear the rest
    for (let i = 1; i < tds.length; i += 1) {
      tds[i].textContent = '-';
    }
  }

  // messages provide status feedback
  deleteDataRows (message1, message2) {
    if (typeof message1 !== 'string') {
      message1 = '';
    }
    if (typeof message2 !== 'string') {
      message2 = '';
    }
    while (this.tbody.firstChild) {
      this.tbody.firstChild.remove();
    }

    if (message1) {
      this.addMessageRow(message1);
    }

    if (message2) {
      this.addMessageRow(message2);
    }

    this.setDetailsButtonDisabled(true);
  }

  // sorts table rows using the data-sort attribute
  // data-sort attribute must me a number
  sortGridByColumn (primaryIndex, secondaryIndex, thirdIndex, sortValue) {
    function compareValues(a, b) {
      if (sortValue === 'ascending') {
        if (a.value1 === b.value1) {
          if (a.value2 === b.value2) {
            if (a.value3 === b.value3) {
              return 0;
            } else {
              return a.value3 - b.value3;
            }
          } else {
            return a.value2 - b.value2;
          }
        } else {
          return a.value1 - b.value1;
        }
      } else {
        if (a.value1 === b.value1) {
          if (a.value2 === b.value2) {
            if (a.value3 === b.value3) {
              return 0;
            } else {
              return b.value3 - a.value3;
            }
          } else {
            return b.value2 - a.value2;
          }
        } else {
          return b.value1 - a.value1;
        }
      }
    }

    if (typeof sortValue !== 'string') {
      sortValue = 'descending';
    }

    let trs = [];
    let rowData = [];
    let cell1;
    let cell2;
    let cell3;

    let tr = this.tbody.firstElementChild;

    let index = 0;
    while (tr) {
      trs.push(tr);
      cell1 = this.getCellByPosition(tr, primaryIndex);
      if (secondaryIndex) {
        cell2 = this.getCellByPosition(tr, secondaryIndex);
      }
      if (thirdIndex) {
        cell3 = this.getCellByPosition(tr, thirdIndex);
      }

      let data = {};
      data.index = index;
      data.value1 = parseFloat(cell1.getAttribute('data-sort-value'));
      if (secondaryIndex) {
        data.value2 = parseFloat(cell2.getAttribute('data-sort-value'));
      } else {
        data.value2 = 0;
      }
      if (thirdIndex) {
        data.value3 = parseFloat(cell3.getAttribute('data-sort-value'));
      } else {
        data.value3 = 0;
      }

      rowData.push(data);
      tr = tr.nextElementSibling;
      index += 1;
    }

    rowData.sort(compareValues);

    this.deleteDataRows();

    // add sorted rows
    for (let i = 0; i < rowData.length; i += 1) {
      this.tbody.appendChild(trs[rowData[i].index]);
    }

    this.setSortHeader(primaryIndex);

  }

  setSortHeader (index) {
    let th = this.getCellByPosition(this.theadTr, index);
    let cell = this.theadTr.firstChild;

    while (cell) {

      if (cell === th) {
        cell.setAttribute('aria-sort', 'descending');
      } else {
        cell.removeAttribute('aria-sort');
      }
      cell = cell.nextElementSibling;
    }
  }

  // The flag is used to udpate the last user selected item
  setSelectedRow (node, flag) {
    if (typeof flag !== 'boolean') {
      flag = true;
    }
    let n = node;
    this.setDetailsButtonDisabled(true);
    if (node.tagName !== 'TR') {
      n = node.parentNode;
    }
    if (n) {
      let trs = this.tbody.querySelectorAll('tr');
      if (flag) {
        this.lastSelectedRowId = n.id;
      }
      trs.forEach( (tr) => {
        if (tr === n) {
          tr.tabIndex = (n === node) ? 0 : -1;
          tr.setAttribute('aria-selected', 'true');
          this.setDetailsButtonDisabled(false);
        } else {
          tr.removeAttribute('aria-selected');
          tr.tabIndex = -1;
        }
      });
    }
  }

  setSelectedRowUsingLastId () {
    let tr, id = this.lastSelectedRowId;
    if (id) {
      tr = this.tbody.querySelector('tr[id=' + id + ']');
    }
    if (!tr) {
      tr = this.tbody.querySelector('tr[id]');
    }
    if (tr && tr.id) {
      this.setSelectedRow(tr);
      id = tr.id;
    }
    return id;
  }

  getFirstDataRowId () {
    let tr = this.tbody.firstElementChild;
    if (tr && tr.id) {
      return tr.id;
    }
    return '';
  }

  getSelectedRowId () {
    return this.lastSelectedRowId;
  }

  tryHandleRowSelection (id) {
    if (this.onRowSelection) {
      this.onRowSelection(id);
      return true;
    }
    return false;
  }

  tryHandleRowActivation (id) {
    if (!this.activationDisabled &&
        this.onRowActivation &&
        !this.disabled) {
      this.onRowActivation(id);
      return true;
    }
    return false;
  }

  // event handlers

  handleRowClick (event) {
    const tgt = event.currentTarget;
    this.setSelectedRow(tgt);
    tgt.focus();
    this.tryHandleRowSelection(tgt.id);

    event.preventDefault();
    event.stopPropagation();
  }

  handleRowDoubleClick (event) {
    const tgt = event.currentTarget;
    tgt.focus();
    this.setSelectedRow(tgt);
    this.tryHandleRowActivation(tgt.id);

    event.preventDefault();
    event.stopPropagation();
  }

  handleRowKeydown (event) {
    let nextItem = null;
    let flag = false;

    const tgt = event.target;
    const rowPos = this.getRowCurrentPosition(tgt);

    switch(event.key) {
      case 'Enter':
        if (tgt.id) {
          this.tryHandleRowActivation(tgt.id);
          flag = true;
        }
        break;

      case 'ArrowDown':
        nextItem = this.getRowByPosition(rowPos+1);
        this.tryHandleRowSelection(nextItem.id);
        flag = true;
        break;

      case 'ArrowUp':
        if (rowPos > 2) {
          nextItem = this.getRowByPosition(rowPos-1);
          this.tryHandleRowSelection(nextItem.id);
        }
        flag = true;
        break;

      case 'ArrowRight':
        nextItem = tgt.firstElementChild;
        flag = true;
        break;

      default:
        break;
    }

    if (nextItem) {
      nextItem.focus();
      nextItem.tabIndex = 0;
      tgt.tabIndex = -1;
      this.setSelectedRow(nextItem);
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onCellKeydown (event) {
    let nextItem = null;
    let nextRow = null;
    let flag = false;

    const tgt   = event.target;
    const tgtTr = tgt.parentNode;

    let colPos = this.getCellCurrentPosition(tgtTr, tgt);
    let rowPos = this.getRowCurrentPosition(tgtTr);

    switch(event.key) {
      case 'Enter':
        if (tgtTr.id) {
          this.tryHandleRowActivation(tgtTr.id);
          flag = true;
        }
        break;

      case 'ArrowDown':
        if (rowPos && colPos) {
          nextRow = this.getRowByPosition(rowPos+1);
          nextItem = this.getCellByPosition(nextRow, colPos);
          this.tryHandleRowSelection(nextRow.id);
        }
        flag = true;
        break;

      case 'ArrowUp':
        if ((rowPos > 2) && colPos) {
          nextRow = this.getRowByPosition(rowPos-1);
          nextItem = this.getCellByPosition(nextRow, colPos);
          this.tryHandleRowSelection(nextRow.id);
        }
        flag = true;
        break;

      case 'ArrowLeft':
        if (tgt.previousElementSibling) {
          nextItem = tgt.previousElementSibling;
        } else {
          nextItem = tgtTr;
        }
        flag = true;
        break;

      case 'ArrowRight':
        nextItem = tgt.nextElementSibling;
        flag = true;
        break;

      default:
        break;
    }

    if (nextItem) {
      nextItem.focus();
      nextItem.tabIndex = 0;
      tgt.tabIndex = -1;
      this.setSelectedRow(nextItem);
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  setHeight (height) {
    this.table.style.height = height + 'px';
  }

}

