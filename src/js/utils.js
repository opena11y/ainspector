/* utils.js */

/* Utility functions */

const browserI18n = typeof browser === 'object' ?
            browser.i18n :
            chrome.i18n;

/*
**  @function removeChildContent
*/

export function removeChildContent(node) {
   while(node.firstChild) {
    node.removeChild(node.firstChild);
   }
}

/*
**  @function setI18nLabels
*/

export function getMessage (id, debug=false) {
  const msg = browserI18n.getMessage(id);
  return msg ? msg + (debug ? ' (i18n)' : '') : `message not found: ${id}`;
}

/*
**  @function setI18nLabels
*/

export function setI18nLabels (docNode, debug=false) {
    const i18nLabels =  Array.from(docNode.querySelectorAll('[data-i18n]'));

    i18nLabels.forEach( node => {
      const label = browserI18n.getMessage(node.getAttribute('data-i18n'));
      if (label) {
        node.textContent = label + (debug ? ' (i18n)' : '');
      }
      else {
        console.error(`[node][ textContent]: ${node.getAttribute('data-i18n')}`);
        console.error(`[label][textContent]: ${label}`);
      }
    });

    const i18nLabelsAriaLabel =  Array.from(docNode.querySelectorAll('[data-i18n-aria-label]'));

    i18nLabelsAriaLabel.forEach( node => {
      const label = browserI18n.getMessage(node.getAttribute('data-i18n-aria-label'));
      if (label) {
        node.setAttribute('aria-label', label + (debug ? ' (i18n)' : ''));
      }
      else {
        console.error(`[node][ aria-label]: ${node.getAttribute('data-i18n-aria-label')}`);
        console.error(`[label][aria-label]: ${label}`);
      }
    });

    const i18nLabelsTitle =  Array.from(docNode.querySelectorAll('[data-i18n-title]'));

    i18nLabelsTitle.forEach( node => {
      const label = browserI18n.getMessage(node.getAttribute('data-i18n-title'));
      if (label) {
        node.title = label + (debug ? ' (i18n)' : '');
      }
      else {
        console.error(`[node][ title]: ${node.getAttribute('data-i18n-aria-label')}`);
        console.error(`[label][title]: ${label}`);
      }
    });

  }

/*
**  @function setTablistAttr
*/

export function setTablistAttr (attr, value) {
    const sidepanelNode = document.querySelector('toc-sidepanel');
    const tablistNode   = sidepanelNode.shadowRoot.querySelector('toc-tablist');
    if (tablistNode) {
      tablistNode.setAttribute(attr, value);
    }
  }

/*
**  @function updateContent
*/

export function updateContent () {
  const sidepanelNode = document.querySelector('toc-sidepanel');
  if (sidepanelNode) {
    sidepanelNode.updateContent();
  }
}

/*
**  @function highlightOrdinalPosition
*/

export function highlightOrdinalPosition (ordinalPosition, info='') {
  const sidepanelNode = document.querySelector('toc-sidepanel');
  if (sidepanelNode) {
    sidepanelNode.highlightOrdinalPosition(ordinalPosition, info);
  }
}

/*
**  @function updateHighlightConfig
*/

export function updateHighlightConfig (options) {
  const sidepanelNode = document.querySelector('toc-sidepanel');
  if (sidepanelNode) {
    sidepanelNode.updateHighlightConfig(options);
  }
}

/*
**  @function focusOrdinalPosition
*/

export function focusOrdinalPosition (ordinalPosition) {
  const sidepanelNode = document.querySelector('toc-sidepanel');
  if (sidepanelNode) {
    sidepanelNode.focusOrdinalPosition(ordinalPosition);
  }
}


