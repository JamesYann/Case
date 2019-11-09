var express = require('express');
var router = express.Router();
 
//增加引用函式
//var moment = require('moment');
const product = require('./utility/product');

//接收GET請求
router.get('/', function(req, res, next) {
    var schedule_id = req.query.schedule_id;   //取出參數

    product.scheduledetail(schedule_id).then(data => {
         if (data==null){
            res.render('error');  //導向錯誤頁面
        }else if(data==-1){
            res.render('notFound');  //導向找不到頁面                
        }else{
            console.log(schedule_id);
            res.render('schedule_query', {items:data});  //將資料傳給顯示頁面
        }  
    })

});



router.get('/place/delete/:place_id', function(req, res, next) {
    var place_id = req.params.place_id;

    product.remove(place_id).then(d => {
        if (d >= 0) {
            return res.redirect('back');
            //return res.redirect('/schedule_query');  //傳至成功頁面    
            console.log(place_id); 
        } else {
            res.render('addFail');     //導向錯誤頁面
            console.log(fail);
        }
    })  
})


module.exports = router;