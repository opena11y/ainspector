/* view-rule-group.js */

// Imports

import DebugLogging  from './debug.js';

// Constants

const debug = new DebugLogging('[view-rule-group]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <summary-rules></summary-rules>

  <grid-rule-group>
  </grid-rule-group>

  <info-rule>
  <info-rule>
`;

export default class ViewRuleGroup extends HTMLElement {
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
    link.setAttribute('href', './tablist.css');
    this.shadowRoot.appendChild(link);

    this.summaryRulesElem  = this.shadowRoot.querySelector(`summary-rules`);
    this.gridRuleGroupElem = this.shadowRoot.querySelector(`grid-rule-group`);
    this.infoRuleElem      = this.shadowRoot.querySelector(`info-rule`);
    this.gridRuleGroupElem.setInfoRule(this.infoRuleElem);

  }

  setSidepanel (sidepanelElem) {
    this.gridRuleGroupElem.setSidepanel(sidepanelElem);
  }

  clear () {
    this.summaryRulesElem.clear();
    this.gridRuleGroupElem.clear();
    this.infoRuleElem.clear();
  }

  update (result) {
    this.summaryRulesElem.update(result.rule_summary);
    this.gridRuleGroupElem.update(result.rule_results);
    this.infoRuleElem.update(result.info_rules);
  }

  resize (height) {
    const summaryHeight = this.summaryRulesElem.getBoundingClientRect().height;

    const h = (height - summaryHeight - 56) / 2;

    this.gridRuleGroupElem.setHeight(h);
    this.infoRuleElem.setHeight(h);
  }

}

window.customElements.define("view-rule-group", ViewRuleGroup);

