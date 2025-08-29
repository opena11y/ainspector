/* ai-sidepanel.js */

/* Imports */
import DebugLogging  from './debug.js';

import {
  getMessage,
  setI18nLabels,
//  updateContent,
//  updateHighlightConfig
} from './utils.js';

import {
  getOptions
} from './storage.js';

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
        aria-live="polite">
      Summary: All Rules
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
    <result-all-rules></result-all-rules>
  </main>

  <footer>

    <div class="info">
      <span class="label"
            data-i18n="info_title_label">
      </span>:
      <span id="info-title"
            class="value"
            aria-live="polite">
      </span>
    </div>

    <div class="info">
      <span class="label"
            data-i18n="info_location_label">
      </span>:
      <span  id="info-location"
             class="value">
      </span>
    </div>

    <div class="info">
      <span class="label"
            data-i18n="info_ruleset_label">
      </span>:
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

    this.lastStatus = '';


    // Update side panel title

    document.querySelector('title').textContent = getMessage('extension_name_chrome');

    const version = browserRuntime.getManifest().version;
    this.setAttribute('version', version);

    setI18nLabels(this.shadowRoot, debug.flag);

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
  }

  clearContent(message = '') {
    debug.flag && debug.log(`[clearContent]: ${message}`);
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


  updateContent() {
    this.clearContent(getMessage('loading_content'));

    const spObj = this;

    function onUpdateContentError() {
      spObj.clearContent(getMessage('protocol_not_supported'));
      onError();
    }
    myBrowser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(this.sendMessageToTabs.bind(this))
      .catch(onUpdateContentError);
  }

  handleGetInformationClick () {
    this.clearContent(getMessage('loading_content'));

    myBrowser.tabs
      .query({
        currentWindow: true,
        active: true,
      })
      .then(this.sendMessageToTabs.bind(this))
      .catch(onError);

  }

  async sendMessageToTabs(tabs) {
    const aiSidePanelObj = this;

    for (const tab of tabs) {
      const myResult = await myBrowser.tabs
        .sendMessage(tab.id, { runEvaluation : true });

        debug.log(`[myResult]: ${myResult} ${aiSidePanelObj}`);
//      aiSidePanelObj.aiTablistNode.updateContent(myResult);
    }
  }

  //-----------------------------------------------
  //  Methods that handle tab and window events
  //-----------------------------------------------

  handleWindowLoad () {
    browserTabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    browserTabs.onActivated.addListener(this.handleTabActivated.bind(this));
    myBrowser.windows.onFocusChanged.addListener(this.handleWindowFocusChanged.bind(this));

    getOptions().then( (options) => {
      this.updateHighlightConfig(options);
    });
    this.updateContent();
  }

  /*
  **  Handle tabs.onUpdated event when status is 'complete'
  */
  handleTabUpdated (tabId, changeInfo, tab) {
    // Skip content update when new page is loaded in background tab
    if (!tab.active) return;

    if (changeInfo.status === "complete") {
      this.lastStatus = changeInfo.status;
      this.updateContent();
    }
    else {
      if (changeInfo.status !== this.lastStatus) {
        this.lastStatus = changeInfo.status;
        this.clearContent(getMessage('loading_content'));
      }
    }
  }

  /*
  **  Handle tabs.onActivated event
  */
  handleTabActivated (activeInfo) {
    this.logTabUrl(activeInfo);

    const that = this;

    function onErrorPotocol(error) {
      that.clearContent(getMessage('protocol_not_supported'));
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
    if (windowId !== myWindowId) {
      if (isMozilla) {
        let checkingOpenStatus = myBrowser.sidebarAction.isOpen({ windowId });
        checkingOpenStatus.then(onGotStatus, onInvalidId);
      }
    }

    function onGotStatus (result) {
      if (result) {
        myWindowId = windowId;
        this.updateContent();
      }
    }

    function onInvalidId (error) {
      debug.flag && debug.log(`onInvalidId: ${error}`);
    }
  }

  handleResize () {
//    this.tocTablistNode.resize();
  }

}

window.customElements.define('ai-sidepanel', AISidePanel);



