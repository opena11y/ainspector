/* info-result.js */

// Imports

import DebugLogging  from './debug.js';

import {
  renderContent,
  addContentToElement,
  getMessage,
  removeChildContent,
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[info-result]', false);
debug.flag = false;

// Helper functions

function addElementDiv(elem, id) {
  const divElem = document.createElement('div');
  divElem.id= id;
  divElem.class= "info";
  elem.appendChild(divElem);
  return divElem;
}


function addH3 (elem, content) {
  const h3Elem = document.createElement('h3');
  addContentToElement(h3Elem, content);
  elem.appendChild(h3Elem);
  return h3Elem;
}

function addPropValue (elem, prop, value, className) {
  const div = document.createElement('div');
  div.className = `prop-value ${className}`;
  const spanProp = document.createElement('span');
  spanProp.textContent = prop + ': ';
  spanProp.className = 'prop';
  const spanValue = document.createElement('span');
  spanValue.textContent = value;
  spanValue.className = 'value';

  div.appendChild(spanProp);
  div.appendChild(spanValue);
  elem.appendChild(div);

  return div;
}

function addAction (elem, result_long, result_abbrev, action) {
  const div = document.createElement('div');
  div.className = `action`;

  const spanResultElem = document.createElement('span');
  addContentToElement(spanResultElem, `${result_long}`);
  spanResultElem.className = `result ${result_abbrev}`;

  const spanActionElem = document.createElement('span');
  addContentToElement(spanActionElem, `: ${action}`);
  spanActionElem.className = 'desc';

  div.appendChild(spanResultElem);
  div.appendChild(spanActionElem);
  elem.appendChild(div);

  return div;
}


function addPropertyList (elem, prop_list, firstHeader, className='') {
  let trElem, thElem, tdElem, spanElem;

  const tableElem = document.createElement('table');
  tableElem.className = className;
  elem.appendChild(tableElem);

  const theadElem = document.createElement('thead');
  tableElem.appendChild(theadElem);

  trElem = document.createElement('tr');
  theadElem.appendChild(trElem);

  thElem = document.createElement('th');
  thElem.textContent = firstHeader;
  trElem.appendChild(thElem);

  thElem = document.createElement('th');
  thElem.textContent = getMessage('header_value');
  trElem.appendChild(thElem);

  const tbodyElem = document.createElement('tbody');
  tableElem.appendChild(tbodyElem);

  for(let prop in prop_list) {
    trElem = document.createElement('tr');
    tbodyElem.appendChild(trElem);

    tdElem = document.createElement('td');
    tdElem.textContent = className === 'ccr' ?
                         getMessage(`ccr_${prop}`) :
                         className === 'table' ?
                         getMessage(`table_${prop}`) :
                         className === 'cell' ?
                         getMessage(`cell_${prop}`) :
                         prop;
    trElem.appendChild(tdElem);

    tdElem = document.createElement('td');
    if (prop.includes('color')) {
      spanElem = document.createElement('span');
      spanElem.className = 'sample';
      spanElem.style = `background-color: ${prop_list[prop]}`;
      spanElem.textContent = ' ';
      tdElem.append(spanElem);

      spanElem = document.createElement('span');
      spanElem.className = 'desc';
      spanElem.textContent = prop_list[prop];
      tdElem.append(spanElem);
    }
    else {
      tdElem.textContent = prop_list[prop];
    }
    trElem.appendChild(tdElem);
  }

  return tableElem;
}


function renderResultInfo (attachElem, result) {

  const divElem = addElementDiv(attachElem, result.id);
  divElem.className = "info-element";

  if (result.definition) {
    addH3(divElem, getMessage('rule_definition_label'));
    renderContent(divElem, result.definition, 'definition');
  }

  if (result.action) {
    addH3(divElem, getMessage('rule_action_label'));
    addAction(divElem, result.result_long, result.result_abbrev, result.action);
  }

  if (result.role) {
    addH3(divElem, getMessage('element_result_role'));
    renderContent(divElem, result.role, 'role');
  }

  if (result.accessible_name) {
    const acc_name = result.accessible_name;

    if (acc_name.name || result.accessible_name_required) {
      if (result.accessible_name_required) {
        addH3(divElem, getMessage('element_result_acc_name_required'));
        if (result.accessible_name.name) {
          addPropValue(divElem, getMessage('element_result_prop_text'), acc_name.name);
          addPropValue(divElem, getMessage('element_result_prop_source'), acc_name.source);
        }
        else {
          addPropValue(divElem, getMessage('element_result_prop_text'), getMessage('element_result_value_none'), 'missing');
          addPropValue(divElem, getMessage('element_result_prop_source'), '');
        }
      }
      else {
        if (result.accessible_name_prohibited) {
          addH3(divElem, getMessage('element_result_acc_name_prohibited'));
          addPropValue(divElem, getMessage('element_result_prop_text'),   acc_name.name, 'prohibited');
          addPropValue(divElem, getMessage('element_result_prop_source'), acc_name.source, 'prohibited');
        }
        else {
          addH3(divElem, getMessage('element_result_acc_name'));
          addPropValue(divElem, getMessage('element_result_prop_text'),   acc_name.name);
          addPropValue(divElem, getMessage('element_result_prop_source'), acc_name.source);
        }
      }
    }

  }

  if (result.accessible_description) {
    const acc_desc = result.accessible_description;
    if (acc_desc.name) {
      addH3(divElem, getMessage('element_result_acc_desc'));
      addPropValue(divElem, getMessage('element_result_prop_text'),   acc_desc.name);
      addPropValue(divElem, getMessage('element_result_prop_source'), acc_desc.source);
    }
  }

  if (result.error_message) {
    const err_msg = result.error_message;
    if (err_msg.name) {
      addH3(divElem, getMessage('element_result_error_desc'));
      addPropValue(divElem, getMessage('element_result_prop_text'),   err_msg.name);
      addPropValue(divElem, getMessage('element_result_prop_source'), err_msg.source);
    }
  }

  if (result.color_contrast) {
    addH3(divElem, getMessage('element_result_ccr'));
    addPropertyList(divElem, result.color_contrast, 'Property', 'ccr');
  }

  if (result.table) {
    addH3(divElem, 'Table Information');
    addPropertyList(divElem, result.table, getMessage('header_property'), 'table');
  }

  if (result.table_cell) {
    addH3(divElem, 'Table Cell Information');
    addPropertyList(divElem, result.table_cell, getMessage('header_property'), 'cell');
  }

  if (result.tag_name) {
    addH3(divElem, getMessage('element_result_tag_name'));
    renderContent(divElem, result.tag_name, 'tag_name');
  }

  if (result.role) {
    addH3(divElem, 'HTML Attributes');
    if (Object.keys(result.html_attributes).length) {
      addPropertyList(divElem, result.html_attributes, getMessage('header_attribute'), 'attrs');
    }
    else {
      renderContent(divElem, getMessage('element_result_value_none'), 'tag_name');
    }
  }


  if (result.role) {
    addH3(divElem, 'ARIA Attributes');
    if (Object.keys(result.aria_attributes).length) {
      addPropertyList(divElem, result.aria_attributes, getMessage('header_attribute'), 'attrs');
    }
    else {
      renderContent(divElem, getMessage('element_result_value_none'), 'tag_name');
    }
  }

  if (result.scope) {
    addH3(divElem, getMessage('element_result_type'));
    renderContent(divElem, result.result_type, 'result-type');
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <div id="container">
    <h2 data-i18n="element_selected_label"></h2>
    <copy-button></copy-button>
    <div class="info-results">
    </div>
  </div>
`;

export default class InfoResult extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Use external CSS stylesheets
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './base.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './info.css');
    this.shadowRoot.appendChild(link);

    setI18nLabels(this.shadowRoot, debug.flag);

    this.infoElementsElem = this.shadowRoot.querySelector('.info-results');

    const copyButtonElem   = this.shadowRoot.querySelector('copy-button');
    copyButtonElem.setGetTextFunct(this.getCopyText);

    this.website_result = false;
    this.page_result = false;
    this.element_results = [];

  }

  clear () {
    removeChildContent(this.infoElementsElem);
  }

  update (website_result, page_result, element_results) {
    this.website_result = website_result;
    this.page_result = page_result;
    this.element_results = element_results;
  }

  show(id) {
    this.clear();

    if (this.website_result && (id === this.website_result.id)) {
      renderResultInfo(this.infoElementsElem, this.website_result);
      return this.website_result;
    }
    else {
      if (this.page_result && (id === this.page_result.id)) {
        renderResultInfo(this.infoElementsElem, this.page_result);
        return this.page_result;
      }
      else {
        const er = this.element_results.find( (er) => {
          return er.id === id;
        });

        if (er) {
          renderResultInfo(this.infoElementsElem, er);
          return er;
        }
      }
    }
    return {};
  }

  getCopyText () {
    return "Test";
  }

  setHeight (height) {

    const h2Elem = this.shadowRoot.querySelector('h2');

    const h2Height = h2Elem.getBoundingClientRect().height;

    this.infoElementsElem.style.height = (height - h2Height) + 'px';

  }

}

window.customElements.define("info-result", InfoResult);

