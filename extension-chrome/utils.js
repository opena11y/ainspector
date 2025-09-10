/* utils.js */

// Imports

import DebugLogging  from './debug.js';


// Constants

const debug = new DebugLogging('[util]', false);
debug.flag = false;


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
**  @function updateContent
*/

export function updateContent () {
  const sidepanelNode = document.querySelector('ai-sidepanel');
  if (sidepanelNode) {
    sidepanelNode.updateContent();
  }
}

/*
**  @function highlightOrdinalPosition
*/

export function highlightOrdinalPosition (ordinalPosition, info='') {
  const sidepanelNode = document.querySelector('ai-sidepanel');
  if (sidepanelNode) {
    sidepanelNode.highlightOrdinalPosition(ordinalPosition, info);
  }
}

/*
**  @function updateHighlightConfig
*/

export function updateHighlightConfig (options) {
  const sidepanelNode = document.querySelector('ai-sidepanel');
  if (sidepanelNode) {
    sidepanelNode.updateHighlightConfig(options);
  }
}

/*
**  @function focusOrdinalPosition
*/

export function focusOrdinalPosition (ordinalPosition) {
  const sidepanelNode = document.querySelector('ai-sidepanel');
  if (sidepanelNode) {
    sidepanelNode.focusOrdinalPosition(ordinalPosition);
  }
}

/*
 * @function isOverElement
 *
 * @desc Returns true if pointer over an element
 *
 * @param {Object}   elem  DOM element node
 * @param {Number}   x     client x coordinator of pointer
 * @param {Number}   y     client y coordinator of pointer
 *
 * @return {object}  see @desc
 */

export function isOverElement(elem, x, y) {
  const rect = elem.getBoundingClientRect();

  return (rect.left <= x) &&
         (rect.right >= x) &&
         (rect.top <= y) &&
         (rect.bottom >= y);
}

  // if the info is a string just use textContent
  // if the info is an array, create a list of items
  // Some items maybe an object containing a 'url' and 'title' properties
export function renderContent(elem, info, style='') {
  let i, div, ul, li, a, item;
  if (!info) return;
  if (typeof info === 'string') {
    div = document.createElement('div');
    div.className = style;
    addContentToElement(div, info);
    elem.appendChild(div);
  } else {
    if (info.url) {
      debug.log(`[url]: ${info.title} ${info.url}`);
      div = document.createElement('div');
      div.className = style;
      a = document.createElement('a');
      a.href = info.url;
      addContentToElement(a, info.title);
      a.target = "_ai_reference";
      div.appendChild(a);
      elem.appendChild(div);
    }
    else {
      if (info.length) {
        ul = document.createElement('ul');
        ul.className = style;
        for (i = 0; i < info.length; i += 1) {
          li = document.createElement('li');
          item = info[i];
          if (typeof item === 'string') {
            addContentToElement(li, item);
          } else {
            if (item.url) {
              a = document.createElement('a');
              a.href = item.url;
              addContentToElement(a, item.title);
              a.target="_ai_reference";
              li.appendChild(a);
            } else {
              addContentToElement(li, item.title);
            }
          }
          ul.appendChild(li);
        }
        elem.appendChild(ul);
      }
    }
  }
}


/**
 * @function addContentToElement
 *
 * @desc Parses a text string for the code element and adds the content
 *       to an element node
 *
 * @param {Object}  elem     elem    - Node of element to add content
 * @param {String or number} content - Content to add to node
 * @param {Boolen} clear     clear   - Flag to remove any content from the node before adding
 */

export function addContentToElement (elem, content, clear=false) {

  if (clear) {
    while(elem.hasChildNodes()) {
      elem.removeChild(elem.firstChild);
    }
  }

  let n, i, j, k;

  if (typeof content !== 'string') {
    try {
      content = content.toString();
    }
    catch (error) {
      content = "[error]: " + error;
    }
  }

  i = content.indexOf('@');
  k = content.indexOf('^');
  j = 0;

  while ((i >= 0) || (k >= 0)) {
    if (i > k) {
      n = document.createTextNode(content.substring(j,i));
      elem.appendChild(n);

      j = content.indexOf('@', i+1);
      if (j < 0) {
        j = content.length - 1;
      }

      n = document.createElement('code');
      addContentToElement(n, content.substring((i+1),j));
      elem.appendChild(n);
      j += 1;

      i = content.indexOf('@', j);
    }
    else {
      n = document.createTextNode(content.substring(j,k));
      elem.appendChild(n);

      j = content.indexOf('^', k+1);
      if (j < 0) {
        j = content.length - 1;
      }

      n = document.createElement('b');
      addContentToElement(n, content.substring((k+1),j));
      elem.appendChild(n);
      j += 1;

      k = content.indexOf('^', j);
    }
  }

  if (j < content.length) {
    n = document.createTextNode(content.substring(j));
    elem.appendChild(n);
  }

}


export function getResultAccessibleName (result) {
    let accName = getMessage('not_applicable_label');

    switch (result){
      case 'MC':
        accName = getMessage('manual_check_label');
        break;

      case 'P':
        accName = getMessage('passed_label');
        break;

      case 'V':
        accName = getMessage('violationLabel');
        break;

      case 'W':
        accName = getMessage('warning_label');
        break;

      default:
        break;
    }
    return accName;
  }
