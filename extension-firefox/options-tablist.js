/* options-tablist.js */

/* Imports */

import DebugLogging from './debug.js';

import {
  setI18nLabels
} from './utils.js';

import {
  getOptions,
  saveOption
} from './storage.js';

/* Constants */

const debug = new DebugLogging('options-tablist', false);
debug.flag = false;

/* templates */
const template = document.createElement('template');
template.innerHTML = `
  <div class="tablist">
      <div role="tablist">
        <div class="tab"
             role="tab"
             aria-controls="tabpanel-ruleset-options"
             id="tab-ruleset-options">
          <span class="focus">
            <span data-i18n="options_tab_ruleset_label">
               Ruleset Options
            </span>
          </span>
        </div>
        <div class="tab"
             role="tab"
             aria-controls="tabpanel-general-options"
             id="tab-general-options">
          <span class="focus">
            <span data-i18n="options_tab_general_label">
               General
            </span>
          </span>
        </div>
        <div class="tab"
             role="tab"
             aria-controls="tabpanel-export-options"
             id="tab-export-options">
             <span class="focus">
               <span data-i18n="options_tab_export_label">
                Data Export
               </span>
            </span>
        </div>

        <div class="tab"
             role="tab"
             id="tab-shortcut-keys"
             aria-controls="tabpanel-shortcut-keys">
             <span class="focus">
               <span data-i18n="options_tab_shortcuts_label">
                 Shortcut Keys
              </span>
            </span>
        </div>

      </div>

      <div class="tabpanel"
           role="tabpanel"
           id="tabpanel-ruleset-options"
           aria-labelledby="tab-ruleset-options">
           <options-ruleset></options-ruleset>
      </div>

      <div class="tabpanel"
           role="tabpanel"
           id="tabpanel-general-options"
           aria-labelledby="tab-general-options">
           <options-general></options-general>
      </div>

      <div class="tabpanel"
           role="tabpanel"
           id="tabpanel-export-options"
           aria-labelledby="tab-export-options">
           <options-data-export></options-data-export>
      </div>

      <div class="tabpanel"
           role="tabpanel"
           id="tabpanel-shortcut-keys"
           aria-labelledby="tab-shortcut-keys">
           <options-shortcuts></options-shortcuts>
      </div>

  </div>
`;

class OptionsTablist extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    // Use external CSS stylesheets
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'base.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', './tablist.css');
    this.shadowRoot.appendChild(link);


    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.divTitle        = this.shadowRoot.querySelector('#id-div-title');
    this.divTablist      = this.shadowRoot.querySelector('[role="tablist"]');

    this.optionsRuleset    = this.shadowRoot.querySelector('options-ruleset');
    this.optionsGeneral    = this.shadowRoot.querySelector('options-general');
    this.optionsDataExport = this.shadowRoot.querySelector('options-data-export');
    this.optionsShortcuts  = this.shadowRoot.querySelector('options-shortcuts');

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

    getOptions().then((options) => {

      const lastTabNode = options.lastTabId ?
                          this.shadowRoot.querySelector(`#${options.lastTabId}`) :
                          null;

      if (options.lastTabId && lastTabNode) {
        this.setSelectedTab(lastTabNode, false);
      }
      else {
        this.setSelectedTab(this.firstTab, false);
      }
    });

  }
  // Tablist support functions and handlers

  setSelectedTab(currentTab, setFocus) {
    const tabListObj = this;
    if (typeof setFocus !== 'boolean') {
      setFocus = true;
    }

    saveOption('lastTabId', currentTab.id).then( () => {
      for (var i = 0; i < this.tabNodes.length; i += 1) {
        var tab = this.tabNodes[i];
        if (currentTab === tab) {
          tab.setAttribute('aria-selected', 'true');
          tab.tabIndex = 0;
          tabListObj.tabpanels[i].node.classList.remove('is-hidden');
          tabListObj.tabpanels[i].contentNode.setAttribute('visible', 'true');
          if (setFocus) {
            tab.focus();
          }
        } else {
          tab.setAttribute('aria-selected', 'false');
          tab.tabIndex = -1;
          tabListObj.tabpanels[i].node.classList.add('is-hidden');
          tabListObj.tabpanels[i].contentNode.setAttribute('visible', 'false');
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

  /* EVENT HANDLERS */

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

window.customElements.define('options-tablist', OptionsTablist);



