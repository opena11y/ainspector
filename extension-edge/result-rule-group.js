/* result-rule-group.js */

// Imports

import DebugLogging  from './debug.js';

// Constants

const debug = new DebugLogging('[result-rule-group]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <summary-rules></summary-rules>

  <grid-rule-group>
  </grid-rule-group>

  <rule-info>
  <rule-info>
`;

export default class ResultRuleGroup extends HTMLElement {
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

    this.summaryRulesElem = this.shadowRoot.querySelector(`summary-rules`);
    this.gridRuleGroupElem = this.shadowRoot.querySelector(`grid-rule-group`);
    this.ruleInfoElem = this.shadowRoot.querySelector(`rule-info`);

  }

  setSidepanel (sidepanelElem) {
    this.gridRuleGroupElem.setSidepanel(sidepanelElem);
  }

  clear () {
    this.summaryRulesElem.clear();
    this.gridRuleGroupElem.clear();
  }

  update (result) {
    debug.log(`[update]`);
    this.summaryRulesElem.update(result.summary);
    this.gridRuleGroupElem.update(result.rule_results);
  }

  resize (height) {
    const summaryHeight = this.summaryRulesElem.getBoundingClientRect().height;

    const h = (height - summaryHeight - 38) / 2;

    debug.log(`height: ${height} sumH: ${summaryHeight} h: ${h}`);

    this.gridRuleGroupElem.setHeight(h);
    this.ruleInfoElem.setHeight(h);
  }

}

window.customElements.define("result-rule-group", ResultRuleGroup);

