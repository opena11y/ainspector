/* service-worker.js */

const debug = false;

debug && console.log(`[chrome ]: ${typeof chrome}`);
debug && console.log(`[chrome ][    sidePanel]: ${typeof chrome} ${ chrome ? typeof chrome.sidePanel : ''}`);
debug && console.log(`[opr    ]: ${typeof opr}`);
debug && console.log(`[browser]: ${typeof browser}`);

const browserRuntime = typeof browser === 'object' ?
                       browser.runtime :
                       chrome.runtime;

const browserAction = typeof browser === 'object' ?
            browser.action :
            chrome.action;

/*
 * Toggle sidebar from toolbar icon for Chrome
 */

/*
// Toggle sidebar from toolbar icon for Chrome
if (typeof chrome  === 'object' && chrome.sidePanel) {
  debug && console.log(`[Added Chrome sidePanel]`);
  chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  });
}
*/

// Toggle sidebar from toolbar icon for Firefox
if (typeof browser === 'object' && browser.action) {
  debug && console.log(`[Added Browser Action]`);
  browser.action.onClicked.addListener(function () {
    browser.sidebarAction.toggle();
  });
}

browserRuntime.onMessage.addListener( (request) => {
  if (request.scheme) {
    if (request.scheme === 'dark') {
      browserAction.setIcon({
        path: {
           32: "icons/dark-ai-sidebar-32.png",
           48: "icons/dark-ai-sidebar-48.png",
           64: "icons/dark-ai-sidebar-64.png",
          128: "icons/dark-ai-sidebar-128.png",
        }
      });
    }
    if (request.scheme === 'light') {
      browserAction.setIcon({
        path: {
           32: "icons/light-ai-sidebar-32.png",
           48: "icons/light-ai-sidebar-48.png",
           64: "icons/light-ai-sidebar-64.png",
          128: "icons/light-ai-sidebar-128.png",
        }
      });
    }
  }
});



