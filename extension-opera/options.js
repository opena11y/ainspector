/* options.js */

import { getOptions, saveOptions, defaultOptions } from './storage.js';
import { isCharacterAllowed, validatePrefix, validateShortcut } from './options-validate.js';

// Information dialogs
import InfoDialog from './info-dialog.js';
customElements.define('info-dialog', InfoDialog);

import InfoRulesets from './info-rulesets.js';
customElements.define('info-dialog-rulesets', InfoRulesets);

import InfoWCAGLevels from './info-wcag-levels.js';
customElements.define('info-dialog-wcag-levels', InfoWCAGLevels);

import InfoScopes from './info-scopes.js';
customElements.define('info-dialog-scopes', InfoScopes);

import InfoAriaVersions from './info-aria-versions.js';
customElements.define('info-dialog-aria-versions', InfoAriaVersions);


// Get message strings from locale-specific messages.json file

const browserTabs = typeof browser === 'object' ?
            browser.tabs :
            chrome.tabs;

const browserI18n = typeof browser === 'object' ?
            browser.i18n :
            chrome.i18n;

const getMessage = browserI18n.getMessage;
const msg = {
  optionsEvaluationHeading     : getMessage('optionsEvaluationHeading'),
  optionsExportCSVLabel        : getMessage('optionsExportCSVLabel'),
  optionsExportButtonLegend    : getMessage('optionsExportButtonLegend'),
  optionsExportFormatLegend    : getMessage('optionsExportFormatLegend'),
  optionsExportHeading         : getMessage('optionsExportHeading'),
  optionsExportIncludeDate     : getMessage('optionsExportIncludeDate'),
  optionsExportJSONLabel       : getMessage('optionsExportJSONLabel'),
  optionsExportFilenameLegend  : getMessage('optionsExportFilenameLegend'),
  optionsExportPrefixErrorCharNotAllowed : getMessage('optionsExportPrefixErrorCharNotAllowed'),
  optionsExportPrefixErrorToLong         : getMessage('optionsExportPrefixErrorToLong'),
  optionsExportPrefixLabel     : getMessage('optionsExportPrefixLabel'),
  optionsExportPrompt          : getMessage('optionsExportPrompt'),
  optionsInclPassNaLabel       : getMessage('optionsInclPassNaLabel'),
  optionsInclWcagGlLabel       : getMessage('optionsInclWcagGlLabel'),
  optionsNoDelayLabel          : getMessage('optionsNoDelayLabel'),
  optionsPromptForDelayLabel   : getMessage('optionsPromptForDelayLabel'),
  optionsRerunEvaluationLegend : getMessage('optionsRerunEvaluationLegend'),
  optionsRuleResultsLegend     : getMessage('optionsRuleResultsLegend'),
  optionsTitle                 : getMessage('optionsTitle'),
  optionsViewsMenuLegend       : getMessage('optionsViewsMenuLegend'),
  optionsResetDefaults         : getMessage('optionsResetDefaults'),
  shortcutAllreadyUsed         : getMessage('shortcutAllreadyUsed'),
  shortcutBackLabel            : getMessage('shortcutBackLabel'),
  shortcutCopyLabel            : getMessage('shortcutCopyLabel'),
  shortcutExportLabel          : getMessage('shortcutExportLabel'),
  shortcutRerunLabel           : getMessage('shortcutRerunLabel'),
  shortcutViewsLabel           : getMessage('shortcutViewsLabel'),
  shortcutsEnabledLabel        : getMessage('shortcutsEnabledLabel'),
  shortcutsHeading             : getMessage('shortcutsHeading'),
  shortcutsNote                : getMessage('shortcutsNotes'),
  shortcutsTableAction         : getMessage('shortcutsTableAction'),
  shortcutsTableShortcut       : getMessage('shortcutsTableShortcut')
};

const debug = false;
const inclWcagGl     = document.querySelector('input[id="options-incl-wcag-gl"]');
const noDelay        = document.querySelector('input[id="options-no-delay"]');
const promptForDelay = document.querySelector('input[id="options-prompt-for-delay"]');

// const rulesetStrict  = document.querySelector('input[id="ARIA_STRICT"]');
// const rulesetTrans   = document.querySelector('input[id="ARIA_TRANS"]');
const inclPassNa     = document.querySelector('input[id="options-incl-pass-na"]');

