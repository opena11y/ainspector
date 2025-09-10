/* info-element.js */

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

const debug = new DebugLogging('[info-element]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <div id="container">
    <h2 data-i18n="element_selected_label"></h2>
    <div class="info-elements">
      <h3>Topic 1</h3>
      <ul>
        <li>Item #1</li>
        <li>Item #2</li>
        <li>Item #3</li>
      </ul>
    </div>
  </div>
`;

export default class InfoElement extends HTMLElement {
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

    this.infoElementsElem = this.shadowRoot.querySelector('.info-elements');

  }

  clear () {
    removeChildContent(this.infoElementsElem);
  }

  update (element_results) {
    debug.log(`[update]: ${element_results}`);
    this.element_results = element_results;
  }

  show(id) {
    debug.log(`[show][id]: ${id}`);
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

    const er = this.element_results.find( (er) => {
      return er.id === id;
    });
    this.clear();

    if (er) {
      const divElem = addElementDiv(this.infoElementsElem, er.id);
      divElem.className = "info-element";

      if (er.definition) {
        addH3(divElem, getMessage('rule_definition_label'));
        renderContent(divElem, er.definition);
      }

      if (er.action) {
        addH3(divElem, getMessage('rule_action_label'));
        renderContent(divElem, er.action);
      }

      if (er.role) {
        addH3(divElem, getMessage('element_result_role'));
        renderContent(divElem, er.role);
      }

      if (er.accessible_name.name || er.accessible_name_required) {
        if (er.accessible_name_required) {
          addH3(divElem, getMessage('element_result_acc_name_required'));
          if (er.accessible_name.name) {
            addPropValue(divElem, getMessage('element_result_prop_text'), er.accessible_name.name);
            addPropValue(divElem, getMessage('element_result_prop_source'), er.accessible_name.name);
          }
          else {
            addPropValue(divElem, getMessage('element_result_prop_text'), getMessage('element_result_value_none'), 'missing');
            addPropValue(divElem, getMessage('element_result_prop_source'), '');
          }
        }
        else {
          if (er.accessible_name_prohibited) {
            addH3(divElem, getMessage('element_result_acc_name_prohibited'));
            addPropValue(divElem, getMessage('element_result_prop_text'),   er.accessible_name.name, 'prohibited');
            addPropValue(divElem, getMessage('element_result_prop_source'), er.accessible_name.source, 'prohibited');
          }
          else {
            addH3(divElem, getMessage('element_result_acc_name'));
            addPropValue(divElem, getMessage('element_result_prop_text'),   er.accessible_name.name);
            addPropValue(divElem, getMessage('element_result_prop_source'), er.accessible_name.source);
          }
        }
      }

      if (er.accessible_description.name) {
        addH3(divElem, getMessage('element_result_acc_desc'));
        addPropValue(divElem, getMessage('element_result_prop_text'),   er.accessible_description.name);
        addPropValue(divElem, getMessage('element_result_prop_source'), er.accessible_description.source);
      }

      if (er.error_message.name) {
        addH3(divElem, getMessage('element_result_error_desc'));
        addPropValue(divElem, getMessage('element_result_prop_text'),   er.error_message.name);
        addPropValue(divElem, getMessage('element_result_prop_source'), er.error_message.source);
      }

      if (er.tag_name) {
        addH3(divElem, getMessage('element_result_tag_name'));
        renderContent(divElem, er.tag_name);
      }

      if (er.scope) {
        addH3(divElem, getMessage('info_scope_label'));
        renderContent(divElem, er.scope);
      }

    }



  }

  setHeight (height) {

    const h2Elem = this.shadowRoot.querySelector('h2');

    const h2Height = h2Elem.getBoundingClientRect().height;

    this.infoElementsElem.style.height = (height - h2Height) + 'px';

  }

}

window.customElements.define("info-element", InfoElement);

