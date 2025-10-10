/* csv-common.js */

// Imports

import DebugLogging  from './debug.js';

import {
  getMessage
} from './utils.js';

/* Constants */

const debug = new DebugLogging('csv-common', false);
debug.flag = false;

export function convertStringCSV (s) {
  let rs = '';
  let capitalize = false;
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];
    if (c === '@') {
      capitalize = !capitalize;
    }
    else {
      if (c === '"') {
        rs += "'";
      }
      else {
        rs += capitalize ? c.toUpperCase() : c;
      }
    }
  }
  return rs;
}

export function escapeForCSV(value) {
    if (value === null || value === undefined) {
        return ''; // Or handle null/undefined as needed
    }

    let stringValue = String(value);

    // Check if the string contains special characters requiring quoting
    // (comma, double quote, newline)
    const needsQuotes = /["\n\r]/.test(stringValue);

    // Escape double quotes within the string by doubling them
    stringValue = stringValue.replace(/"/g, '""');

    // If quoting is needed, enclose the entire string in double quotes
    if (needsQuotes) {
        return `"${stringValue}"`;
    } else {
        return stringValue;
    }
}

export function arrayOrStringToCSV(items) {
  let csv = ``;
  if (typeof items === 'string') {
    csv = `"${escapeForCSV(convertStringCSV(items))}"\n`;
  }
  else {
    if (items.length) {
      let first = true;
      csv = '';
      items.forEach( (item) => {
        if (typeof item === 'string') {
          csv += first ?
                 `"${escapeForCSV(convertStringCSV(item))}"\n` :
                 `"","${escapeForCSV(convertStringCSV(item))}"\n`;
        }
        else {
          if (item.url) {
            csv += first ?
                   `"${escapeForCSV(convertStringCSV(item.title))} (${item.url})"\n` :
                   `"","${escapeForCSV(convertStringCSV(item.title))} (${item.url})"\n`;
          }
        }
        first = false;
      });
    }
  }
  if (!csv) {
    csv = `"none"\n`;
  }
  return csv;
}

export function pageInfoToCVS(result) {

  let csv = '';
  csv+= `"title","${escapeForCSV(result.title)}"\n`;
  csv+= `"url","${escapeForCSV(result.location)}"\n`;
  csv+= `"ruleset","${escapeForCSV(result.ruleset_label)}"\n`;
  csv+= `"view","${escapeForCSV(result.result_view)}"\n`;
  csv+= `"date","${escapeForCSV(result.date)}"\n`;
  csv+= `"time","${escapeForCSV(result.time)}"\n`;

  return csv;
}

export function ruleSummaryToCVS(title, rule_summary) {
  let csv = '';

  csv += `\n\n"Rule Summary: ${title}"\n`;

  csv += `"Violations","${rule_summary.violations}"\n`;
  csv += `"Warnings","${rule_summary.warnings}"\n`;
  csv += `"Manual Checks","${rule_summary.manual_checks}"\n`;
  csv += `"Passed","${rule_summary.passed}"\n`;

  return csv;
}

export function ruleResultsToCVS(title, rule_results) {
  let csv = '';

  csv += `\n\n"Rule Results: ${title}"\n`;
  csv += `"${getMessage('csv_rule_id')}",`;
  csv += `"${getMessage('csv_rule_summary')}",`;
  csv += `"${getMessage('csv_result_label')}",`;
  csv += `"${getMessage('csv_result_value')}",`;
  csv += `"${getMessage('rule_scope_label')}",`;
  csv += `"${getMessage('rule_category_label')}",`;
  csv += `"${getMessage('guideline_label')}",`;
  csv += `"${getMessage('csv_success_criteria')}",`;
  csv += `"${getMessage('level_label')}",`;
  csv += `"${getMessage('required_label')}",`;
  csv += `"${getMessage('violations_label')}",`;
  csv += `"${getMessage('warnings_label')}",`;
  csv += `"${getMessage('manual_checks_label')}",`;
  csv += `"${getMessage('passed_label')}",`;
  csv += `"${getMessage('hidden_label')}"\n`;

  rule_results.forEach( (rr) => {
    csv += `"${rr.id_nls}",`;
    csv += `"${escapeForCSV(convertStringCSV(rr.rule_summary))}",`;
    csv += `"${rr.result_value_nls}",`;
    csv += `"${rr.result_value}",`;
    csv += `"${rr.rule_scope_code_nls}",`;
    csv += `"${rr.rule_category_nls}",`;
    csv += `"${rr.guideline_nls}",`;
    csv += `"${rr.success_criteria_code}",`;
    csv += `"${rr.wcag_level}",`;
    csv += `"${rr.rule_required ? getMessage('required_value') : ''}",`;
    csv += `"${rr.results_violation}",`;
    csv += `"${rr.results_warning}",`;
    csv += `"${rr.results_manual_check}",`;
    csv += `"${rr.results_passed}",`;
    csv += `"${rr.results_hidden}"\n`;
  });

  return csv;
}
