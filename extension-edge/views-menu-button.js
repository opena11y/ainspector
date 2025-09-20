/* views-menu-button.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getOptions
} from './storage.js';

import {
  getMessage,
  isOverElement,
  removeChildContent
} from './utils.js';

import {
  guidelineIds,
  ruleCategoryIds,
  getGuidelineLabelId,
  getRuleCategoryLabelId
} from './constants.js';

// Constants

const debug = new DebugLogging('[views-menu-button]', false);
debug.flag = true;

const template = document.createElement('template');
template.innerHTML = `
    <div class="views-menu-button">
      <button id="button"
        aria-haspop="true"
        aria-controls="menu">
        <span class="label">Views</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="down" width="12" height="9" viewBox="0 0 12 9">
          <polygon points="1 0, 11 0, 6 8"/>
        </svg>
      </button>
      <div role="menu"
        id="menu"
        aria-labelledby="button">
      </div>
    </div>
`;

export default class ViewsMenuButton extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });

    // Use external CSS stylesheet
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'views-menu-button.css');
    this.shadowRoot.appendChild(link);

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Get references

    this.callback = null;

    this.containerDiv = this.shadowRoot.querySelector('div.views-menu-button');

    this.button  = this.shadowRoot.querySelector('button');
    this.labelSpan = this.button.querySelector('.label');
    this.labelSpan.textContent = getMessage('views_menu_button_label');
    this.button.addEventListener('click', this.handleButtonClick.bind(this));
    this.button.addEventListener('keydown', this.handleButtonKeydown.bind(this));

    this.menuDiv = this.shadowRoot.querySelector('[role="menu"]');

    this.includeGuidelines = true;

    this.menuitems = [];
    this.firstMenuitem = false;
    this.lastMenuitem = false;
    this.firstChars = [];

    this.closePopup();

    window.addEventListener(
      'pointerdown',
      this.handleBackgroundPointerdown.bind(this),
      true
    );

  }

  set disabled (value) {
    this.button.disabled = value;
  }

  get disabled () {
    return this.button.disabled;
  }

  setActivationCallback (callback) {
    this.callback = callback;
  }

  addGroup(node, label) {
    const groupDiv = document.createElement('div');
    groupDiv.setAttribute('role', 'group');
    groupDiv.setAttribute('aria-label', label);
    node.appendChild(groupDiv);
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = label;
    groupDiv.appendChild(div);
    return groupDiv;
  }

  addMenuitem(node, optionId, message) {
    const menuitemDiv = document.createElement('div');

    menuitemDiv.id = optionId;
    menuitemDiv.tabIndex = -1;
    menuitemDiv.setAttribute('role', 'menuitem');
    menuitemDiv.addEventListener('keydown', this.handleMenuitemKeydown.bind(this));
    menuitemDiv.textContent = message;

    node.appendChild(menuitemDiv);

    this.menuitems.push(menuitemDiv);
    if (!this.firstMenuitem) {
      this.firstMenuitem = menuitemDiv;
    }
    this.lastMenuitem = menuitemDiv;

    this.firstChars.push(menuitemDiv.textContent.trim()[0].toLowerCase());

    menuitemDiv.addEventListener(
      'keydown',
      this.handleMenuitemKeydown.bind(this)
    );
    menuitemDiv.addEventListener(
      'click',
      this.handleMenuitemClick.bind(this)
    );
  }

  initMenu (options) {
    let msgId;

    removeChildContent(this.menuDiv);
    this.menuitems = [];
    this.firstMenuitem = false;
    this.lastMenuitem = false;
    this.firstChars = [];

    this.addMenuitem(this.menuDiv, 'summary', getMessage('summary_label'));
    const rcGroupDiv = this.addGroup(this.menuDiv, getMessage('rule_categories_label'));

    for (let i = 0; i < ruleCategoryIds.length; i += 1 ) {
      const rcId = ruleCategoryIds[i];
      msgId = getRuleCategoryLabelId(rcId);
      this.addMenuitem(rcGroupDiv, `rc-${rcId}`, getMessage(msgId));
    }

    if (options.viewsMenuIncludeGuidelines) {
      const glGroupDiv = this.addGroup(this.menuDiv, getMessage('guidelines_label'));
      for (let i = 0; i < guidelineIds.length; i += 1 ) {
        const glId = guidelineIds[i];
        // cannot have periods in the msgId, so converted to underscore character
        msgId = getGuidelineLabelId(glId);
        this.addMenuitem(glGroupDiv, `gl-${glId}`, getMessage(msgId));
      }
    }
  }

  setFocusToMenuitem(newMenuitem) {
    this.menuitems.forEach(function (item) {
      if (item === newMenuitem) {
        item.tabIndex = 0;
        newMenuitem.focus();
      } else {
        item.tabIndex = -1;
      }
    });
  }

  setFocusToFirstMenuitem() {
    this.setFocusToMenuitem(this.firstMenuitem);
  }

  setFocusToLastMenuitem() {
    this.setFocusToMenuitem(this.lastMenuitem);
  }

  setFocusToPreviousMenuitem(currentMenuitem) {
    let newMenuitem, index;

    if (currentMenuitem === this.firstMenuitem) {
      newMenuitem = this.lastMenuitem;
    } else {
      index = this.menuitems.indexOf(currentMenuitem);
      newMenuitem = this.menuitems[index - 1];
    }
    this.setFocusToMenuitem(newMenuitem);
    return newMenuitem;
  }

  setFocusToNextMenuitem(currentMenuitem) {
    let newMenuitem, index;

    if (currentMenuitem === this.lastMenuitem) {
      newMenuitem = this.firstMenuitem;
    } else {
      index = this.menuitems.indexOf(currentMenuitem);
      newMenuitem = this.menuitems[index + 1];
    }
    this.setFocusToMenuitem(newMenuitem);

    return newMenuitem;
  }

  setFocusByFirstCharacter(currentMenuitem, char) {
    let start, index;

    if (char.length > 1) {
      return;
    }

    char = char.toLowerCase();

    // Get start index for search based on position of currentItem
    start = this.menuitems.indexOf(currentMenuitem) + 1;
    if (start >= this.menuitems.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = this.firstChars.indexOf(char, start);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = this.firstChars.indexOf(char, 0);
    }

    // If match was found...
    if (index > -1) {
      this.setFocusToMenuitem(this.menuitems[index]);
    }
  }

  // Utilities

  getIndexFirstChars(startIndex, char) {
    for (let i = startIndex; i < this.firstChars.length; i++) {
      if (char === this.firstChars[i]) {
        return i;
      }
    }
    return -1;
  }

  // Popup menu methods

  openPopup(setFirst = true) {
    getOptions().then( (options) => {
      this.initMenu(options);
      this.menuDiv.style.display = 'block';
      this.button.setAttribute('aria-expanded', 'true');
      if (setFirst) {
        this.setFocusToFirstMenuitem();
      } else {
        this.setFocusToLastMenuitem();
      }
    });
  }

  closePopup() {
    if (this.isOpen()) {
      this.button.removeAttribute('aria-expanded');
      this.menuDiv.style.display = 'none';
    }
  }

  isOpen() {
    return this.button.getAttribute('aria-expanded') === 'true';
  }

  // Menu event onrs

  handleButtonKeydown(event) {
    var key = event.key,
      flag = false;

    switch (key) {
      case ' ':
      case 'Enter':
      case 'ArrowDown':
        this.openPopup();
        flag = true;
        break;

      case 'Escape':
        this.closePopup();
        flag = true;
        break;

      case 'ArrowUp':
        this.openPopup(false);
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

  handleButtonClick(event) {
    if (this.isOpen()) {
      this.closePopup();
    } else {
      this.openPopup();
    }

    event.stopPropagation();
    event.preventDefault();
  }

  performMenuAction(tgt) {
    const id = tgt.id;
    debug.flag && debug.log(`[performMenuAction][id]: ${id}`);
    if (this.callback) {
      if (id === 'summary') {
        this.callback('rules-all', '');
      }
      else {
        this.callback('rule-group', id);
      }
    }
  }

  handleMenuitemKeydown(event) {
    var tgt = event.currentTarget,
      key = event.key,
      flag = false;

    function isPrintableCharacter(str) {
      return str.length === 1 && str.match(/\S/);
    }

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    if (event.shiftKey) {
      if (isPrintableCharacter(key)) {
        this.setFocusByFirstCharacter(tgt, key);
        flag = true;
      }

      if (event.key === 'Tab') {
        this.button.focus();
        this.closePopup();
        flag = true;
      }
    } else {
      switch (key) {
        case ' ':
        case 'Enter':
          this.closePopup();
          this.performMenuAction(tgt);
          this.button.focus();
          flag = true;
          break;

        case 'Escape':
          this.closePopup();
          this.button.focus();
          flag = true;
          break;

        case 'ArrowUp':
          this.setFocusToPreviousMenuitem(tgt);
          flag = true;
          break;

        case 'ArrowDown':
          this.setFocusToNextMenuitem(tgt);
          flag = true;
          break;

        case 'Home':
        case 'PageUp':
          this.setFocusToFirstMenuitem();
          flag = true;
          break;

        case 'End':
        case 'PageDown':
          this.setFocusToLastMenuitem();
          flag = true;
          break;

        case 'Tab':
          this.closePopup();
          break;

        default:
          if (isPrintableCharacter(key)) {
            this.setFocusByFirstCharacter(tgt, key);
            flag = true;
          }
          break;
      }
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleMenuitemClick(event) {
    var tgt = event.currentTarget;
    this.closePopup();
    this.button.focus();
    this.performMenuAction(tgt);
  }

  handleBackgroundPointerdown(event) {
    if (!isOverElement(this.button, event.clientX, event.clientY) &&
        !isOverElement(this.menuDiv, event.clientX, event.clientY)) {
      if (this.isOpen()) {
        this.closePopup();
      }
    }
  }
}

window.customElements.define("views-menu-button", ViewsMenuButton);
