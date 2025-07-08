function onOpen() {
  var ui = SpreadsheetApp.getUi();
  var menu = ui.createMenu('example');
  menu.addItem('更新する', 'update');
  menu.addToUi();
}

function update() {
  let queryParams = [];
  queryParams['id'] = 'id';
  queryParams['YYYYMM'] = YYYYMM;

  let redash = new Redash();
  let data = redash.getDatas(queryParams);

  let sheetName = '';
  let spreadsheet = new Spreadsheet(sheetName);
  spreadsheet.setDataOutputs(buildOutputData(data));
  spreadsheet.setFormatting();
}


function buildOutputData(datas) {
  let result = [];
  let buffer;
  
  for (let key in datas) {
    buffer = [];
    buffer.push(datas[key]['id']);
    buffer.push(datas[key]['name']);
    buffer.push(datas[key]['column1']);
    buffer.push(datas[key]['column2']);
    buffer.push(datas[key]['column3']);
    buffer.push(datas[key]['column4']);
    buffer.push(datas[key]['column5']);


    result.push(buffer);
  }
  return result;
}
