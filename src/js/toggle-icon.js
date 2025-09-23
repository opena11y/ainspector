/* toggle-icon.js */

const browserRuntime = typeof browser === 'object' ?
              browser.runtime :
              chrome.runtime;

const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');

const setColorScheme = e => {
  if (e.matches) {
    // Dark
    browserRuntime.sendMessage({ scheme: 'dark'});
  } else {
    // Light
    browserRuntime.sendMessage({ scheme: 'light'});
  }
};

setColorScheme(colorSchemeQueryList);
colorSchemeQueryList.addEventListener('change', setColorScheme);

