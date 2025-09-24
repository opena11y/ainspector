/* csv-common.js */

// Imports

import DebugLogging  from './debug.js';

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
