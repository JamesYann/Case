var express = require('express');
var router = express.Router();

//增加引用函式
//var moment = require('moment');
const product = require('./utility/product');

//接收POST請求
router.post('/', function(req, res, next) {
    
    //console.log('post begin');
    var schedule_name = req.body.schedule_name;                  //
    var group_id = req.body.group_id;   
    
    // 建立一個新資料物件
    var newData={
        schedule_name:schedule_name,
        group_id:group_id       
    } 
    
    product.addPlan(newData).then(d => {
        console.log('d = ' + d);

        if (d == 0){
            console.log('success');
            res.render('product_add_form', {items:d});  //傳至成功頁面            
        }else if(d == -1){
            console.log('notFound');
            res.render('notFound');  //導向找不到頁面                
        }else{
            console.log('error');
            res.render('error');  //導向錯誤頁面
        }  
    })

    
});

module.exports = router ;