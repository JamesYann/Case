'use strict';

//引用操作資料庫的物件
const sql = require('./asyncDB');

//------------------------------------------
//執行資料庫動作的函式-傳回所有產品資料
//------------------------------------------
var list = async function(){
    var result=[];
	
    await sql('SELECT * FROM collection')
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

//執行資料庫動作的函式-傳回所有產品資料 SELECT * FROM process AS a RIGHT JOIN schedule AS b ON a.schedule_id = b.schedule_id 
//------------------------------------------
var processlist = async function(){
    var result=[];
    
    await sql('SELECT * FROM process AS a RIGHT JOIN schedule AS b ON a.schedule_id = b.schedule_id')
        .then((data) => {            
            result = data.rows;  
        }, (error) => {
            result = null;
        });
        
    return result;
}

var schedulelist = async function(group_id){
    var result=[];
    
    await sql('SELECT distinct on (schedule_name) * FROM schedule where group_id = $1', [group_id])
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
var add = async function(newData){
    var result;

    await sql('INSERT INTO schedule (schedule_name,day_number) VALUES ($1,$2)', [newData.schedule_name, newData.day_number])
        .then((data) => {
            result = 0;  
        }, (error) => {
            result = -1;
        });
        
    return result;
}

//----------------------------------
// 0724查詢某行程的所有景點
//----------------------------------
/*var scheduledetail = async function(schedule_id){
    var result={};
    
    await sql('SELECT * FROM schedule INNER JOIN process INNER JOIN attractions ON schedule.schedule_id = process.schedule_id WHERE schedule_id = $1', [schedule_id])
      .then((data) => {
            if(data.rows.length > 0){
                result = data.rows[0];   
            }else{
                result = -1;
            }    
        }, (error) => {
            result = null;
        });
        
    return result;
}*/
var scheduledetail = async function(schedule_id){
    var result={};
    
    await sql('select place_id , order_no , schedule.schedule_id , schedule.group_id  ,process.place_name from schedule join process on schedule.schedule_id= process.schedule_id  where schedule.schedule_id= $1 order by order_no', [schedule_id])
     .then((data) => {            
            result = data.rows;  
        }, (error) => {
            result = null;
        });
        
    return result;
}

//修改order_no
var schedulemove = async function(place_id,order_no){
    var result={};

    await sql('update process set order_no = $1 where place_id= $2', [order_no ,place_id])
     .then((data) => {                        
            result = data.rows;              
        }, (error) => {            
            result = null;            
        });        
        
    return result;
}

var deleteprocess = async function(place_id){
    var result={};    
    
    await sql('delete from process where place_id = $1', [place_id])
     .then((data) => {            
            result = data.rows;  
        }, (error) => {
            result = null;
        });
        
    return result;
}

//匯出
module.exports = {list,one,processlist,schedulelist,add,scheduledetail,schedulemove,deleteprocess};
