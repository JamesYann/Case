
'use strict';

//引用操作資料庫的物件
const query = require('./asyncDB');


//------------------------------------------
// 新增收藏資料
//------------------------------------------
var selectSchedule = async function(group_id){
    //存放結果
    let result;  

    //讀取資料庫
    await query('select * from schedule where group_id=$1', [group_id])
        .then((data) => {
            if(data.rows.length>0){
                result=data;
            }else{
                result=-1;//找不到資料
            }
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
    return result;  
}
//------------------------------------------

//匯出
module.exports = {selectSchedule};
