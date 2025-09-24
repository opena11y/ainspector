/* constants.js */

/*
*  GUIDELINES constant is a copy of the constants from the OpenA11y library
*  and is used so the entire OpenA11y library does not need to be in the
*  sidebar.
*/

export const MAX_PREFIX_LENGTH = 32;

export const GUIDELINES =  {
  G_1_1: 0x000010,
  G_1_2: 0x000020,
  G_1_3: 0x000040,
  G_1_4: 0x000080,
  G_2_1: 0x000100,
  G_2_2: 0x000200,
  G_2_3: 0x000400,
  G_2_4: 0x000800,
  G_2_5: 0x001000,
  G_3_1: 0x002000,
  G_3_2: 0x004000,
  G_3_3: 0x008000,
  G_4_1: 0x010000,
  ALL  : 0x01FFF0
};

/*
*  RULE_CATEGORY constant is a copy of the constants from the OpenA11y
*  library and is used so the entire OpenA11y library does not need to
*  be in the sidebar.
*/

export const RULE_CATEGORIES = {
  UNDEFINED              : 0x0000,
  LANDMARKS              : 0x0001,
  HEADINGS               : 0x0002,
  COLOR_CONTENT          : 0x0004,
  IMAGES                 : 0x0008,
  LINKS                  : 0x0010,
  FORMS                  : 0x0020,
  TABLES_LAYOUT          : 0x0040,
  WIDGETS_SCRIPTS        : 0x0080,
  AUDIO_VIDEO            : 0x0100,
  KEYBOARD_SUPPORT       : 0x0200,
  TIMING                 : 0x0400,
  SITE_NAVIGATION        : 0x0800,
  // Composite categories
  ALL                    : 0x0FFF
};

/*
*  RULE_SCOPE constant is a copy of the constants from the Open11y
*  library and is used so the entire OpenA11y library does not need to
*  be in the sidebar.
*/

export const RULE_SCOPE = {
  UNDEFINED  : 0x0000,
  ELEMENT    : 0x0001,
  PAGE       : 0x0002,
  WEBSITE    : 0x0004,
  // Composite scopes
  ALL        : 0x0007
};



export const ruleCategoryIds = [
  RULE_CATEGORIES.LANDMARKS,
  RULE_CATEGORIES.HEADINGS,
  RULE_CATEGORIES.COLOR_CONTENT,
  RULE_CATEGORIES.IMAGES,
  RULE_CATEGORIES.LINKS,
  RULE_CATEGORIES.FORMS,
  RULE_CATEGORIES.TABLES_LAYOUT,
  RULE_CATEGORIES.WIDGETS_SCRIPTS,
  RULE_CATEGORIES.AUDIO_VIDEO,
  RULE_CATEGORIES.KEYBOARD_SUPPORT,
  RULE_CATEGORIES.TIMING,
  RULE_CATEGORIES.SITE_NAVIGATION,
  RULE_CATEGORIES.ALL,
];

export const guidelineIds = [
  GUIDELINES.G_1_1,
  GUIDELINES.G_1_2,
  GUIDELINES.G_1_3,
  GUIDELINES.G_1_4,
  GUIDELINES.G_2_1,
  GUIDELINES.G_2_2,
  GUIDELINES.G_2_3,
  GUIDELINES.G_2_4,
  GUIDELINES.G_2_5,
  GUIDELINES.G_3_1,
  GUIDELINES.G_3_2,
  GUIDELINES.G_3_3,
  GUIDELINES.G_4_1,
  GUIDELINES.ALL,
];

export const scopeIds = [
  RULE_SCOPE.ELEMENT,
  RULE_SCOPE.PAGE,
  RULE_SCOPE.WEBSITE,
  RULE_SCOPE.ALL
];


