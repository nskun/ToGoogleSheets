/**
 * コンストラクタ
 * @constructor
 */
var Spreadsheet = function Spreadsheet(sheetName) {
  this.sheetName = sheetName;

  // アクティブなシート
  this.sheet = SpreadsheetApp.getActiveSheet();
  if (sheetName) {
    this.sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  }
  // アクティブなセル
  this.activeCell = this.sheet.getActiveCell();
  // アクティブな列
  this.column = this.activeCell.getColumn();
  // アクティブな行
  this.row = this.activeCell.getRow();
  // 最終行
  this.lastRow = this.sheet.getMaxRows();
}

Spreadsheet.prototype.setDataOutputs = function(outputs) {
  // setRange(開始行, 開始列, 何行選択するか, 何列選択するか)
  this.sheet.getRange(2, 1, outputs.length, outputs[0].length).setValues(outputs);
}
Spreadsheet.prototype.setFormatting = function() {
  // 書式なしに設定する。
  this.sheet.getRange('A1:G').setNumberFormat('@');
}
