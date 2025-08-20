/*
*   storage.js
*/

import {
  getMessage
} from './utils.js';

import DebugLogging from './debug.js';

/* constants */

const debug = new DebugLogging('storage', false);
debug.flag = false;

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

const browserStorage = typeof browser === 'object' ?
                       browser.storage.local :
                       chrome.storage.sync;

// Generic error handler
function notLastError () {
  if (!browserRuntime.lastError) { return true; }
  else {
    debug && console.log(browserRuntime.lastError.message);
    return false;
  }
}

export const rulesetOptions = {
  ruleset: 'WCAG21',
  level : 'AA',
  scopeFilter: 'ALL',
  ariaVersion: 'ARIA12',
};

export const generalOptions = {
  resultsIncludePassNa: true,
  rerunDelayEnabled: true,
  rerunDelayValue: '5',
  viewsMenuIncludeGuidelines: true,
  isSidebarOpen: false,
  highlight: 'selected',
  documentationURL: 'https://opena11y.github.io/evaluation-library/concepts.html',
  lastTabId: ''
};

export const exportOptions = {
  projectTitle: '',
  evaluatorName: '',
  exportFormat: 'CSV',  // other option is JSON
  filenamePrefix: 'ainspector',
  filenameAllRules: 'all-rules{date}{time}{index}',
  filenameRuleGroup: 'rule-group-{group}-{index}',
  filenameRuleResult: 'rule-result-{rule}-{index}',
  includeDate: true,
  includeTime: true,
  filenameIndex: 1,
  promptForExportOptions: true,
};

export const shortcutOptions = {
  shortcutBack:  getMessage('shortcutDefaultBack'),
  shortcutViews: getMessage('shortcutDefaultViews'),
  shortcutExport:getMessage('shortcutDefaultExport'),
  shortcutRerun: getMessage('shortcutDefaultRerun'),
  shortcutCopy:  getMessage('shortcutDefaultCopy'),
  shortcutsEnabled: false,
};


const defaultOptions = Object.assign(rulesetOptions, generalOptions, exportOptions, shortcutOptions)

/*
**  getOptions
*/
export function getOptions () {
  return new Promise (function (resolve, reject) {
    let promise = browserStorage.get();
    promise.then(
      options => {
        if (isComplete(options)) {
          resolve(options);
        }
        else {
          const optionsWithDefaults = addDefaultValues(options);
          saveOptions(optionsWithDefaults);
          resolve(optionsWithDefaults);
        }
      },
      message => { reject(new Error(`getOptions: ${message}`)) }
    );
  });
}

/*
**  saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
    let promise = browserStorage.set(options);
    promise.then(
      () => { resolve() },
      message => { reject(new Error(`saveOptions: ${message}`)) }
    );
  });
}

/*
**  saveOption
*
*   @desc  Saves a specific option
*/
export function saveOption (option, value) {
  return new Promise (function (resolve) {
     getOptions().then( (options) => {
      options[option] = value;
      saveOptions(options).then(() => {
        if (notLastError()) { resolve(); }
      });
    });
  });
}

/*
** resetDefaultOptions
*/
export function resetDefaultOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(defaultOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetRulesetOptions
*/
export function resetRulesetOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(rulesetOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetGeneralOptions
*/
export function resetGeneralOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(generalOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetExportOptions
*/
export function resetExportOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(exportOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
** resetShortcutOptions
*/
export function resetShortcutOptions () {
  return new Promise (function (resolve, reject) {
    browserStorage.set(shortcutOptions, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
**  setScopeFilterToAll
*/
export function setScopeFilterToAll (options) {
  return new Promise (function (resolve, reject) {
    options.scopeFilter = 'ALL';
    () => { resolve(options); },
    message => { reject(new Error(`resetScopeFilterToAll: ${message}`)) }
  });
}

/*
*   Helper functions
*/
function hasAllProperties (refObj, srcObj) {
  for (const key of Object.keys(refObj)) {
    if (!srcObj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function isComplete (obj) {
  const numOptions = Object.keys(defaultOptions).length;
  if (Object.keys(obj).length !== numOptions) {
    return false;
  }
  return hasAllProperties(defaultOptions, obj);
}

function addDefaultValues (options) {
  const copy = Object.assign({}, defaultOptions);
  for (let [key, value] of Object.entries(options)) {
    if (copy.hasOwnProperty(key)) {
      copy[key] = value;
    }
  }
  return copy;
}
