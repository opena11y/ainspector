/* result-all-rules.js */

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

const debug = new DebugLogging('[result-all-rules]', false);
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

         <result-grid-rule-categories>
         </result-grid-rule-categories>

    </div>

    <div class="tabpanel"
         role="tabpanel"
         id="tabpanel-wcag-guidelines"
         aria-labelledby="tab-wcag-guidelines">

         <result-grid-wcag-guidelines>
         </result-grid-wcag-guidelines>

    </div>
  </div>
  <button id="details">
    <span data-i18n="details_label">
    </span>
    <svg xmlns='http://www.w3.org/2000/svg'
         class='down'
         width='12'
         height='12'
         viewBox='0 0 12 12'>
      <polygon points='1 1, 1 11, 11 6' fill='currentColor'/>
    </svg>
  </button>
`;

export default class ResultRulesAll extends HTMLElement {
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

    const linkFocus = document.createElement('link');
    linkFocus.setAttribute('rel', 'stylesheet');
    linkFocus.setAttribute('href', './tablist.css');
    this.shadowRoot.appendChild(linkFocus);

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

  // Result content functions

  update () {
  }

  clear () {
    this.summaryRulesElem.clear();
  }

  resize () {
  }

  setSummary (summary) {
    this.summaryRulesElem.violations    = summary.violations;
    this.summaryRulesElem.warnings      = summary.warnings;
    this.summaryRulesElem.manual_checks = summary.manual_checks;
    this.summaryRulesElem.passed        = summary.passed;
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

window.customElements.define("result-rules-all", ResultRulesAll);

