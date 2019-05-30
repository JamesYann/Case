
'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');


//------------------------------------------
// 新增收藏資料
//------------------------------------------
var addCollection = async function(att_id, group_id,user_id){
    //存放結果
    let result;  

    //讀取資料庫
    await query('insert into collection (att_id, group_id, user_id) values ($1, $2, $3)', [att_id, group_id,user_id])
        .then((data) => {
            result = data.rowCount;  //新增資料數 
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
    return result;  
}
//------------------------------------------

//匯出
module.exports = {addCollection};