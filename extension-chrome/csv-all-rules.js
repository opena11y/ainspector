/* csv-all-rules.js */

// Imports

import DebugLogging  from './debug.js';

import {
  pageInfoToCVS
} from './csv-common.js';

// Constants

const debug = new DebugLogging('[csv-all-rules]', false);
debug.flag = false;

export function getCSVForAllRules (result) {

  let csv = pageInfoToCVS(result);

  csv += `\n\n"Rule Category","Violations","Warnings","Manual Checks","Passed"\n`;

  result.rc_rule_results_group.forEach( (rcr) => {
    csv += `"${rcr.title}","${rcr.violations}","${rcr.warnings}","${rcr.manual_checks}","${rcr.passed}",\n`;
  });

  csv += `\n\n"WCAG Guideline","Violations","Warnings","Manual Checks","Passed"\n`;

  result.gl_rule_results_group.forEach( (glr) => {
    csv += `"${glr.title}","${glr.violations}","${glr.warnings}","${glr.manual_checks}","${glr.passed}",\n`;
  });

  return csv;

}
