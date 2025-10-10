/* ai-sidepanel.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  addContentToElement,
  getMessage,
  setI18nLabels
} from './utils.js';

import {
  getOptions,
  saveOptions
} from './storage.js';

import {
  getRuleCategoryFilenameId,
  getGuidelineFilenameId
} from './constants.js';

import {
  getCSVForAllRules
} from './csv-all-rules.js';

import {
  getCSVForRuleGroup
} from './csv-rule-group.js';

import {
  getCSVForRule
} from './csv-rule.js';


/* Constants */

const debug = new DebugLogging('ai-sidepanel', false);
debug.flag = false;

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

const browserDownloads   = typeof browser === 'object' ?
                       browser.downloads :
                       chrome.downloads;

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
    <view-rules-all></view-rules-all>
    <view-rule-group hidden></view-rule-group>
    <view-rule hidden></view-rule>
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
        <button id="export-data"
          aria-haspop="true"
          aria-controls="dialog"
          aria-live="off"
          data-i18n="export_data_button_label">
          Export
        </button>
      </div>
    </div>
  </footer>
  <export-dialog></export-dialog>
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
    this.rerunButtonElem = this.shadowRoot.querySelector(`rerun-evaluation-button`);
    this.rerunButtonElem.setActivationCallback(this.runEvaluation.bind(this));

    // Element references

    this.containerElem  = this.shadowRoot.querySelector(`#container`);
    this.headerElem     = this.shadowRoot.querySelector(`header`);
    this.mainElem       = this.shadowRoot.querySelector(`main`);
    this.footerElem     = this.shadowRoot.querySelector(`footer`);

    this.viewTitleElem    = this.shadowRoot.querySelector(`#view-title`);
    this.infoTitleElem    = this.shadowRoot.querySelector(`#info-title`);
    this.infoLocationElem = this.shadowRoot.querySelector(`#info-location`);
    this.infoRulesetElem  = this.shadowRoot.querySelector(`#info-ruleset`);

    this.viewRulesAllElem  = this.shadowRoot.querySelector(`view-rules-all`);
    this.viewRulesAllElem.setSidepanel(this);
    this.viewRuleGroupElem = this.shadowRoot.querySelector(`view-rule-group`);
    this.viewRuleGroupElem.setSidepanel(this);
    this.viewRuleElem      = this.shadowRoot.querySelector(`view-rule`);
    this.viewRuleElem.setSidepanel(this);

    // Side panel states
    this.resultView  = 'rules-all';
    this.ruleGroupId = '';
    this.ruleId      = '';
    this.highlightOption = 'selection';
    this.highlightPosition = '';
    this.lastResult = {};

    // Update side panel title

    document.querySelector('title').textContent = getMessage('extension_name_chrome');

    const version = browserRuntime.getManifest().version;
    this.setAttribute('version', version);

    setI18nLabels(this.shadowRoot);

    this.backButtonElem   = this.shadowRoot.querySelector(`#back-button`);
    this.backButtonElem.addEventListener('click', this.handleBackButtonClick.bind(this));

    this.exportButtonElem   = this.shadowRoot.querySelector(`#export-data`);
    this.exportButtonElem.addEventListener('click', this.handleExportButtonClick.bind(this));

    this.exportDialogElem = this.shadowRoot.querySelector('export-dialog');
    this.exportDialogElem.dialog.addEventListener("close", this.handleExportDialogClose.bind(this));

    this.viewsMenuButtonElem = this.shadowRoot.querySelector(`views-menu-button`);
    this.viewsMenuButtonElem.setActivationCallback(this.setView.bind(this));

    /*
    *   Add Window event listeners
    */
    window.addEventListener('load', this.handleWindowLoad.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));

    document.body.addEventListener('keydown', this.handleShortcutsKeydown.bind(this));

    // Setup a port to identify when side panel is open
    browserRuntime.connect({ name: 'ai-sidepanel-open' });

    browserRuntime.onMessage.addListener((request, sender, sendResponse) => {
      if (request['ai-sidepanel-open'] === true) {
        sendResponse(true);
      }
    });
    this.handleResize();
  }

  setRuleGroup(group_id) {
    this.ruleGroupId = group_id;
  }

  setRule(rule_id) {
    this.ruleId = rule_id;
  }

  clearView(message1 = '', message2 = '') {
    this.infoTitleElem.textContent    = message2;
    this.infoLocationElem.textContent = message1;
    this.infoRulesetElem.textContent  = '';

    this.viewRulesAllElem.clear(message1, message2);
    this.viewRuleGroupElem.clear(message1, message2);
    this.viewRuleElem.clear(message1, message2);
  }

  updateView(result) {
    this.infoTitleElem.textContent    = result.title;
    this.infoLocationElem.textContent = result.location;
    this.infoRulesetElem.textContent  = result.ruleset_label;

    debug.flag && debug.log(`[result][        title]: ${result.title}`);
    debug.flag && debug.log(`[result][     location]: ${result.location}`);
    debug.flag && debug.log(`[result][ruleset_label]: ${result.ruleset_label}`);
    debug.flag && debug.log(`[result][  result_view]: ${result.result_view}`);

    this.lastResult = result;

    switch (result.result_view) {
      case 'rules-all':
        this.viewTitleElem.textContent = getMessage('view_title_all_rules_Label');
        this.backButtonElem.disabled = true;
        this.viewRuleGroupElem.setAttribute('hidden', '');
        this.viewRuleElem.setAttribute('hidden', '');
        this.viewRulesAllElem.removeAttribute('hidden');
        this.viewRulesAllElem.update(result);
        break;

      case 'rule-group':
        addContentToElement(this.viewTitleElem, result.group_title, true);
        this.backButtonElem.disabled = false;
        this.viewRulesAllElem.setAttribute('hidden', '');
        this.viewRuleElem.setAttribute('hidden', '');
        this.viewRuleGroupElem.removeAttribute('hidden');
        this.viewRuleGroupElem.update(result);
        this.handleResize();
        break;

      case 'rule':
        addContentToElement(this.viewTitleElem, result.rule_title, true);
        this.backButtonElem.disabled = false;
        this.viewRulesAllElem.setAttribute('hidden', '');
        this.viewRuleGroupElem.setAttribute('hidden', '');
        this.viewRuleElem.removeAttribute('hidden');
        this.viewRuleElem.update(result);
        this.handleResize();
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
      aiSidePanelObj.clearView(getMessage('protocol_not_supported'),getMessage('unable_to_retrieve'));
      onError();
    }

    getOptions().then( (options) => {

      aiSidePanelObj.request = {
        aiRunEvaluation: {
          ruleset:          options.ruleset,
          level :           options.level,
          scope_filter:     options.scopeFilter,
          aria_version:     options.ariaVersion,
          highlight_option: options.highlightOption,

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

  highlightResult(position, highlightId, resultType,  focus=true) {

    getOptions().then( (options) => {

      async function sendHighlightMessage(tabs) {
        for (const tab of tabs) {
          const myResult = await myBrowser.tabs
            .sendMessage(tab.id, {highlight: {
                                      option: options.highlightOption,
                                      position: position,
                                      result_type: resultType,
                                      focus: focus,
                                      highlightId: highlightId
                                    }
                                  });
          debug.flag && debug.log(`[myResult]: ${myResult}`);
        }
      }

      myBrowser.tabs
        .query({
          currentWindow: true,
          active: true,
        })
        .then(sendHighlightMessage)
        .catch(onError);
    });

  }

  async sendMessageToTabs(tabs) {
    debug.flag && debug.log(`[sendMessageToTabs]`);

    const aiSidePanelObj = this;

    for (const tab of tabs) {
      const myResult = await myBrowser.tabs
        .sendMessage(tab.id, aiSidePanelObj.request);
        debug.flag && debug.log(`[myResult]: ${myResult} ${aiSidePanelObj}`);
        aiSidePanelObj.updateView(myResult);
    }

  }

  // UI Event handlers

  handleBackButtonClick () {
    this.resultView = this.resultView === 'rule' ? 'rule-group' : 'rules-all';
    this.runEvaluation();
  }

  handleExportButtonClick () {
    getOptions().then( (options) => {
      if (options.promptForExportOptions) {
        this.exportDialogElem.openDialog();
      } else {
        this.exportData();
      }
    });
  }

  //-----------------------------------------------
  //  Methods that handle tab and window events
  //-----------------------------------------------

  handleWindowLoad () {
    debug.flag && debug.log(`[handleWindowLoad]`);
    browserTabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    browserTabs.onActivated.addListener(this.handleTabActivated.bind(this));
    myBrowser.windows.onFocusChanged.addListener(this.handleWindowFocusChanged.bind(this));

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

    debug.flag && this.logTabUrl(activeInfo);

    const that = this;

    function onErrorPotocol(error) {
      that.clearView(getMessage('protocol_not_supported'),getMessage('unable_to_retrieve'));
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

  handleExportDialogClose() {
    if (this.exportDialogElem.returnValue === 'export') {
      this.exportData();
    }
  }

  exportData () {

    function incrementIndex() {
      getOptions().then( (options) => {
        options.filenameIndex = parseInt(options.filenameIndex) + 1;
        saveOptions(options);
      });
    }

    function onFailed(error) {
      console.error(`Download failed: ${error}`);
    }

    let blob;

    getOptions().then( (options) => {
      let filename = options.filenamePrefix + '-';

      if (options.includeIndex) {
        filename += options.filenameIndex.toString().padStart(4, "0") + '-';
      }

      if (options.includeDateTime) {
        const today = new Date();

        // Add today's date
        filename += `${String(today.getFullYear())}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-`;

        // Add time of day
        filename += `${today.getHours()}h-${today.getMinutes()}m-${today.getSeconds()}s-`;
      }

      const parts = this.ruleGroupId.split('-');
      const isRuleCategory = parts[0] === 'rc';
      const groupId = parseInt(parts[1]);

      const ruleId = this.ruleId.toLowerCase().replace('_', '-');

      switch (this.resultView) {
        case 'rules-all':
          filename += options.filenameAllRules;
          break;

        case 'rule-group':
          filename += isRuleCategory ?
                  options.filenameRuleGroup.replace('{groupId}', getRuleCategoryFilenameId(groupId)) :
                  options.filenameRuleGroup.replace('{groupId}', getGuidelineFilenameId(groupId));
          break;

        case 'rule':
          filename += options.filenameRule.replace('{ruleId}', ruleId);
          break;
      }


      filename += '.' + options.exportFormat.toLowerCase();

      if (options.exportFormat === 'CSV') {
        blob = new Blob([this.getCSVContent()], {
         type: "text/csv;charset=utf-8"
        });
      }
      else {
        blob = new Blob([this.getJSONContent()], {
         type: "application/json;charset=utf-8"
        });
      }

      let downloading = browserDownloads.download({
        url : URL.createObjectURL(blob),
        filename : filename,
        saveAs: true,
        conflictAction : 'uniquify'
      });
      downloading.then(incrementIndex, onFailed);
    });
  }

  getCSVContent() {
    if (this.resultView === 'rules-all') {
      return getCSVForAllRules(this.lastResult);
    }
    else {
      if (this.resultView === 'rule-group') {
        return getCSVForRuleGroup(this.ruleGroupId, this.lastResult);
      }
    }
    return getCSVForRule(this.lastResult);
  }

  getJSONContent() {
    return JSON.stringify(this.lastResult, null, 2);
  }


  handleShortcutsKeydown (event) {
    let flag = false;

    if (!event.metaKey &&
        !event.ctrlKey &&
        !this.rerunButtonElem.isOpen() &&
        !this.exportDialogElem.isOpen() &&
        !this.viewsMenuButtonElem.isOpen()) {
      getOptions().then( (options) => {

        if (options.shortcutsEnabled) {

          if (event.key === options.shortcutBack) {
            if (!this.backButtonElem.disabled) {
              this.backButtonElem.click();
            }
            flag = true;
          }

          if (event.key === options.shortcutCopy) {
            switch (this.resultView) {

              case 'rule-group':
                this.viewRuleGroupElem.copy();
                break;

              case 'rule':
                this.viewRuleElem.copy();
                break;
            }
            flag = true;
          }

          if (event.key === options.shortcutExport) {
            if (!this.exportButtonElem.disabled) {
              this.exportButtonElem.click();
            }
            flag = true;
          }

          if (event.key === options.shortcutRerun) {
            if (!this.rerunButtonElem.disabled) {
              this.rerunButtonElem.click();
            }
            flag = true;
          }

          if (event.key === options.shortcutViews) {
            if (!this.viewsMenuButtonElem.disabled) {
              this.viewsMenuButtonElem.click();
            }
            flag = true;
          }

          if (flag) {
            event.preventDefault();
            event.stopPropagation();
          }
        }

      });
    }
  }


  handleResize () {

    const osAdjustHeight = 10;
    const osAdjustWidth = 10;

    const screenHeight = window.innerHeight - osAdjustHeight;
    const screenWidth  = window.innerWidth - osAdjustWidth;
    const adjHeight = Math.max(610, screenHeight);
    const adjWidth  = screenWidth - 15;
    this.containerElem.style.height = adjHeight + 'px';
    this.containerElem.style.width  = adjWidth + 'px';

    const headerHeight    = this.headerElem.getBoundingClientRect().height;
    const footerHeight    = this.footerElem.getBoundingClientRect().height;

    const height = adjHeight - headerHeight - footerHeight;

    this.viewRulesAllElem.resize(height);
    this.viewRuleGroupElem.resize(height);
    this.viewRuleElem.resize(height);

  }

  handleOptionsClick () {
     browserRuntime.openOptionsPage();
  }

}

window.customElements.define('ai-sidepanel', AISidePanel);


