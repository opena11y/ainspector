/* info-rule.js */

// Imports

import DebugLogging  from './debug.js';

import {
  setI18nLabels
} from './utils.js';

// Constants

const debug = new DebugLogging('[info-rule]', false);
debug.flag = false;

const template = document.createElement('template');
template.innerHTML = `
  <div id="container">
    <h2 data-i18n="rule_selected_label"></h2>
    <div class="rule-info">
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
    link.setAttribute('href', './rule-info.css');
    this.shadowRoot.appendChild(link);

    setI18nLabels(this.shadowRoot, debug.flag);

  }

  clear () {

  }

  update (id) {
    debug.log(`[udpate][id]: ${id}`);
  }

  setHeight (height) {

    const h2Elem = this.shadowRoot.querySelector('h2');
    const divElem = this.shadowRoot.querySelector('div.rule-info');

    const h2Height = h2Elem.getBoundingClientRect().height;

    divElem.style.height = (height - h2Height) + 'px';

  }

}

window.customElements.define("info-rule", InfoRule);

