/* info-rule.js */

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

const debug = new DebugLogging('info-rule', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <div id="container">
    <h2 data-i18n="rule_selected_label"></h2>
    <div class="info-rules">
      <h3>Topic 1</h3>
      <ul>
        <li>Item #1</li>
        <li>Item #2</li>
        <li>Item #3</li>
      </ul>
    </div>
  </div>
`;

export default class InfoRule extends HTMLElement {
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

    this.infoRulesElem = this.shadowRoot.querySelector('.info-rules');
    debug.log(`[infoRulesElem]: ${this.infoRulesElem}`);

  }

  clear () {
    removeChildContent(this.infoRulesElem);
  }

  update (info_rules) {
    debug.log(`[update]{start]: ${info_rules}`);

    function addRuleDiv(elem, id) {
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

    info_rules.forEach( (info_rule) => {
      debug.log(`[update][info_rule]: ${info_rule.id}`);
      const divElem = addRuleDiv(this.infoRulesElem, info_rule.id);
      divElem.className = "info-rule";

      addH3(divElem, getMessage('rule_summary_label'));
      renderContent(divElem, info_rule.summary);

      addH3(divElem, getMessage('rule_definition_label'));
      renderContent(divElem, info_rule.definition);

      addH3(divElem, getMessage('rule_action_label'));
      renderContent(divElem, info_rule.actions);

      addH3(divElem, getMessage('rule_purpose_label'));
      renderContent(divElem, info_rule.purposes);

      addH3(divElem, getMessage('rule_techniques_label'));
      renderContent(divElem, info_rule.techniques);

      addH3(divElem, getMessage('rule_target_label'));
      renderContent(divElem, info_rule.targets);

      addH3(divElem, getMessage('rule_compliance_label'));
      renderContent(divElem, info_rule.wcag_primary);

      addH3(divElem, getMessage('rule_sc_label'));
      renderContent(divElem, info_rule.wcag_related);

      addH3(divElem, getMessage('rule_additional_label'));
      renderContent(divElem, info_rule.informational_links);

    });
    debug.log(`[update][end]`);
  }

  show(id) {
    debug.log(`[show][id]: ${id}`);
    const infoRules = Array.from(this.shadowRoot.querySelectorAll('.info-rule'));
    debug.log(`[show][length]: ${infoRules.length}`);

    infoRules.forEach( (ir) => {
      if (ir.id === id) {
        ir.removeAttribute('hidden');
      }
      else {
        ir.setAttribute('hidden', '');
      }
    });
  }

  setHeight (height) {

    const h2Elem = this.shadowRoot.querySelector('h2');

    const h2Height = h2Elem.getBoundingClientRect().height;

    this.infoRulesElem.style.height = (height - h2Height) + 'px';

  }

}

window.customElements.define("info-rule", InfoRule);

