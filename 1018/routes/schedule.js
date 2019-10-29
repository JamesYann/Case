var express = require('express');
var router = express.Router();

//增加引用函式
const product = require('./utility/product');

//接收GET請求
router.get('/', function(req, res, next) {

     //var group_id = req.params.group_id;
     //var id=$(this).attr("id");
     //var group_id = 'Cef53cade6bd89a41c85cd4feb109068a';
    var group_id = 'Cef53cade6bd89a41c85cd4feb109068a';

     //var getUrlString = location.href;
     //var url = new URL(getUrlString);
     //url.searchParams.get('group_id'); // 回傳 21
     //var group_id = req.params.group_id;
    //  var urlSearchParams = URL.searchParams;

    // let params = (new URL(url.location)).searchParams;
    // let group_id = params.get('group_id'); 
    console.log(group_id);

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