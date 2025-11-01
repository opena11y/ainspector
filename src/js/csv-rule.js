/* csv-rule.js */

// Imports

import DebugLogging  from './debug.js';

import {
  convertStringCSV,
  escapeForCSV,
  pageInfoToCVS
} from './csv-common.js';

import {
  getMessage
} from './utils.js';

// Constants

const debug = new DebugLogging('[csv-rule]', false);
debug.flag = false;

function convertFontFamilyForCSV(font_family) {
  return font_family.replaceAll('"', '\'');
}

function isTitleRule(result) {
  return (result.page_result && result.page_result.page_title) ||
          result.page_title;
}

function isColorContrastRule (result) {
  return (result.element_results &&
          result.element_results[0] &&
          result.element_results[0].color_contrast)
         || result.color_contrast;
}

function isTableRule (result) {
  return (result.element_results &&
          result.element_results[0] &&
          result.element_results[0].table)
         || result.table;
}

function isTableCellRule (result) {
  return (result.element_results &&
          result.element_results[0] &&
          result.element_results[0].table_cell)
         || result.table_cell;
}

function websiteOrPageToCSV(result) {
  let csv = `\n\n`;

  if (result.is_website) {
    csv += `"${getMessage('website_label')} Result"\n`;
  }

  if (result.is_page) {
    csv += `"${getMessage('page_label')} Result"\n`;
  }

  csv += `"Rule ID","${escapeForCSV(convertStringCSV(result.rule_nls_id))}"\n`;
  csv += `"Definition","${escapeForCSV(convertStringCSV(result.definition))}"\n`;
  csv += `"Action","${escapeForCSV(convertStringCSV(result.action))}"\n`;

  if (result.page_title) {
    csv += `"Page Title","${escapeForCSV(convertStringCSV(result.page_title))}"\n`;
  }

  return csv;
}

function resultToCSV(result) {
  let csv = ``;
  csv += `"${result.element}"`;
  csv += `,"${result.result_long}"`;
  csv += `,"${escapeForCSV(convertStringCSV(result.action))}"`;
  if (result.is_element) {
    csv += `,"${result.element_id}"`;
    csv += `,"${escapeForCSV(result.element_class)}"`;
    csv += `,"${result.role}"`;
    csv += `,"${escapeForCSV(result.accessible_name.name)}"`;
    csv += `,"${result.accessible_name.source !== 'none' ? result.accessible_name.source : ''}"`;
    csv += `,"${escapeForCSV(result.accessible_description.name)}"`;
    csv += `,"${result.accessible_description.source !== 'none' ? result.accessible_description.source : ''}"`;

    if (isTitleRule(result)) {
      csv += `,"${result.page_title}"`;
    }

    if (isColorContrastRule(result)) {
      const cc = result.color_contrast;
      csv += `,"${cc.ccr}"`;
      csv += `,"${cc.background_color}"`;
      csv += `,"${cc.background_color_hex}"`;
      csv += `,"${cc.color}"`;
      csv += `,"${cc.color_hex}"`;
      csv += `,"${cc.opacity}"`;
      csv += `,"${cc.is_positioned ? 'Yes' : 'no'}"`;
      csv += `,"${convertFontFamilyForCSV(cc.font_family)}"`;
      csv += `,"${cc.font_size}"`;
      csv += `,"${cc.font_weight}"`;
      csv += `,"${cc.is_large_font ? 'Yes' : 'no'}"`;
      csv += `,"${cc.background_image}"`;
      csv += `,"${cc.background_repeat}"`;
      csv += `,"${cc.background_position}"`;
    }

    if (isTableRule(result)) {
      const t = result.table;
      csv += `,"${t.type_nls}"`;
      csv += `,"${t.rows}"`;
      csv += `,"${t.columns}"`;
      csv += `,"${t.spanned_data_cells}"`;
      csv += `,"${t.cell_count}"`;
      csv += `,"${t.header_cell_count}"`;
    }

    if (isTableCellRule(result)) {
      const tc = result.table_cell;
      csv += `,"${tc.is_header ? 'Yes' : 'no'}"`;
      csv += `,"${tc.start_row}"`;
      csv += `,"${tc.start_column}"`;
      csv += `,"${tc.row_span === 1 ? '' : tc.row_span}"`;
      csv += `,"${tc.column_span === 1 ? '' : tc.column_span}"`;
      csv += `,"${convertFontFamilyForCSV(tc.headers)}"`;
      csv += `,"${tc.headers_source}"`;
      csv += `,"${tc.empty_cell ? 'Yes' : 'no'}"`;
    }
  }

  csv += `\n`;

  return csv;
}

export function getCSVForRule (result) {

  let csv = pageInfoToCVS(result);

  // Rule Results Summary

  csv += `\n\n"Rule ID","${result.rule_id_nls}"\n`;
  csv += `"Rule Summary","${result.rule_title}"\n`;
  csv += `\n\n"Results Summary"\n`;

  const rs = result.result_summary;
  csv += `"Violations","${rs.violations}"\n`;
  csv += `"Warnings","${rs.warnings}"\n`;
  csv += `"Manual Checks","${rs.manual_checks}"\n`;
  csv += `"Passed","${rs.passed}"\n`;
  csv += `"Hidden","${rs.hidden}"\n`;

  if (result.website_result) {
    csv += websiteOrPageToCSV(result.website_result);
  }

  if (result.page_result) {
    csv += websiteOrPageToCSV(result.page_result);
  }

  csv += `\n\n"Element Results"\n`;
  if (result.element_results && result.element_results.length) {
    csv += `"Element","Result","Action","id","class",Role","Accessible Name","Name Source","Accessible Description","Description Source"`;

    if (isTitleRule(result)) {
      csv += `${getMessage("element_result_page_title")}`;
    }

    if (isColorContrastRule(result)) {
      csv += `,"Color Contrast Ratio","Background Color","Rendered Background Color","Text Color","Rendered Text Color","Opacity","Positioned","Font Family","Font Size","Font Weight","Is Large Font","Background Image", "Background Repeat", "Background Position"`;
    }

    if (isTableRule(result)) {
      csv += `,"Table Type","Table Rows","Table Columns","Spanned Data Cells","Cell Count","Header Cell Count"`;
    }

    if (isTableCellRule(result)) {
      csv += `,"Is Header Cell","Row","Column","Row Span","Column Span","Headers","Headers Source","Empty Cell"`;
    }

    csv += `\n`;

    result.element_results.forEach( (er) => {
      csv += resultToCSV(er);
    });
  }
  else {
    csv += `"None"\n`;
  }

  return csv;

}