const rulesetRadioFirstStep  = document.querySelector('#options-ruleset-first-step');
const rulesetRadioWCAG20     = document.querySelector('#options-ruleset-wcag20');
const rulesetRadioWCAG21     = document.querySelector('#options-ruleset-wcag21');
const rulesetRadioWCAG22     = document.querySelector('#options-ruleset-wcag22');

const rulesetLevelFieldset  = document.querySelector('#options-levels-fieldset');
const rulesetRadioLevelA    = document.querySelector('#options-ruleset-level-a');
const rulesetRadioLevelAA   = document.querySelector('#options-ruleset-level-aa');
const rulesetCheckboxColorEnhanced = document.querySelector('#options-ruleset-color-enhanced');

const rulesetScopeFieldset  = document.querySelector('#options-scope-fieldset');
const rulesetScopeAll       = document.querySelector('#options-scope-all');
const rulesetScopePage      = document.querySelector('#options-scope-page');
const rulesetScopeWebsite   = document.querySelector('#options-scope-website');

const ariaVersionFieldset  = document.querySelector('#options-aria-versions');
const aria12               = document.querySelector('#options-aria12');
const aria13               = document.querySelector('#options-aria13');

const exportPrompt     = document.querySelector('#options-export-prompt');
const exportCSV        = document.querySelector('#options-export-csv');
const exportJSON       = document.querySelector('#options-export-json');
const exportPrefix     = document.querySelector('#options-export-prefix');
const exportPrefixDesc = document.querySelector('#options-export-prefix-desc');
const exportDate       = document.querySelector('#options-export-date');

const shortcutsEnabledCheckbox  = document.querySelector('#shortcuts-enabled');
const shortcutBackKbd           = document.querySelector('#shortcut-back');
const shortcutViewsTextbox      = document.querySelector('#shortcut-views');
const shortcutExportTextbox     = document.querySelector('#shortcut-export');
const shortcutRerunTextbox      = document.querySelector('#shortcut-rerun');
const shortcutCopyTextbox       = document.querySelector('#shortcut-copy');

const resetDefaults  = document.querySelector('button[id="options-reset-defaults"]');

