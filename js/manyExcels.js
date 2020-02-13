var Excel = require('exceljs');
var fs = require('fs');
var path = require('path');
var filePath = path.resolve('../files');
console.log(filePath)

fileDisplay(filePath);
function fileDisplay (filePath) {
  fs.readdir(filePath, function(err, files) {
    if (err) {
      console.warn(err)
    } else {
      files.forEach((fileName) => {
          let filesDir = path.join(filePath, fileName);
          console.log(filesDir)
          let ExcelName = filesDir.split('/')[filesDir.split('/').length - 1].replace('.csv', '.xlsx');
          fs.stat(filesDir, function(err, stats) {
            if(err) {
              console.warn('获取文件的stat')
            } else {
              let isFile = stats.isFile();
              let isDir = stats.isDirectory();
              if (isFile) {
                console.log(filesDir);
                let content = fs.readFileSync(filesDir);
                let da = content.toString().split('\n');
                // console.log(da)
                var newArr = [];
                da.forEach((item) => {
                  let a = item.slice(60);
                  let itemArr = a.split(',');
                  let obj ={
                    x: itemArr[0],
                    y: itemArr[1],
                    v: itemArr[2]
                  }
                  newArr.push(obj);
                });
                exportExcels(newArr, ExcelName)
              }
              if(isDir) {
                fileDisplay(filesDir)
              }
            }
          })
      });
    }
  })
}
function exportExcels(data, fileName) {
  // 根据数据生成excel文件
  var start_time = new Date();
  var workbook = new Excel.stream.xlsx.WorkbookWriter({
    filename: fileName
  });
  var worksheet = workbook.addWorksheet('Sheet');

  worksheet.columns = [
    { header: 'x', key: 'x' },
    { header: 'y', key: 'y' },
    { header: 'v', key: 'v' }
  ];

  var length = data.length;

  // 当前进度
  var current_num = 0;
  var time_monit = 400;
  var temp_time = Date.now();

  console.log('开始生成excel表格');
  // 开始添加数据
  for(let i in data) {
    worksheet.addRow(data[i]).commit();
    current_num = i;
    if(Date.now() - temp_time > time_monit) {
      temp_time = Date.now();
      console.log((current_num / length * 100).toFixed(2) + '%');
    }
  }
  console.log('Excel表格数据生成完毕：');
  workbook.commit();

  var end_time = new Date();
  var duration = end_time - start_time;

  console.log('总共用时：' + duration+ 's');
  console.log("程序执行完毕");
}