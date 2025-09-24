/* info-rule.js */

// Imports

import DebugLogging  from './debug.js';

import {
  renderContent,
  addContentToElement,
  getCopyTextContent,
  getMessage,
  removeChildContent,
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('info-rule', false);
debug.flag = false;

let currentCopyText = '';

const template = document.createElement('template');
template.innerHTML = `
  <div id="container">
    <h2 data-i18n="rule_selected_label"></h2>
    <copy-button></copy-button>
    <div class="info-rules">
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

    this.copyButtonElem = this.shadowRoot.querySelector('copy-button');
    this.copyButtonElem.setGetTextFunct(this.getCopyText);

    this.copyText = {};

  }

  clear () {
    removeChildContent(this.infoRulesElem);
  }

  update (info_rules) {

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

      const id = info_rule.id;
      this.copyText[id] = '';

      // HTML Content
      const divElem = addRuleDiv(this.infoRulesElem, id);
      divElem.className = "info-rule";

      addH3(divElem, getMessage('rule_id_label'));
      renderContent(divElem, info_rule.rule_nls_id);
      this.copyText[id] += getCopyTextContent('rule_id_label', info_rule.rule_nls_id);

      addH3(divElem, getMessage('rule_summary_label'));
      renderContent(divElem, info_rule.summary);
      this.copyText[id] += getCopyTextContent('rule_summary_label', info_rule.summary);

      addH3(divElem, getMessage('rule_definition_label'));
      renderContent(divElem, info_rule.definition);
      this.copyText[id] += getCopyTextContent('rule_definition_label', info_rule.definition);

      addH3(divElem, getMessage('rule_action_label'));
      renderContent(divElem, info_rule.actions, 'action');
      this.copyText[id] += getCopyTextContent('rule_action_label', info_rule.actions);

      addH3(divElem, getMessage('rule_purpose_label'));
      renderContent(divElem, info_rule.purposes);
      this.copyText[id] += getCopyTextContent('rule_purpose_label', info_rule.purposes);

      addH3(divElem, getMessage('rule_techniques_label'));
      renderContent(divElem, info_rule.techniques);
      this.copyText[id] += getCopyTextContent('rule_techniques_label', info_rule.techniques);

      addH3(divElem, getMessage('rule_target_label'));
      renderContent(divElem, info_rule.targets);
      this.copyText[id] += getCopyTextContent('rule_target_label', info_rule.targets);

      addH3(divElem, getMessage('rule_compliance_label'));
      renderContent(divElem, info_rule.wcag_primary);
      this.copyText[id] += getCopyTextContent('rule_compliance_label', info_rule.wcag_primary);

      addH3(divElem, getMessage('rule_sc_label'));
      if (info_rule.wcag_related.length) {
        renderContent(divElem, info_rule.wcag_related);
        this.copyText[id] += getCopyTextContent('rule_sc_label', info_rule.wcag_related);
      }
      else {
        renderContent(divElem, getMessage('element_result_value_none'));
        this.copyText[id] += getCopyTextContent('rule_sc_label',  getMessage('element_result_value_none'));
      }

      addH3(divElem, getMessage('rule_additional_label'));
      renderContent(divElem, info_rule.informational_links);
      this.copyText[id] += getCopyTextContent('rule_additional_label', info_rule.informational_links);

    });

    // Update copy icon based on light dark mode
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      this.copyButtonElem.setDarkMode();
    } else {
      this.copyButtonElem.setLightMode();
    }

  }

  show(id) {
    const infoRules = Array.from(this.shadowRoot.querySelectorAll('.info-rule'));

    infoRules.forEach( (ir) => {
      if (ir.id === id) {
        ir.removeAttribute('hidden');
        currentCopyText = this.copyText[id] ?
                          this.copyText[id] :
                          '';
//        debug.log(`[show][currentCopyText]: ${currentCopyText}`);
      }
      else {
        ir.setAttribute('hidden', '');
      }
    });
  }

  getCopyText () {
    debug.log(`[show][currentCopyText]: ${currentCopyText}`);
    return currentCopyText;
  }

  setHeight (height) {
    const h2Elem = this.shadowRoot.querySelector('h2');
    const h2Height = h2Elem.getBoundingClientRect().height;
    this.infoRulesElem.style.height = (height - h2Height) + 'px';
  }

}

window.customElements.define("info-rule", InfoRule);