function setFormLabels () {
  const optionsTitle            = document.querySelector('#tab-general-options');
  const optionsViewsMenuLegend  = document.querySelector('#options-views-menu-legend');
  const optionsInclWcagGlLabel  = document.querySelector('#options-incl-wcag-gl-label');

  const optionsRerunEvaluationLegend = document.querySelector('#options-rerun-evaluation-legend');
  const optionsNoDelayLabel          = document.querySelector('#options-no-delay-label');
  const optionsPromptForDelayLabel   = document.querySelector('#options-prompt-for-delay-label');

  const optionsRuleResultsLegend     = document.querySelector('#options-rule-results-legend');
  const optionsInclPassNaLabel       = document.querySelector('#options-incl-pass-na-label');

  const optionsExportHeading         = document.querySelector('#tab-export-options');
  const optionsExportPromptLabel     = document.querySelector('#options-export-prompt-label');
  const optionsExportButtonLegend    = document.querySelector('#options-export-button-legend');
  const optionsExportFormatLegend    = document.querySelector('#options-export-format-legend');
  const optionsExportCSVLabel        = document.querySelector('#options-export-csv-label');
  const optionsExportJSONLabel       = document.querySelector('#options-export-json-label');
  const optionsExportFilenameLegend  = document.querySelector('#options-filename-legend');
  const optionsExportPrefixLabel     = document.querySelector('#options-export-prefix-label');
  const optionsExportDateLabel       = document.querySelector('#options-export-date-label');

  const shortcutsHeading       = document.querySelector('#tab-shortcut-keys');
  const shortcutsEnabledLabel  = document.querySelector('#shortcuts-enabled-label');
  const shortcutsTableShortcut = document.querySelector('#shortcut-table-shortcut');
  const shortcutsTableAction   = document.querySelector('#shortcut-table-action');
  const shortcutBackLabel     = document.querySelector('#shortcut-back-label');
  const shortcutViewsLabel    = document.querySelector('#shortcut-views-label');
  const shortcutExportLabel   = document.querySelector('#shortcut-export-label');
  const shortcutRerunLabel    = document.querySelector('#shortcut-rerun-label');
  const shortcutCopyLabel     = document.querySelector('#shortcut-copy-label');
  const shortcutsNote         = document.querySelector('#shortcuts-note');


  const optionsResetDefaults  = document.querySelector('#options-reset-defaults');

  optionsTitle.textContent            = msg.optionsTitle;
  optionsViewsMenuLegend.textContent  = msg.optionsViewsMenuLegend;
  optionsInclWcagGlLabel.textContent  = msg.optionsInclWcagGlLabel;
  optionsRerunEvaluationLegend.textContent = msg.optionsRerunEvaluationLegend;
  optionsNoDelayLabel.textContent          = msg.optionsNoDelayLabel;
  optionsPromptForDelayLabel.textContent   = msg.optionsPromptForDelayLabel;

  optionsRuleResultsLegend.textContent     = msg.optionsRuleResultsLegend;
  optionsInclPassNaLabel.textContent       = msg.optionsInclPassNaLabel;

  optionsExportHeading.textContent        = msg.optionsExportHeading;
  optionsExportPromptLabel.textContent    = msg.optionsExportPrompt;
  optionsExportButtonLegend.textContent   = msg.optionsExportButtonLegend;
  optionsExportFormatLegend.textContent   = msg.optionsExportFormatLegend;
  optionsExportCSVLabel.textContent       = msg.optionsExportCSVLabel;
  optionsExportJSONLabel.textContent      = msg.optionsExportJSONLabel;
  optionsExportFilenameLegend.textContent = msg.optionsExportFilenameLegend;
  optionsExportPrefixLabel.textContent    = msg.optionsExportPrefixLabel;
  optionsExportDateLabel.textContent      = msg.optionsExportIncludeDate;

  shortcutsHeading.textContent       = msg.shortcutsHeading;
  shortcutsEnabledLabel.textContent  = msg.shortcutsEnabledLabel;
  shortcutsTableShortcut.textContent = msg.shortcutsTableShortcut;
  shortcutsTableAction.textContent   = msg.shortcutsTableAction;
  shortcutBackLabel.textContent      = msg.shortcutBackLabel;
  shortcutViewsLabel.textContent     = msg.shortcutViewsLabel;
  shortcutExportLabel.textContent    = msg.shortcutExportLabel;
  shortcutRerunLabel.textContent     = msg.shortcutRerunLabel;
  shortcutCopyLabel.textContent      = msg.shortcutCopyLabel;
  shortcutsNote.textContent          = msg.shortcutsNote;

  optionsResetDefaults.textContent         = msg.optionsResetDefaults;
}

// Save user options selected in form and display message

function saveFormOptions (e) {
  e.preventDefault();

  let ruleset = 'WCAG21';

  rulesetLevelFieldset.disabled = false;
  rulesetScopeFieldset.disabled = false;

  if (rulesetRadioFirstStep.checked) {
    ruleset = rulesetRadioFirstStep.value;
    rulesetLevelFieldset.disabled = true;
    rulesetScopeFieldset.disabled = true;
  }
  if (rulesetRadioWCAG20.checked) {
    ruleset = rulesetRadioWCAG20.value;
  }
  if (rulesetRadioWCAG21.checked) {
    ruleset = rulesetRadioWCAG21.value;
  }
  if (rulesetRadioWCAG22.checked) {
    ruleset = rulesetRadioWCAG22.value;
  }

  let level = 'AA';
  if (rulesetRadioLevelA.checked) {
    level = 'A';
    rulesetCheckboxColorEnhanced.checked = false;
    rulesetCheckboxColorEnhanced.disabled = true;
  }
  else {
    rulesetCheckboxColorEnhanced.disabled = false;
  }

  if (rulesetRadioLevelAA.checked) {
    level = 'AA';
  }

  if (rulesetCheckboxColorEnhanced.checked) {
    level = 'AAA';
  }

  let scopeFilter = 'ALL';

  if (rulesetScopeAll.checked) {
    scopeFilter = rulesetScopeAll.value;
  }

  if (rulesetScopePage.checked) {
    scopeFilter = rulesetScopePage.value;
  }

  if (rulesetScopeWebsite.checked) {
    scopeFilter = rulesetScopeWebsite.value;
  }

  let ariaVersion = 'ARIA12';

  if (aria12.checked) {
    ariaVersion = 'ARIA12';
  }

  if (aria13.checked) {
    ariaVersion = 'ARIA13';
  }


  const options = {
  //  rulesetId: (rulesetStrict.checked ? 'ARIA_STRICT' : 'ARIA_TRANS'),
    viewsMenuIncludeGuidelines: inclWcagGl.checked,

    rerunDelayEnabled: promptForDelay.checked,
    resultsIncludePassNa: inclPassNa.checked,
    ruleset: ruleset,
    level: level,
    scopeFilter: scopeFilter,
    ariaVersion: ariaVersion,
    exportFormat: (exportCSV.checked ? 'CSV' : 'JSON'),
    filenamePrefix: validatePrefix(exportPrefix.value),
    includeDate:    exportDate.checked,
    includeTime:    exportDate.checked,
    promptForExportOptions: exportPrompt.checked,

    shortcutCopy:    validateShortcut(shortcutCopyTextbox.value),
    shortcutExport:  validateShortcut(shortcutExportTextbox.value),
    shortcutRerun:   validateShortcut(shortcutRerunTextbox.value),
    shortcutViews:   validateShortcut(shortcutViewsTextbox.value),

    shortcutsEnabled:    shortcutsEnabledCheckbox.checked
  }

  if (debug) console.log(options);
  saveOptions(options);
}

