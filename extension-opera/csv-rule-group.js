/* csv-all-rules.js */

// Imports

import DebugLogging  from './debug.js';

import {
  convertStringCSV,
  escapeForCSV,
  pageInfoToCVS,
  arrayOrStringToCSV
} from './csv-common.js';

// Constants

const debug = new DebugLogging('[csv-rule-group]', false);
debug.flag = false;

export function getCSVForRuleGroup (groupId, result) {

  let csv = pageInfoToCVS(result);

  // Rule Group Results Summary

  csv += `"\n\n`;
  if (groupId.includes('rc')) {
    csv += `"Rule Category","${result.group_title} Rules Summary"\n`;
  }
  else {
    csv += `\n\n"Guideline","${result.group_title} Rules Summary"\n`;
  }
  const rs = result.rule_summary;
  csv += `"Violations","${rs.violations}"\n`;
  csv += `"Warnings","${rs.warnings}"\n`;
  csv += `"Manual Checks","${rs.manual_checks}"\n`;
  csv += `"Passed","${rs.passed}"\n`;

  // Rule Results Summary

  csv += `"\n\nRule Summary"\n`;
  csv += `"Rule ID","Rule Summary","Success Criteria","Level","Result","Required"\n`;

  result.rule_results.forEach( (rr) => {
    csv += `"${rr.id_nls}","${escapeForCSV(convertStringCSV(rr.summary))}","${rr.sc}","${rr.wcag_level}","${rr.result}","${rr.required ? 'Yes' : ''}"\n`;
  });

  // Rule Result Details

  csv += `"\n\nRule Result Details"\n`;

  result.info_rules.forEach( (ri) => {
    csv += `\n"Rule ID","${ri.id_nls}"\n`;
    csv += `"Summary","${escapeForCSV(convertStringCSV(ri.summary))}"\n`;
    csv += `"Definition","${escapeForCSV(convertStringCSV(ri.definition))}"\n`;
    csv += `"Action",${arrayOrStringToCSV(ri.actions)}`;
    csv += `"Purposes",${arrayOrStringToCSV(ri.purposes)}`;
    if (ri.manual_checks) {
      csv += `"Manual Checks",${arrayOrStringToCSV(ri.manual_checks)}`;
    }
    csv += `"Techniques",${arrayOrStringToCSV(ri.techniques)}`;
    csv += `"Target Elements","${escapeForCSV(convertStringCSV(ri.targets))}"\n`;
    csv += `"WCAG Primary","${escapeForCSV(convertStringCSV(ri.wcag_primary.title))} (${ri.wcag_primary.url})"\n`;
    if (ri.wcag_related) {
      csv += `"WCAG Related",${arrayOrStringToCSV(ri.wcag_related)}`;
    }
    csv += `"Additional Information",${arrayOrStringToCSV(ri.informational_links)}`;
  });

  return csv;

}
