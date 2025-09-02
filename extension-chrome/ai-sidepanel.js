/* ai-sidepanel.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  getMessage,
  setI18nLabels
} from './utils.js';

import {
  getOptions
} from './storage.js';

/* Constants */

const debug = new DebugLogging('ai-sidepanel', false);
debug.flag = true;

// Browser Constants

const isMozilla = typeof browser === 'object';

const myBrowser = typeof browser === 'object' ?
              browser :
              chrome;

const browserTabs = typeof browser === 'object' ?
            browser.tabs :
            chrome.tabs;

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;


let myWindowId = -1;  // used for checking if a tab is in the same window as the sidebar

/* Utility functions */

/*
**  @function onError
*/

function onError(error) {
  console.error(`Error: ${error}`);
}

/* templates */
const template = document.createElement('template');
template.innerHTML = `
<div id="container">
  <header>
    <h1 id="view-title"
        aria-live="polite"
        data-i18n="view_title_all_rules_Label">
    </h1>
    <div class="buttons">
      <button id="back-button">
          <svg xmlns='http://www.w3.org/2000/svg'
               class='down'
               width='12'
               height='12'
               viewBox='0 0 12 12'>
            <polygon points='1 6, 11 1, 11 11' fill='currentColor'/>
          </svg>
          <span data-i18n="back_button_label">
          </span>
      </button>
      <views-menu-button></views-menu-button>
    </div>
  </header>

  <main>
    <result-rules-all></result-rules-all>
    <result-rule-group hidden></result-rule-group>
  </main>

  <footer>

    <div class="info">
      <span class="label"
            data-i18n="info_title_label">
      </span>
      <span id="info-title"
            class="value"
            aria-live="polite">
      </span>
    </div>

    <div class="info">
      <span class="label"
            data-i18n="info_location_label">
      </span>
      <span  id="info-location"
             class="value">
      </span>
    </div>

    <div class="info">
      <span class="label"
            data-i18n="info_ruleset_label">
      </span>
      <span id="info-ruleset"
            class="value">
      </span>
    </div>

    <div class="buttons">
      <div class="first">
        <button id="options-button"
                data-i18n="options_button_label">
        </button>
      </div>
      <div class="second">
        <rerun-evaluation-button></rerun-evaluation-button>
      </div>
      <div class="third">
        <export-button></export-button>
      </div>
    </div>

  </footer>
</div>
`;

