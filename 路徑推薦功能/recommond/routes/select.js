var express = require('express');
var router = express.Router();

const product = require('./utility/product');

/* GET home page. */
router.get('/', function(req, res, next) {

	var place_id = req.query.place_id; 
	var group_id = req.query.group_id; 
    console.log('exe select');
	console.log('place_id  '+req.query.place_id);
    console.log('group_id  '+req.query.group_id);

        product.select(group_id).then(data => {
        if(data==null){
            console.log("error");
            res.render('error');  //導向錯誤頁面
        }else if(data.length > 0){
            console.log("select_success");
            res.render('select', {items:data});//將資料傳給顯示頁面
        }else{
            console.log("notfound");
            res.render('notFound');  //導向找不到頁面
        }  
    })

});
   

module.exports = router;
