/* csv-all-rules.js */

// Imports

import DebugLogging  from './debug.js';

import {
  pageInfoToCVS,
  ruleResultsToCVS,
  ruleSummaryToCVS
} from './csv-common.js';

// Constants

const debug = new DebugLogging('[csv-rule-group]', false);
debug.flag = false;

export function getCSVForRuleGroup (groupId, result) {

  let csv = pageInfoToCVS(result);

  // Rule Summary
  csv += ruleSummaryToCVS(result.group_title, result.rule_summary);

  // Rule Results
  csv += ruleResultsToCVS(result.group_title, result.rule_results);
  return csv;
}