export function getRuleCategoryLabelId (id) {
  switch (id) {
  case RULE_CATEGORIES.LANDMARKS:
    return 'landmarks_label';
  case RULE_CATEGORIES.HEADINGS:
    return 'headings_label';
  case RULE_CATEGORIES.COLOR_CONTENT:
    return 'styles_content_label';
  case RULE_CATEGORIES.IMAGES:
    return 'images_label';
  case RULE_CATEGORIES.LINKS:
    return 'links_label';
  case RULE_CATEGORIES.FORMS:
    return 'tables_label';
  case RULE_CATEGORIES.TABLES_LAYOUT:
    return 'forms_label';
  case RULE_CATEGORIES.WIDGETS_SCRIPTS:
    return 'widgets_scripts_label';
  case RULE_CATEGORIES.AUDIO_VIDEO:
    return 'audio_video_label';
  case RULE_CATEGORIES.KEYBOARD_SUPPORT:
    return 'keyboard_label';
  case RULE_CATEGORIES.TIMING:
    return 'timing_label';
  case RULE_CATEGORIES.SITE_NAVIGATION:
    return 'site_navigation_label';
  case RULE_CATEGORIES.ALL:
    return 'all_rules_label';
  default:
    return '';
  }
}

export function getRuleCategoryFilenameId (id) {
  switch (id) {
  case RULE_CATEGORIES.LANDMARKS:
    return 'rc-landmarks';
  case RULE_CATEGORIES.HEADINGS:
    return 'rc-headings';
  case RULE_CATEGORIES.COLOR_CONTENT:
    return 'rc-styles-content';
  case RULE_CATEGORIES.IMAGES:
    return 'rc-images';
  case RULE_CATEGORIES.LINKS:
    return 'rc-links';
  case RULE_CATEGORIES.FORMS:
    return 'rc-tables';
  case RULE_CATEGORIES.TABLES_LAYOUT:
    return 'rc-forms';
  case RULE_CATEGORIES.WIDGETS_SCRIPTS:
    return 'rc-widgets-scripts';
  case RULE_CATEGORIES.AUDIO_VIDEO:
    return 'rc-audio-video';
  case RULE_CATEGORIES.KEYBOARD_SUPPORT:
    return 'rc-keyboard';
  case RULE_CATEGORIES.TIMING:
    return 'rc-timing';
  case RULE_CATEGORIES.SITE_NAVIGATION:
    return 'rc-site-navigation';
  case RULE_CATEGORIES.ALL:
    return 'rc-all-rules';
  default:
    return 'undefined';
  }
}


export function getGuidelineLabelId (id) {

  switch(id) {

  case GUIDELINES.G_1_1:
    return 'g1_1';
  case GUIDELINES.G_1_2:
    return 'g1_2';
  case GUIDELINES.G_1_3:
    return 'g1_3';
  case GUIDELINES.G_1_4:
    return 'g1_4';
  case GUIDELINES.G_2_1:
    return 'g2_1';
  case GUIDELINES.G_2_2:
    return 'g2_2';
  case GUIDELINES.G_2_3:
    return 'g2_3';
  case GUIDELINES.G_2_4:
    return 'g2_4';
  case GUIDELINES.G_2_5:
    return 'g2_5';
  case GUIDELINES.G_3_1:
    return 'g3_1';
  case GUIDELINES.G_3_2:
    return 'g3_2';
  case GUIDELINES.G_3_3:
    return 'g3_3';
  case GUIDELINES.G_4_1:
    return 'g4_1';
  case GUIDELINES.ALL:
    return 'all_rules_label';
  default:
    return GUIDELINES.UNDEFINED;

  }
}

export function getGuidelineFilenameId (id) {

  switch(id) {

  case GUIDELINES.G_1_1:
    return 'g-11-text-alternatives';
  case GUIDELINES.G_1_2:
    return 'g-12-time-based-media';
  case GUIDELINES.G_1_3:
    return 'g-13-adaptable';
  case GUIDELINES.G_1_4:
    return 'g-14-distinguishable';
  case GUIDELINES.G_2_1:
    return 'g-21-keyboard-accessible';
  case GUIDELINES.G_2_2:
    return 'g-22-enough-time';
  case GUIDELINES.G_2_3:
    return 'g-23-seizures';
  case GUIDELINES.G_2_4:
    return 'g-24-navigable';
  case GUIDELINES.G_2_5:
    return 'g-25-input-modalities';
  case GUIDELINES.G_3_1:
    return 'g-31-readable';
  case GUIDELINES.G_3_2:
    return 'g-32-predictable';
  case GUIDELINES.G_3_3:
    return 'g-33-input-assistance';
  case GUIDELINES.G_4_1:
    return 'g-41-compatible';
  case GUIDELINES.ALL:
    return 'g-all-rules';
  default:
    return 'undefined';

  }
}
