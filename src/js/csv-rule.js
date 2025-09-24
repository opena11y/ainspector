/* csv-rule.js */

// Imports

import DebugLogging  from './debug.js';

import {
  convertStringCSV,
  escapeForCSV,
  pageInfoToCVS
} from './csv-common.js';

// Constants

const debug = new DebugLogging('[csv-rule]', false);
debug.flag = false;

function resultToCSV(result) {
  const csv = `"${result.element}","${result.result_long}","${escapeForCSV(convertStringCSV(result.action))}"\n`;
  return csv;
}

export function getCSVForRule (result) {

  let csv = pageInfoToCVS(result);

  // Rule Results Summary

  csv += `"\n\nResults Summary"\n`;
  csv += `"Rule ID","${result.rule_id_nls}"\n`;
  csv += `"Rule Summary","${result.rule_title}"\n`;

  const rs = result.result_summary;
  csv += `"Violations","${rs.violations}"\n`;
  csv += `"Warnings","${rs.warnings}"\n`;
  csv += `"Manual Checks","${rs.manual_checks}"\n`;
  csv += `"Passed","${rs.passed}"\n`;


  if (result.element_results) {
    csv += `\n\n"Results"\n`;
    csv += `"Element","Result","Action"\n`;

    if (result.website_result) {
      csv += resultToCSV(result.website_result);
    }

    if (result.page_result) {
      csv += resultToCSV(result.website_result);
    }

    result.element_results.forEach( (er) => {
      csv += resultToCSV(er);
    });
  }

  return csv;

}
