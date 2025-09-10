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

function renderResultInfo (attachElem, result) {

  const divElem = addElementDiv(attachElem, result.id);
  divElem.className = "info-element";

  if (result.definition) {
    addH3(divElem, getMessage('rule_definition_label'));
    renderContent(divElem, result.definition, 'definition');
  }

  if (result.action) {
    addH3(divElem, getMessage('rule_action_label'));
    renderContent(divElem, result.action, 'action');
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
          addPropValue(divElem, getMessage('element_result_prop_source'), acc_name.name);
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

  if (result.tag_name) {
    addH3(divElem, getMessage('element_result_tag_name'));
    renderContent(divElem, result.tag_name, 'tag_name');
  }

  if (result.scope) {
    addH3(divElem, getMessage('info_scope_label'));
    renderContent(divElem, result.scope, 'scope');
  }
}

const template = document.createElement('template');
template.innerHTML = `
  <div id="container">
    <h2 data-i18n="element_selected_label"></h2>
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

    this.website_result = false;
    this.page_result = false;
    this.element_results = [];

  }

  clear () {
    removeChildContent(this.infoElementsElem);
  }

  update (website_result, page_result, element_results) {
    debug.log(`[update]: ${element_results}`);
    this.website_result = website_result;
    this.page_result = page_result;
    this.element_results = element_results;
  }

  show(id) {
    debug.log(`[show][id]: ${id}`);
    this.clear();

    if (this.website_result && (id === this.website_result.id)) {
      renderResultInfo(this.infoElementsElem, this.website_result);
    }
    else {
      if (this.page_result && (id === this.page_result.id)) {
        renderResultInfo(this.infoElementsElem, this.page_result);
      }
      else {
        const er = this.element_results.find( (er) => {
          return er.id === id;
        });

        if (er) {
          renderResultInfo(this.infoElementsElem, er);
        }
      }
    }




  }

  setHeight (height) {

    const h2Elem = this.shadowRoot.querySelector('h2');

    const h2Height = h2Elem.getBoundingClientRect().height;

    this.infoElementsElem.style.height = (height - h2Height) + 'px';

  }

}

window.customElements.define("info-result", InfoResult);

