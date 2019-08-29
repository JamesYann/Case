
'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');


//------------------------------------------
// 新增收藏資料
//------------------------------------------
var addProcess = async function(place_id, place_name, lat, lng,photo_reference, schedule_id){
    //存放結果
    let result;  

    //讀取資料庫
    await query('insert into process (place_id, place_name, lat, lng,photo_reference, schedule_id) values ($1,$2,$3,$4,$5,$6)', [place_id, place_name, lat, lng,photo_reference, schedule_id])
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