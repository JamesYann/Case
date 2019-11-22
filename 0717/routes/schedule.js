var express = require('express');
var router = express.Router();

//增加引用函式
const product = require('./utility/product');

//接收GET請求


router.get('/', function(req, res, next) {

     var group_id = req.query.group_id; 
     console.log('group_id  '+req.query.group_id);

    product.schedulelist(group_id).then(data => {
        if(data==null){
        	console.log("error");
            res.render('error');  //導向錯誤頁面
        }else if(data.length > 0){
        	console.log("schedule_success");
            res.render('schedule', {items:data});//將資料傳給顯示頁面
        }else{
        	console.log("notfound");
            res.render('notFound');  //導向找不到頁面
        }  
    })

});


module.exports = router;