// Update HTML form values based on user options saved in storage.sync

function updateForm (options) {
  // Set form element values and states
  inclWcagGl.checked     = options.viewsMenuIncludeGuidelines;
  noDelay.checked        = !options.rerunDelayEnabled;
  promptForDelay.checked = options.rerunDelayEnabled;
  inclPassNa.checked     = options.resultsIncludePassNa;

  rulesetRadioFirstStep.checked = options.ruleset === rulesetRadioFirstStep.value;
  rulesetLevelFieldset.disabled = options.ruleset === rulesetRadioFirstStep.value;
  rulesetScopeFieldset.disabled = options.ruleset === rulesetRadioFirstStep.value;

  rulesetRadioWCAG20.checked    = options.ruleset === rulesetRadioWCAG20.value;
  rulesetRadioWCAG21.checked    = options.ruleset === rulesetRadioWCAG21.value;
  rulesetRadioWCAG22.checked    = options.ruleset === rulesetRadioWCAG22.value;

  rulesetRadioLevelA.checked    = options.level === 'A';
  rulesetRadioLevelAA.checked    = (options.level === 'AA') || (options.level === 'AAA');
  rulesetCheckboxColorEnhanced.checked = options.level === 'AAA';

  if (rulesetRadioLevelA.checked) {
    rulesetCheckboxColorEnhanced.disabled = true;
  }

  rulesetScopeAll.checked     = options.scopeFilter === rulesetScopeAll.value;
  rulesetScopePage.checked    = options.scopeFilter === rulesetScopePage.value;
  rulesetScopeWebsite.checked = options.scopeFilter === rulesetScopeWebsite.value;

  aria12.checked = options.ariaVersion === aria12.value;
  aria13.checked = options.ariaVersion === aria13.value;

  exportPrompt.checked   = options.promptForExportOptions;
  exportCSV.checked      = options.exportFormat === 'CSV';
  exportJSON.checked     = options.exportFormat === 'JSON';
  exportPrefix.value     = options.filenamePrefix;
  exportDate.checked     = options.includeDate;

//  shortcutBackKbd.textContent      = options.shortcutBack;
  shortcutCopyTextbox.value        = options.shortcutCopy;
  shortcutExportTextbox.value      = options.shortcutExport;
  shortcutRerunTextbox.value       = options.shortcutRerun;
  shortcutViewsTextbox.value       = options.shortcutViews;
  shortcutsEnabledCheckbox.checked = options.shortcutsEnabled;
}

function updateOptionsForm() {
  setFormLabels();
  getOptions().then(updateForm);
}

function saveDefaultOptions () {
  saveOptions(defaultOptions).then(getOptions).then(updateForm);
}

function hidePrefixError() {
  exportPrefixDesc.textContent = '';
  exportPrefixDesc.parentNode.classList.remove('show');
}

function showPrefixError(message) {
  exportPrefixDesc.textContent = message;
  exportPrefixDesc.parentNode.classList.add('show');
}

