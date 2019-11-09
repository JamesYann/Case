var express = require('express');
var router = express.Router();

//增加引用函式
//var moment = require('moment');
const product = require('./utility/product');


//接收POST請求
router.post('/', function(req, res, next) {   

    // console.log('abc');
    //var newData = req.body.count;

    var place_id = String(req.body.place_id); 
    var order_no = req.body.order_no;

    //可用
     //var place_id = String(req.body.place_id); 
     //var order_no = Number(req.body.order_no);
     //可用
    // place_id = id,
    // order_no = count
    // var dataArray = new blogSchema({
    //     place_id: req.body.place_id,
    //     order_no:req.body.order_no
    //   });     
  

    //product.addPlaceID(newData).then(d => {
    product.schedulemove(place_id,order_no).then(d => {
        if (d == null){
            console.log('error');
            res.render('error');  //導向錯誤頁面
        }else if(d == -1){
            console.log('notFound');
            res.render('notFound');  //導向找不到頁面                
        }else{
            console.log('movesuccess');
            res.render('schedule_query', {items:d});  //傳至成功頁面
            //res.render('schedule_query', {results:d});  //傳至成功頁面
        }  
    })

    // product.scheduleupdate(place_id,order_no).then(d => {
    //     if (d>=0){
    //         res.render('schedule_query', {results:d});  //傳至成功頁面
    //     }else{
    //         res.render('addFail');     //導向錯誤頁面
    //     }  
    // })

    
});

module.exports = router ;