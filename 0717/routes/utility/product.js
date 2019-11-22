'use strict';

//引用操作資料庫的物件
const sql = require('./asyncDB');

//------------------------------------------
//執行資料庫動作的函式-傳回所有產品資料
//------------------------------------------
var list = async function(group_id){
    var result=[];
	
    await sql('SELECT * FROM collection  where group_id=$1',[group_id])
        .then((data) => {            
            result = data.rows;  
        }, (error) => {
            result = null;
        });
		
    return result;
}

//執行資料庫動作的函式-傳回所有產品資料
//------------------------------------------

var schedulelist = async function(group_id){
    //var group_id = 1;
    //console.log('****');
    //console.log(group_id);
    var result=[];
    
    await sql('SELECT * FROM schedule where group_id=$1',[group_id])
        .then((data) => {            
            result = data.rows;  
        }, (error) => {
            result = null;
        });
        
    return result;
}

//------------------------------------------
//執行資料庫動作的函式-依照placeid去找他的GID
//------------------------------------------
var select = async function(group_id){
    var result=[];
    
    await sql('SELECT * FROM schedule where group_id=$1',[group_id])
        .then((data) => {            
            result = data.rows;  
        }, (error) => {
            result = null;
        });
        
    return result;
}

//------------------------------------------
//執行資料庫動作的函式-取出單一商品
//------------------------------------------
var one = async function(group_id){
    var result={};
    
    await sql('SELECT * FROM collection INNER JOIN attractions ON collection.att_id = attractions.att_id WHERE group_id = $1', [group_id])
    .then((data) => {            
        result = data.rows;  
    }, (error) => {
        result = null;
    });
        
    return result;
}


//----------------------------------
// 新增景點
//----------------------------------
/*var add = async function(newData){
    var result;

    await sql('INSERT INTO schedule (schedule_name) VALUES ($1,$2)', [newData.schedule_name,newData.group_id])
        .then((data) => {
            result = 0;  
        }, (error) => {
            result = -1;
        });
        
    return result;
}
*/
//----------------------------------
// 新增計畫表
//----------------------------------
var addPlan = async function(newData){
    var result;

    await sql('INSERT INTO schedule (schedule_name,group_id) VALUES ($1,$2)', [newData.schedule_name,newData.group_id])
        .then((data) => {
            result = 0;  
        }, (error) => {
            result = -1;
        });
        
    return result;
    }

//----------------------------------
//收藏點新增至行程
//----------------------------------
var collectiontoprocess = async function(newData){
    var result;

    await sql('INSERT INTO process VALUES ($1,$2)', [newData.place_id,newData.schedule_id])
        .then((data) => {
            result = 0;  
        }, (error) => {
            result = -1;
        });
        
    return result;
}

var scheduledetail = async function(schedule_id){
    var result={};
    
    await sql('select * from schedule join process on schedule.schedule_id= process.schedule_id  where schedule.schedule_id= $1', [schedule_id])
     .then((data) => {            
            result = data.rows;  
        }, (error) => {
            result = null;
        });
        
    return result;
}

//----------------------------------
// 刪除商品
//----------------------------------
var remove = async function(place_id){
    var result;

    await sql('DELETE FROM process WHERE place_id = $1', [place_id])
        .then((data) => {
            result = data.rowCount;  
        }, (error) => {
            result = -1;
        });
        
    return result;
}
//----------------------------------
// 刪除收藏
//----------------------------------
var removecollection = async function(place_id){
    var result;

    await sql('DELETE FROM collection WHERE place_id = $1', [place_id])
        .then((data) => {
            result = data.rowCount;  
        }, (error) => {
            result = -1;
        });
        
    return result;
}




//匯出
module.exports = {list,one,schedulelist,addPlan,collectiontoprocess,scheduledetail,remove,removecollection,select};