function onKeydownValidatePrefix (event) {
  hidePrefixError();
  const key = event.key;
  if (!isCharacterAllowed(key)) {
    showPrefixError(msg.optionsExportPrefixErrorCharNotAllowed.replaceAll('$key', `"${key}"`));
    event.stopPropagation();
    event.preventDefault();
  } else {
    if ((key.length === 1) &&
        (exportPrefix.value.length === 16)) {
      showPrefixError(msg.optionsExportPrefixErrorToLong);
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

function onKeyupValidatePrefix () {
  const value = validatePrefix(exportPrefix.value);
  if (value !== exportPrefix.value) {
    if (exportPrefix.value.length >= 16) {
      showPrefixError(msg.optionsExportPrefixErrorToLong);
    }
  }
  exportPrefix.value = value;
}

function checkForDuplicateKey (textbox, key) {

  function checkTextbox (tb) {
    if (tb !== textbox) {
      return tb.value !== key;
    }
    return true;
  }

  let flag = true;
  flag = flag && checkTextbox(shortcutCopyTextbox);
  flag = flag && checkTextbox(shortcutExportTextbox);
  flag = flag && checkTextbox(shortcutRerunTextbox);
  flag = flag && checkTextbox(shortcutViewsTextbox);

  return flag;
}

function clearDesc (target) {
  const descDiv = target.parentNode.querySelector('.feedback');
  if (descDiv) {
    descDiv.classList.remove('show');
  }
  return descDiv;
}

function onShortcutKeydown (event) {
  const tgt = event.currentTarget;
  const descDiv = clearDesc(tgt);
  const key = event.key;
  const currentKey = tgt.value;

  if (key.length === 1) {
    if (checkForDuplicateKey(tgt, key)) {
      tgt.value = key;
      saveFormOptions(event);
    } else {
      if (descDiv) {
        let span = descDiv.querySelector('span');
        if (span) {
          span.textContent = msg.shortcutAllreadyUsed.replace('$key', `"${key}"`);
        }
        descDiv.classList.add('show');
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }
}

function onShortcutBlur (event) {
  const tgt = event.currentTarget;
  const descDiv = clearDesc(tgt);
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
inclWcagGl.addEventListener('change', saveFormOptions);
noDelay.addEventListener('change', saveFormOptions);
promptForDelay.addEventListener('change', saveFormOptions);
// rulesetStrict.addEventListener('change', saveFormOptions);
// rulesetTrans.addEventListener('change', saveFormOptions);
inclPassNa.addEventListener('change', saveFormOptions);

rulesetRadioFirstStep.addEventListener('change', saveFormOptions);
rulesetRadioWCAG20.addEventListener('change', saveFormOptions);
rulesetRadioWCAG21.addEventListener('change', saveFormOptions);
rulesetRadioWCAG22.addEventListener('change', saveFormOptions);

rulesetRadioLevelA.addEventListener('change', saveFormOptions);
rulesetRadioLevelAA.addEventListener('change', saveFormOptions);
rulesetCheckboxColorEnhanced.addEventListener('change', saveFormOptions);

rulesetScopeAll.addEventListener('change', saveFormOptions);
rulesetScopePage.addEventListener('change', saveFormOptions);
rulesetScopeWebsite.addEventListener('change', saveFormOptions);

aria12.addEventListener('change', saveFormOptions);
aria13.addEventListener('change', saveFormOptions);

exportPrompt.addEventListener('change', saveFormOptions);
exportCSV.addEventListener('change', saveFormOptions);
exportJSON.addEventListener('change', saveFormOptions);
exportPrefix.addEventListener('change', saveFormOptions);
exportPrefix.addEventListener('keydown', onKeydownValidatePrefix);
exportPrefix.addEventListener('keyup', onKeyupValidatePrefix);
exportPrefix.addEventListener('blur', hidePrefixError);
exportDate.addEventListener('change', saveFormOptions);

shortcutCopyTextbox.addEventListener('keydown', onShortcutKeydown);
shortcutExportTextbox.addEventListener('keydown', onShortcutKeydown);
shortcutRerunTextbox.addEventListener('keydown', onShortcutKeydown);
shortcutViewsTextbox.addEventListener('keydown', onShortcutKeydown);

shortcutCopyTextbox.addEventListener('blur', onShortcutBlur);
shortcutExportTextbox.addEventListener('blur', onShortcutBlur);
shortcutRerunTextbox.addEventListener('blur', onShortcutBlur);
shortcutViewsTextbox.addEventListener('blur', onShortcutBlur);

shortcutsEnabledCheckbox.addEventListener('change', saveFormOptions);

resetDefaults.addEventListener('click', saveDefaultOptions);

browserTabs.onActivated.addListener( (activeInfo) => {
  getOptions().then(updateForm);
});
