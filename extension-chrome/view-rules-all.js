/* view-rules-all.js */

// Imports

import DebugLogging  from './debug.js';

import {
  setI18nLabels
} from './utils.js';

import {
  getOptions,
  saveOption
} from './storage.js';

// Constants

const debug = new DebugLogging('[view-rules-all]', false);
debug.flag = false;


const template = document.createElement('template');
template.innerHTML = `
  <summary-rules></summary-rules>

  <div class="tablist">
    <div role="tablist">
      <div class="tab"
           role="tab"
           id="tab-rule-categories"
           aria-controls="tabpanel-rule-categories">
        <span class="focus">
          <span data-i18n="rule_categories_label">
             Rule Categories
          </span>
        </span>
      </div>
      <div class="tab"
           role="tab"
           id="tab-wcag-guidelines"
           aria-controls="tabpanel-wcag-guidelines">
        <span class="focus">
          <span data-i18n="guidelines_label">
             WCAG Guidelines
          </span>
        </span>
      </div>
    </div>

    <div class="tabpanel"
         role="tabpanel"
         id="tabpanel-rule-categories"
         aria-labelledby="tab-rule-categories">

         <grid-rules-all id="rc">
         </grid-rules-all>

    </div>

    <div class="tabpanel"
         role="tabpanel"
         id="tabpanel-wcag-guidelines"
         aria-labelledby="tab-wcag-guidelines">

         <grid-rules-all id="gl">
         </grid-rules-all>

    </div>
  </div>
`;

export default class ViewRulesAll extends HTMLElement {
  constructor () {
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

    this.divTablist      = this.shadowRoot.querySelector('[role="tablist"]');
    this.divTabpanels    = this.shadowRoot.querySelector('#tabpanels');

    this.optionsRuleset    = this.shadowRoot.querySelector('options-ruleset');
    this.optionsGeneral    = this.shadowRoot.querySelector('options-general');

    this.tabNodes = [];

    this.firstTab = null;
    this.lastTab = null;

    this.tabNodes = Array.from(this.divTablist.querySelectorAll('[role=tab]'));
    this.tabpanels = [];

    this.tabNodes.forEach( (tabNode) => {
      const tabpanel = {};

      const tabpanelNode =  this.shadowRoot.querySelector(`#${tabNode.getAttribute('aria-controls')}`);

      tabNode.tabIndex = -1;
      tabNode.setAttribute('aria-selected', 'false');

      tabpanel.node = tabpanelNode;
      tabpanel.contentNode = tabpanelNode.firstElementChild;

      this.tabpanels.push(tabpanel);

      tabNode.addEventListener('keydown', this.handleTabKeydown.bind(this));
      tabNode.addEventListener('click',   this.handleTabClick.bind(this));

      if (!this.firstTab) {
        this.firstTab = tabNode;
      }
      this.lastTab = tabNode;
    });

    setI18nLabels(this.shadowRoot, debug.flag);

    this.summaryRulesElem = this.shadowRoot.querySelector('summary-rules');
    this.rcGridElem = this.shadowRoot.querySelector('#rc');
    this.rcGridElem.setSidepanel(this);
    this.glGridElem = this.shadowRoot.querySelector('#gl');
    this.glGridElem.setSidepanel(this);

    getOptions().then((options) => {

      const lastAllRulesTabId = options.lastAllRulesTabId ?
                                this.shadowRoot.querySelector(`#${options.lastAllRulesTabId}`) :
                                null;

      if (options.lastAllRulesTabId && lastAllRulesTabId) {
        this.setSelectedTab(lastAllRulesTabId, false);
      }
      else {
        this.setSelectedTab(this.firstTab, false);
      }
    });

  }

  setSidepanel (sidepanelElem) {
    this.rcGridElem.setSidepanel(sidepanelElem);
    this.glGridElem.setSidepanel(sidepanelElem);
  }

  // Result content functions

  update (result) {
    this.summaryRulesElem.update(result.rule_summary);
    this.rcGridElem.update(result.rc_rule_results_group);
    this.glGridElem.update(result.gl_rule_results_group);
  }

  clear () {
    this.summaryRulesElem.clear();
    this.rcGridElem.clear();
    this.glGridElem.clear();
  }

  resize (height) {
    debug.flag && debug.log(`[height]: ${height}`);
  }

  // Tablist support functions and handlers

  setSelectedTab(currentTab, setFocus) {
    const resultAllRules = this;

    if (typeof setFocus !== 'boolean') {
      setFocus = true;
    }

    saveOption('lastAllRulesTabId', currentTab.id).then( () => {
      for (var i = 0; i < this.tabNodes.length; i += 1) {
        var tab = this.tabNodes[i];
        if (currentTab === tab) {
          tab.setAttribute('aria-selected', 'true');
          tab.tabIndex = 0;
          resultAllRules.tabpanels[i].node.classList.remove('is-hidden');
          if (setFocus) {
            tab.focus();
          }
        } else {
          tab.setAttribute('aria-selected', 'false');
          tab.tabIndex = -1;
          resultAllRules.tabpanels[i].node.classList.add('is-hidden');
        }
      }
    });
  }

  setSelectedToPreviousTab(currentTab) {
    var index;

    if (currentTab === this.firstTab) {
      this.setSelectedTab(this.lastTab);
    } else {
      index = this.tabNodes.indexOf(currentTab);
      this.setSelectedTab(this.tabNodes[index - 1]);
    }
  }

  setSelectedToNextTab(currentTab) {
    var index;

    if (currentTab === this.lastTab) {
      this.setSelectedTab(this.firstTab);
    } else {
      index = this.tabNodes.indexOf(currentTab);
      this.setSelectedTab(this.tabNodes[index + 1]);
    }
  }

  /* EVENT HANDLERS for TABLIST */

  handleTabKeydown(event) {
    const tgt = event.currentTarget;
    let flag = false;

    switch (event.key) {
      case 'ArrowLeft':
        this.setSelectedToPreviousTab(tgt);
        flag = true;
        break;

      case 'ArrowRight':
        this.setSelectedToNextTab(tgt);
        flag = true;
        break;

      case 'Home':
        this.setSelectedTab(this.firstTab);
        flag = true;
        break;

      case 'End':
        this.setSelectedTab(this.lastTab);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleTabClick(event) {
    this.setSelectedTab(event.currentTarget);
  }
}

window.customElements.define("view-rules-all", ViewRulesAll);

