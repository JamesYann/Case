'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');

//------------------------------------------
// 由ID查詢景點資料
//------------------------------------------
var addschedule = async function(schedule_name,group_id){
    //存放結果
    let result;  

    //讀取資料庫
    await query('insert into schedule (schedule_name,group_id) values ($1, $2)',[schedule_name,group_id])
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
module.exports = {addschedule};