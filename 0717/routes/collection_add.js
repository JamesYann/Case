var express = require('express');
var router = express.Router();

//增加引用函式
const product = require('./utility/product');

//接收POST請求
router.post('/', function(req, res, next) {
    var place_id = req.query.place_id;       
    var schedule_id = req.body.schedule_id;    
    console.log(req.query.place_id);
    console.log(req.body.schedule_id);                   //取得產品編號

    // 建立一個新資料物件
    var newData={
        place_id:place_id,
        schedule_id:schedule_id
    } 
    
    product.collectiontoprocess(newData).then(d => {
        if (d==0){
            res.render('addSuccess');  //傳至成功頁面
        }else{
            res.render('addFail');     //導向錯誤頁面
            console.log('addFail'+place_id);
            console.log('addFail'+schedule_id);
        }  
    })
});

module.exports = router;