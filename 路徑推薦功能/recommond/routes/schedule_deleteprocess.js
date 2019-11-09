var express = require('express');
var router = express.Router();

//增加引用函式
//var moment = require('moment');
const product = require('./utility/product');


//接收POST請求
router.post('/', function(req, res, next) {   

    // console.log('abc');
    //var newData = req.body.count;
    //var place_id = String(req.body.id);    
    var place_id = String(req.body.place_id);    
 
    console.log(place_id);

    //product.addPlaceID(newData).then(d => {
    product.deleteprocess(place_id).then(d => {
        if (d == null){
            console.log('error');
            res.render('error');  //導向錯誤頁面
        }else if(d == -1){
            console.log('notFound');
            res.render('notFound');  //導向找不到頁面                
        }else{
            console.log('deletesuccess');
            res.render('schedule_query', {items:d});  //傳至成功頁面
        }  
    })
    
});

module.exports = router ;