/* ai-highlight.js */

/*
 *   @class HighlightElement
 *
 */

class AIHighlightELement extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.textContent = `
:root {
  color-scheme: light dark;
}

.ai-highlight {
  --font-family: Arial, Verdana, Tahoma, "Trebuchet MS", sans-serif;
  --font-size: 10pt;
  --font-weight: bold;

  --orange: hsl(21.6, 100%, 50.98%);      /* Illini Blue */
  --orange-dark: hsl(21.6, 100%, 49.02%);

  --violations-color-light:     hsl(0, 100%, 50%);
  --violations-color-dark:      hsl(0, 100%, 50%);

  --warnings-color-light:       hsl(49, 100%, 50%);
  --warnings-color-dark:        hsl(49, 100%, 50%);

  --manual-checks-color-light:  hsl(198, 52%, 40%);
  --manual-checks-color-dark:   hsl(198, 52%, 60%);

  --passed-color-light:         hsl(90, 67%, 40%);
  --passed-color-dark:          hsl(90, 67%, 60%);

  --hidden-color-light:         hsl(0, 0%, 87%);
  --hidden-color-dark:          hsl(0, 0%, 13%);

  --light-gray: hsl(0, 0%, 80%);
  --light-gray-dark: hsl(0, 0%, 20%);

  --yellow-color: hsl(42, 82%, 60%);
  --yellow-color-dark: hsl(42, 82%, 40%);

  --border-color-light: var(--blue);
  --border-color-dark: var(--blue-dark);

  --text-color-light: #fff;
  --text-color-dark: #000;

  --focus-color-light: var(--orange);
  --focus-color-dark: var(--orange-dark);

  --overlay-color-light: var(--light-gray);
  --overlay-color-dark: var(--light-gray-dark);

  --hidden-text-color-light: #000;
  --hidden-text-color-dark: #fff;
  --hidden-background-light: var(--yellow-color);
  --hidden-background-dark: var(--yellow-color-dark);

  --focus-color: var(--orange);
  --focus-color-dark: var(--orange-dark);

  --border-radius: 5px;
  --border-width: 2px;
  --border-style: solid;
  --overlay-border-width: 4px;
  --info-border-width: 1px;
  --border-offset: -3px;
  --overlay-adjust: 2px;


  --z-index-highlight: 199999;
}

.overlay {
  margin: 0;
  padding: 0;
  position: absolute;
  background: transparent;
  border-radius: var(--border-radius);
  border-width: var(--overlay-border-width);
  border-style: solid;
  border-color: light-dark(var(--light-gray), var(--light-gray-dark));
  pointer-events:none;
  z-index: var(--z-index-highlight);
}

.overlay.focus {
  outline: 2px dashed light-dark(var(--focus-color-light), var(--focus-color-dark));
  outline-offset: 2px;
}

.overlay .border {
  margin: 0;
  padding: 0;
  position: relative;
  border-radius: var(--border-radius);
  border-width: var(--border-width);
  border-style: var(--border-style);
  border-color: light-dark(var(--border-color-light), var(--border-color-dark));
  z-index: var(--z-index-highlight);
  pointer-events:none;
  background: transparent;
  top: -3px;
  left: -3px;
}

.overlay .info {
  display: inline-block;
  margin: 0;
  padding: 1px 5px 1px 7px;
  position: relative;
  text-align: center;
  font-size: var(--font-size);
  font-family: var(--font-family);
  font-weight: var(--font-weight);
  background-color: light-dark(var(--border-color-light), var(--border-color-dark));
  color: light-dark(var(--text-color-light), var(--text-color-dark));
  z-index: var(--z-index-highlight);
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.overlay .info.left {
  border-left-width: var(--info-border-width);
  border-left-style: var(--border-style);
  border-left-color: light-dark(var(--light-gray), var(--light-gray-dark));
}

.overlay .info.bottom {
  border-bottom-width: var(--info-border-width);
  border-bottom-style: var(--border-style);
  border-bottom-color: light-dark(var(--light-gray), var(--light-gray-dark));
}

.overlay .left.bottom {
  border-bottom-left-radius: var(--border-radius);
}

.overlay .info.right {
  border-right-width: var(--info-border-width);
  border-right-style: var(--border-style);
  border-right-color: light-dark(var(--light-gray), var(--light-gray-dark));
}

.overlay .info.right.bottom {
  border-bottom-right-radius: var(--border-radius);
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.hidden-element {
  position: absolute;
  margin: 0;
  padding: .25em;
  border: none;
  color: light-dark(var(--hidden-text-color-light), var(hidden-text-color-dark));
  background-color: light-dark(var(--hidden-background-light), var(--hidden-background-dark));
  font-family: var(--font-family);
  font-size: var(--font-size);
  font-style: italic;
  font-weight: bold;
  text-align: center;
  animation: fadeIn 1.5s;
  z-index: var(--z-index-highlight);
  display: none;
}

    `;

    const styleNode = document.createElement('style');
    styleNode.textContent = template.textContent;
    this.shadowRoot.appendChild(styleNode);

    // Get references

    this.containerElem  = document.createElement('div');
    this.containerElem.className = 'ai-highlight';
    this.shadowRoot.appendChild(this.containerElem);
    this.containerElem.style.display = 'none';

    this.overlayElem  = document.createElement('div');
    this.overlayElem.className = 'overlay';
    this.containerElem.appendChild(this.overlayElem);

    this.borderElem = document.createElement('div');
    this.borderElem.className = 'border';
    this.overlayElem.appendChild(this.borderElem);

    this.infoElem = document.createElement('div');
    this.infoElem.className = 'info';
    this.overlayElem.appendChild(this.infoElem);

    this.hiddenElem = document.createElement('div');
    this.hiddenElem.className = 'hidden-element';
    this.containerElem.appendChild(this.hiddenElem);
    this.hiddenElem.style.display = 'none';

    this.hiddenElementContent = 'hidden element';
  }

  static get observedAttributes() {
    return [
      "set",
      "focus"
      ];
  }


  attributeChangedCallback(name, old_value, new_value) {

    const rect = {};
    let focus = false;

    switch (name) {
      case "set":
        if (new_value) {
          const parts = new_value.split(' ');
          this.setResultColor(parts[0]);
          focus = parts[2].toLowerCase() === 'true';

          switch (parts[1]) {
            case 'website':
              this.highlightPage('Website Result', parts[0], focus);
             break;

            case 'page':
              this.highlightPage('Page Result', parts[0], focus);
              break;

            case 'element':

              rect.left   = parseInt(parts[3]);
              rect.top    = parseInt(parts[4]);
              rect.width  = parseInt(parts[5]);
              rect.height = parseInt(parts[6]);
              rect.right  = rect.left + rect.width;
              rect.bottom = rect.top + rect.height;

              this.highlightElement(parts[0], rect, focus);
              break;

          }
        }
        else {
          // hide element
          this.hideHighlight();
        }
        break;

        case "focus":
          if (new_value.toLowerCase() === 'true') {
            this.addFocus();
          }
          else {
            this.removeFocus();
          }
          break;

      default:
        break;
    }
  }

  addFocus() {
    this.overlayElem.classList.add('focus');
  }

  removeFocus() {
    this.overlayElem.classList.remove('focus');
  }

  /**
   * @method setResultColor
   *
   * @desc Setting CSS variables to change border and text colors for result
   *
   * @param {String}  resultvalue - Result value
   */
  setResultColor (value) {

    let color;

    if (value) {
      switch(value.toLowerCase()) {
        case 'v':
          color = 'violations';
          break;

        case 'w':
          color = 'warnings';
          break;

        case 'mc':
          color = 'manual-checks';
          break;

        case 'p':
          color = 'passed';
          break;

        case 'h':
          this.setResultColor('hidden');
          break;

        default:
          break;
      }
    }

    this.containerElem.style.setProperty('--border-color-light', `var(--${color}-color-light)`);
    this.containerElem.style.setProperty('--border-color-dark', `var(--${color}-color-dark)`);

  }

  /*
   *   @method highlightPage
   *
   *   @desc  Highlights the page
   *
   */

  highlightPage(label, resultType, focus) {
    const scrollBehavior = 'instant';

    const contentElem = document.body ?
                        document.body :
                        document.documentElement;

    const bodyRect = contentElem.getBoundingClientRect();

    const rect = {};

    rect.left   = 12;
    rect.top    = 12;
    rect.width  = bodyRect.width - 24;
    rect.height = bodyRect.height - 12;
    rect.right  = rect.left + rect.width;
    rect.bottom = rect.top + rect.height;

    const overlayOffset = 4;

    this.containerElem.style.display = 'block';
    this.hiddenElem.style.display = 'none';

    this.infoElem.textContent = `${label}: ${resultType}`;
    const infoElemRect    = this.infoElem.getBoundingClientRect();

    focus ?
      this.overlayElem.classList.add('focus') :
      this.overlayElem.classList.remove('focus');

    this.overlayElem.style.left   = rect.left - overlayOffset  + 'px';
    this.overlayElem.style.top    = rect.top  - overlayOffset  + 'px';
    this.overlayElem.style.width  = Math.max(rect.width, infoElemRect.width) + 'px';
    this.overlayElem.style.height = rect.height - 12 + 'px';

    const overlayElemRect = this.overlayElem.getBoundingClientRect();

    this.borderElem.style.width   = overlayElemRect.width  - 6 + 'px';
    this.borderElem.style.height  = overlayElemRect.height - 6 +'px';

    const borderElemRect = this.borderElem.getBoundingClientRect();

    this.infoElem.classList.remove('left');
    this.infoElem.classList.add('right');
    this.infoElem.classList.add('bottom');

    this.infoElem.style.left      =  -1 + 'px';
    this.infoElem.style.top       = (-1 * borderElemRect.height) - 1 + 'px';

    contentElem.scrollIntoView({ behavior: scrollBehavior, block: 'start', inline: 'nearest' });

  }

  /*
   *   @method highlightElement
   *
   *   @desc  Highlights the element on the page
   *
   */

  highlightElement(label, rect, focus) {

    const force = true;

    const borderOffset  = 1;
    const overlayWidth  = 4;

    const scrollBehavior = 'instant';
    let scrollElement;
    const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const isReduced = !mediaQuery || mediaQuery.matches;

    if (rect && scrollBehavior) {

      if (this.isElementHidden(rect)) {
        // If element is hidden make hidden element message visible
        // and use for highlighting

        this.hiddenElem.textContent = this.hiddenElementContent;
        this.hiddenElem.style.display = 'block';

        const minValue =borderOffset + 2 * overlayWidth;

        rect.left = rect.left > minValue ?
                            rect.left + window.scrollX :
                            minValue;
        rect.top  = rect.top > minValue ?
                            rect.top + window.scrollY :
                            minValue;

        this.hiddenElem.style.left = rect.left + 'px';
        this.hiddenElem.style.top = rect.top + 'px';

        const hiddenRect = this.hiddenElem.getBoundingClientRect();

        scrollElement = this.updateHighlightElement(hiddenRect,
                                                    label, focus);
      }
      else {
        this.hiddenElem.style.display = 'none';

        rect.left = rect.left + window.scrollX;
        rect.top = rect.top + window.scrollY;

        scrollElement = this.updateHighlightElement(rect,
                                                    label, focus);
      }

      if (this.isElementInHeightLarge(rect)) {
        if (!this.isElementStartInViewport(rect) && (!isReduced || force)) {
          scrollElement.scrollIntoView({ behavior: scrollBehavior, block: 'start', inline: 'nearest' });
        }
      }
      else {
        if (!this.isElementInViewport(rect)  && (!isReduced || force)) {
          scrollElement.scrollIntoView({ behavior: scrollBehavior, block: 'center', inline: 'nearest' });
        }
      }
    }
  }

  /*
   *  @method  updateHighlightElement
   *
   *  @desc  Create an overlay element and set its position on the page.
   *
   *  @param  {Object}   rect         -  Object with rect properties
   *  @param  {String}   resultType   -  Result abbreviation
   *  @param  {Boolean}  focus.       -  Focus outline
   *
   */

   updateHighlightElement (rect, resultType, focus) {

    const overlayOffset = 4;

    this.containerElem.style.display = 'block';

    this.infoElem.textContent = resultType;
    const infoElemRect    = this.infoElem.getBoundingClientRect();

    focus ?
      this.overlayElem.classList.add('focus') :
      this.overlayElem.classList.remove('focus');

    this.overlayElem.style.left   = rect.left - overlayOffset  + 'px';
    this.overlayElem.style.top    = rect.top  - overlayOffset  + 'px';
    this.overlayElem.style.width  = rect.width  + infoElemRect.width + 'px';
    this.overlayElem.style.height = rect.height + 'px';

    this.borderElem.style.width   = rect.width + infoElemRect.width + 2 +'px';
    this.borderElem.style.height  = rect.height + 2 +'px';

    const borderElemRect = this.borderElem.getBoundingClientRect();

    this.infoElem.classList.remove('right');
    this.infoElem.classList.add('left');
    this.infoElem.classList.add('bottom');
    this.infoElem.style.left      =  borderElemRect.width - infoElemRect.width - 5 + 'px';
    this.infoElem.style.top       = (-1 * borderElemRect.height) - 1 + 'px';

    return this.infoElem;
  }


  /*
   *   @method isElementInViewport
   *
   *   @desc  Returns true if element is already visible in view port,
   *          otherwise false
   *
   *   @param {Object} rect : Object withh Rect properties
   *
   *   @returns see @desc
   */

  isElementInViewport(rect) {
    return (
      rect.top >= window.screenY &&
      rect.left >= window.screenX &&
      rect.bottom <= ((window.screenY + window.innerHeight) ||
                      (window.screenY + document.documentElement.clientHeight)) &&
      rect.right <= ((window.screenX + window.innerWidth) ||
                     (window.screenX + document.documentElement.clientWidth)));
  }

  /*
   *   @method isElementStartInViewport
   *
   *   @desc  Returns true if start of the element is already visible in view port,
   *          otherwise false
   *
   *   @param {Object} elem : DOM node of element to highlight
   *
   *   @returns see @desc
   */

  isElementStartInViewport(rect) {
    return (
        rect.top >= window.screenY &&
        rect.top <= ((window.screenY + window.innerHeight) ||
                     (window.screenY + document.documentElement.clientHeight)) &&
        rect.left >= window.screenX &&
        rect.left <= ((window.screenX + window.innerWidth) ||
                     (window.screenX + document.documentElement.clientWidth)));
  }

  /*
   *   @method isElementHeightLarge
   *
   *   @desc  Returns true if element client height is larger than clientHeight,
   *          otheriwse false
   *
   *   @param {Number} heaight : Height of element
   *
   *   @returns see @desc
   */

  isElementInHeightLarge(rect) {
    return (1.2 * rect.height) > (window.innerHeight || document.documentElement.clientHeight);
  }

  /*
   *   @method isElementHidden
   *
   *   @desc  Returns true if the element is hidden on the
   *          graphical rendering
   *
   *   @param  {Object}  elem   : DOM node
   *
   *   @returns see @desc
   */
  isElementHidden(rect) {
    return (rect.height < 3) ||
           (rect.width  < 3) ||
           ((rect.left + rect.width) < (rect.width / 2)) ||
           ((rect.top  + rect.height) < (rect.height / 2));
  }

  /*
   *   @method hideHighlight
   *
   *   @desc  Hides the highlight element on the page
   */
  hideHighlight() {
    this.containerElem.style.display = 'none';
  }

}

// Create highlight element
window.customElements.define('opena11y-ai-highlight', AIHighlightELement);


