var fs = require('fs');
const json2xls = require('json2xls');

fs.readFile('../files/03/2020020300.csv', function(err, data) {
  var table = new Array();
    if (err) {
        console.log(err.stack);
        return;
    }

    // ConvertToTable(data, function (table) {
    //     console.log(table);
    // })
    // console.log(data.toString().split("\r\n"));
    let da = data.toString().split('\n');
    // console.log(da.length)
    var newArr = [];
    da.forEach((item, index, array) => {
      let a = item.slice(60);
      let itemArr = a.split(',');
      let obj ={
        x: itemArr[0],
        y: itemArr[1],
        v: itemArr[2]
      }
      newArr.push(obj);
    });
    console.log(newArr);
    let xls = json2xls(newArr);
    fs.writeFileSync('name.xlsx', xls, 'binary');
})
