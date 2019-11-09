var express = require('express');
var router = express.Router();

//增加引用函式
const product = require('./utility/product');

//接收GET請求
router.get('/', function(req, res, next) {

    var group_id = req.query.group_id; 
    console.log(req.query.group_id);
    
    product.list(group_id).then(data => {
        if(data==null){
        	console.log("error");
            res.render('error');  //導向錯誤頁面
        }else if(data.length > 0){
        	console.log("collection_success");
            res.render('collection', {items:data});  //將資料傳給顯示頁面
        }else{
        	console.log("notfound");
            res.render('notFound');  //導向找不到頁面
        }  
    })
});

router.get('/collect/delete/:place_id', function(req, res, next) {
    var place_id = req.params.place_id;

    product.removecollection(place_id).then(d => {
        if (d >= 0) {
            return res.redirect('back');
            console.log(place_id); 
        } else {
            res.render('addFail');     //導向錯誤頁面
            console.log(fail);
        }
    })  
});



module.exports = router;