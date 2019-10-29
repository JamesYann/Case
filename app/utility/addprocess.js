'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');

//------------------------------------------
// 新增收藏資料
//------------------------------------------
var addProcess = async function(groupId){
    //存放結果
    let result;  

    //讀取資料庫
    await query('select * from schedule where groupId = $1', [groupId])
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
module.exports = {addProcess};