class AISidePanel extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Use external CSS style sheets
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'base.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'ai-sidepanel.css');
    this.shadowRoot.appendChild(link);

    // Options button
    const optionsButton = this.shadowRoot.querySelector(`#options-button`);
    optionsButton.addEventListener('click', this.handleOptionsClick.bind(this));

    // Rerun button
    const rerunButton = this.shadowRoot.querySelector(`rerun-evaluation-button`);
    rerunButton.setActivationCallback(this.runEvaluation.bind(this));

    // Element references

    this.containerElem  = this.shadowRoot.querySelector(`#container`);
    this.headerElem     = this.shadowRoot.querySelector(`header`);
    this.mainElem       = this.shadowRoot.querySelector(`main`);
    this.footerElem     = this.shadowRoot.querySelector(`footer`);

    this.viewTitleElem    = this.shadowRoot.querySelector(`#view-title`);
    this.infoTitleElem    = this.shadowRoot.querySelector(`#info-title`);
    this.infoLocationElem = this.shadowRoot.querySelector(`#info-location`);
    this.infoRulesetElem  = this.shadowRoot.querySelector(`#info-ruleset`);

    this.resultRulesAllElem  = this.shadowRoot.querySelector(`result-rules-all`);
    this.resultRulesAllElem.setSidepanel(this);
    this.resultRuleGroupElem = this.shadowRoot.querySelector(`result-rule-group`);
    this.resultRuleGroupElem.setSidepanel(this);

    // Side panel states
    this.resultView = 'rules-all';
    this.ruleGroupId = '';
    this.ruleId = '';

    // Update side panel title

    document.querySelector('title').textContent = getMessage('extension_name_chrome');

    const version = browserRuntime.getManifest().version;
    this.setAttribute('version', version);

    setI18nLabels(this.shadowRoot);

    this.backButtonElem   = this.shadowRoot.querySelector(`#back-button`);
    this.backButtonElem.addEventListener('click', this.handleBackButtonClick.bind(this));

    /*
    *   Add Window event listeners
    */
    window.addEventListener('load', this.handleWindowLoad.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));

    // Setup a port to identify when side panel is open
    browserRuntime.connect({ name: 'ai-sidepanel-open' });

    browserRuntime.onMessage.addListener((request, sender, sendResponse) => {
      if (request['ai-sidepanel-open'] === true) {
        sendResponse(true);
      }
    });

    this.handleResize();
  }

  setRuleGroup(id) {
    this.ruleGroupId = id;
  }

  clearView(message = '') {
    this.infoTitleElem.textContent    = message;
    this.infoLocationElem.textContent = '';
    this.infoRulesetElem.textContent  = '';

    this.resultRulesAllElem.clear();
    this.resultRuleGroupElem.clear();
  }

  updateView(result) {
    this.infoTitleElem.textContent    = result.title;
    this.infoLocationElem.textContent = result.location;
    this.infoRulesetElem.textContent  = result.ruleset_label;

    switch (result.result_view) {
      case 'rules-all':
        this.viewTitleElem.textContent = getMessage('view_title_all_rules_Label');
        this.backButtonElem.disabled = true;
        this.resultRuleGroupElem.setAttribute('hidden', '');
        this.resultRulesAllElem.removeAttribute('hidden');
        this.resultRulesAllElem.update(result);
        break;

      case 'rule-group':
        debug.log(`[result_view]: rule-group`);
        this.viewTitleElem.textContent = result.groupTitle;
        this.backButtonElem.disabled = false;
        this.resultRulesAllElem.setAttribute('hidden', '');
        this.resultRuleGroupElem.removeAttribute('hidden');
        this.resultRuleGroupElem.update(result);
        this.handleResize();
        break;

      case 'rule':
        this.viewTitleElem.textContent = this.groupId;
        this.backButtonElem.disabled = false;
        break;

      default:
        break;

    }

  }

  setView (view, id) {
    this.resultView = view;

    switch (view) {
      case 'rule-group':
        this.ruleGroupId = id;
        break;

      case 'rule':
        this.ruleId = id;
        break;
    }
    this.runEvaluation();
  }

  runEvaluation() {
    this.clearView(getMessage('loading_content'));

    const aiSidePanelObj = this;

    function onRunEvaluationError() {
      aiSidePanelObj.clearView(getMessage('protocol_not_supported'));
      onError();
    }

    getOptions().then( (options) => {

      aiSidePanelObj.request = {
        aiRunEvaluation: {
          ruleset:       options.ruleset,
          level :        options.level,
          scope_filter:  options.scopeFilter,
          aria_version:  options.ariaVersion,
          result_view:   aiSidePanelObj.resultView,
          rule_group_id: aiSidePanelObj.ruleGroupId,
          rule_id:       aiSidePanelObj.ruleId
        }
      };

      myBrowser.tabs
        .query({
          currentWindow: true,
          active: true,
        })
        .then(this.sendMessageToTabs.bind(this))
        .catch(onRunEvaluationError);

    });

  }

  highlightOrdinalPosition(ordinalPosition, info='') {

    if (!ordinalPosition) {
      ordinalPosition='';
      info='';
    }

    async function sendHighlightMessage(tabs) {
      for (const tab of tabs) {
        const myResult = await myBrowser.tabs
          .sendMessage(tab.id, {highlight: {
                                    position: ordinalPosition,
                                    info: info
                                  }
                                });
        debug.log(`[myResult]: ${myResult}`);
      }
    }

    myBrowser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(sendHighlightMessage)
      .catch(onError);
  }

  updateHighlightConfig(options) {

    async function sendHighlightMessage(tabs) {
      for (const tab of tabs) {
        const myResult = await myBrowser.tabs
          .sendMessage(tab.id, { updateHighlightConfig: {
                                    size: options.highlightSize,
                                    style: options.highlightStyle
                                  }
                                });
        debug.log(`[myResult]: ${myResult}`);
      }
    }

    myBrowser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(sendHighlightMessage)
      .catch(onError);
  }

  focusOrdinalPosition(ordinalPosition) {

    async function sendFocusMessage(tabs) {
      for (const tab of tabs) {
        const myResult = await myBrowser.tabs
          .sendMessage(tab.id, { focusPosition : ordinalPosition });
        debug.log(`[myResult]: ${myResult}`);
      }
    }

    myBrowser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(sendFocusMessage)
      .catch(onError);
  }


  handleGetInformationClick () {
    this.clearView(getMessage('loading_content'));

    myBrowser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(this.sendMessageToTabs.bind(this))
      .catch(onError);

  }

  async sendMessageToTabs(tabs) {
    debug.flag && debug.log(`[sendMessageToTabs]`);

    const aiSidePanelObj = this;

    for (const tab of tabs) {
      const myResult = await myBrowser.tabs
        .sendMessage(tab.id, aiSidePanelObj.request);
        debug.log(`[myResult]: ${myResult} ${aiSidePanelObj}`);
        aiSidePanelObj.updateView(myResult);
    }

  }

  // UI Event handlers

  handleBackButtonClick () {
    this.resultView = this.resultView === 'rule' ? 'rule-group' : 'rules-all';
    this.runEvaluation();
  }

  //-----------------------------------------------
  //  Methods that handle tab and window events
  //-----------------------------------------------

  handleWindowLoad () {
    debug.flag && debug.log(`[handleWindowLoad]`);
    browserTabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    browserTabs.onActivated.addListener(this.handleTabActivated.bind(this));
    myBrowser.windows.onFocusChanged.addListener(this.handleWindowFocusChanged.bind(this));

    getOptions().then( (options) => {
      this.updateHighlightConfig(options);
    });
    this.runEvaluation();
  }

  /*
  **  Handle tabs.onUpdated event when status is 'complete'
  */
  handleTabUpdated (tabId, changeInfo, tab) {
    debug.flag && debug.log(`[handleTabUpdated]: ${tabId}`);

    // Skip content update when new page is loaded in background tab
    if (!tab.active) return;

    if (changeInfo.status === "complete") {
      this.lastStatus = changeInfo.status;
      this.runEvaluation();
    }
    else {
      if (changeInfo.status !== this.lastStatus) {
        this.lastStatus = changeInfo.status;
        this.clearView(getMessage('loading_content'));
      }
    }
  }

  /*
  **  Handle tabs.onActivated event
  */
  handleTabActivated (activeInfo) {
    debug.flag && debug.log(`[handleTabActivated]`);

    this.logTabUrl(activeInfo);

    const that = this;

    function onErrorPotocol(error) {
      that.clearView(getMessage('protocol_not_supported'));
      onError(error);
    }

    myBrowser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(this.sendMessageToTabs.bind(this))
      .catch(onErrorPotocol);

  }

  /*
  **  @function logTabUrl
  */

  async logTabUrl(info) {
    try {
      let tab = await browserTabs.get(info.tabId);
      console.log(`[handleTabActivated][ myWindowId]: ${myWindowId}`);
      console.log(`[handleTabActivated][   windowId]: ${tab.windowId}`);
      console.log(`[handleTabActivated][same window]: ${tab.windowId === myWindowId}`);
      console.log(`[handleTabActivated][         id]: ${tab.id}`);
      console.log(`[handleTabActivated][        url]: ${tab.url}`);
    }
    catch (error) {
      console.error(error);
    }
  }

  /*
  **  Handle window focus change events: If the sidebar is open in the newly
  **  focused window, save the new window ID and update the sidebar content.
  */
  handleWindowFocusChanged (windowId) {
    debug.flag && debug.log(`[handleWindowFocusChanged]: ${windowId}`);

    if (windowId !== myWindowId) {
      if (isMozilla) {
        let checkingOpenStatus = myBrowser.sidebarAction.isOpen({ windowId });
        checkingOpenStatus.then(onGotStatus, onInvalidId);
      }
    }

    function onGotStatus (result) {
      if (result) {
        myWindowId = windowId;
        this.runEvaluation();
      }
    }

    function onInvalidId (error) {
      debug.flag && debug.log(`onInvalidId: ${error}`);
    }
  }

  handleResize () {
    const screenHeight = window.innerHeight;
    const screenWidth  = window.innerWidth;
    const adjHeight = Math.max(610, screenHeight);
    const adjWidth  = screenWidth - 15;
    this.containerElem.style.height = adjHeight + 'px';
    this.containerElem.style.width  = adjWidth + 'px';

    const headerHeight    = this.headerElem.getBoundingClientRect().height;
    const mainHeight      = this.mainElem.getBoundingClientRect().height;
    const footerHeight    = this.footerElem.getBoundingClientRect().height;

    const height = adjHeight - headerHeight - footerHeight;

    debug.log(`sH: ${screenHeight} hH: ${headerHeight} mH: ${mainHeight} fH: ${footerHeight}`);
    debug.log(`[height]: ${height} total: ${headerHeight+mainHeight+footerHeight}`);

    this.resultRulesAllElem.resize(height);
    this.resultRuleGroupElem.resize(height);

  }

  handleOptionsClick () {
     browserRuntime.openOptionsPage();
  }

}

window.customElements.define('ai-sidepanel', AISidePanel);



