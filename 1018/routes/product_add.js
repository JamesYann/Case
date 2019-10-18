var express = require('express');
var router = express.Router();

//增加引用函式
const product = require('./utility/product');

//接收POST請求
router.post('/', function(req, res, next) {
    var schedule_name = req.body.schedule_name;                  //取得產品編號
    var day_number = req.body.day_number;              //取得產品名稱

    // 建立一個新資料物件
    var newData={
        schedule_name:schedule_name,
        day_number:day_number
    } 
    
    product.add(newData).then(d => {
        if (d==0){
            res.render('addSuccess');  //傳至成功頁面
        }else{
            res.render('addFail');     //導向錯誤頁面
        }  
    })
});

module.exports = router;