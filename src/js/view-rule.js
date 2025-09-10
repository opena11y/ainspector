/* view-rule.js */

// Imports

import DebugLogging  from './debug.js';

// Constants

const debug = new DebugLogging('[view-rule]', false);
debug.flag = true;

const template = document.createElement('template');
template.innerHTML = `
  <summary-rule></summary-rule>

  <grid-rule>
  </grid-rule>

  <info-result>
  <info-result>
`;

export default class ViewRule extends HTMLElement {
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

    this.summaryRuleElem  = this.shadowRoot.querySelector(`summary-rule`);
    this.gridRuleElem     = this.shadowRoot.querySelector(`grid-rule`);
    this.infoResultElem  = this.shadowRoot.querySelector(`info-result`);
    this.gridRuleElem.setInfoElement(this.infoResultElem);

  }

  setSidepanel (sidepanelElem) {
    this.gridRuleElem.setSidepanel(sidepanelElem);
  }

  clear () {
    debug.flag && debug.log(`[clear]`);
    this.summaryRuleElem.clear();
    this.gridRuleElem.clear();
    this.infoResultElem.clear();
  }

  update (result) {
    debug.flag && debug.log(`[update]`);
    debug.flag && debug.log(`[update][element_summary]: ${result.element_summary}`);
    debug.flag && debug.log(`[update][violations]: ${result.element_summary.violations}`);
    this.summaryRuleElem.update(result.element_summary);
    this.gridRuleElem.update(result.website_result, result.page_result, result.element_results);
    this.infoResultElem.update(result.website_result, result.page_result, result.element_results);
  }

  resize (height) {
    const summaryHeight = this.summaryRuleElem.getBoundingClientRect().height;

    const h = (height - summaryHeight - 50) / 2;

    this.gridRuleElem.setHeight(h);
    this.infoResultElem.setHeight(h);
  }

}

window.customElements.define("view-rule", ViewRule);

