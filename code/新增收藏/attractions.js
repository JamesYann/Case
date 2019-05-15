'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');

//------------------------------------------
// 由ID查詢景點資料
//------------------------------------------
var fetchattractions = async function(att_id){
    //存放結果
    let result;  

    //讀取資料庫
    await query('select * from attractions where att_id =$1',[att_id])
        .then((data) => {
            if(data.rows.length > 0){
                result = data.rows[0];  //景點資料(物件)
            }else{
                result = -1;  //找不到資料
            }    
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
    return result;  
}
//------------------------------------------

//------------------------------------------
// 新增收藏資料
//------------------------------------------
var addCollection = async function(collect_id, att_id, group_id){
    //存放結果
    let result;  

    //讀取資料庫
    await query('insert into collection (collect_id, att_id, group_id) values ($1, $2, $3)', [collect_id, att_id, group_id])
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
module.exports = {fetchattractions, addCollection};