var express = require('express');
var router = express.Router();

//增加引用函式
const product = require('./utility/product');

//接收GET請求
router.get('/', function(req, res, next) {
    product.list().then(data => {
        if(data==null){
        	console.log("error");
            res.render('error');  //導向錯誤頁面
        }else if(data.length > 0){
        	console.log("index1");
            res.render('productlist', {items:data});  //將資料傳給顯示頁面
        }else{
        	console.log("notfound");
            res.render('notFound');  //導向找不到頁面
        }  
    })
});

module.exports = router;