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

//執行資料庫動作的函式-傳回所有產品資料
//------------------------------------------
var processlist = async function(){
    var result=[];
    
    await sql('SELECT * FROM schedule AS a LEFT JOIN process AS b ON a.schedule_id = b.schedule_id  LEFT JOIN attractions AS c ON b.att_id = c.att_id')
        .then((data) => {            
            result = data.rows;  
        }, (error) => {
            result = null;
        });
        
    return result;
}

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


//----------------------------------
// 新增景點
//----------------------------------
var add = async function(newData){
    var result;

    await sql('INSERT INTO schedule (schedule_name) VALUES ($1,$2)', [newData.schedule_name])
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
var collectiontoprocess = async function(newData){
    var result;

    await sql('INSERT INTO process (place_name) VALUES ($1,$2,$3,$4,$5,$6)', [newData.place_id,newData.place_name, newData.lat,newData.lng,newData.photo_reference,newData.schedule_id])
        .then((data) => {
            result = 0;  
        }, (error) => {
            result = -1;
        });
        
    return result;
}

//處理Unhandle的問題
process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"

  });
  new Promise((_, reject) => reject(new Error('woops')))
.catch(new Function());
  
//----------------------------------------

// 新增收藏資料
//------------------------------------------
var selectProcess = async function(schedule_id){

    //存放結果
    var result;  
    console.log(schedule_id+"test")

    //讀取資料庫
    await sql('select place_name from process where schedule_id=$1 ', [schedule_id])
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
// 新增收藏資料
//------------------------------------------
var setOrder = async function(order_no,schedule_id,place_name){
    //存放結果
    var result;  

    //讀取資料庫
    await sql('UPDATE process set order_no= $1 where schedule_id=$2 and place_name=$3', [order_no,schedule_id,place_name])
        .then((data) => {
            result = data.rowCount;  //update資料數 
        }, (error) => {
            result = -9;  //執行錯誤
        });

    //回傳執行結果
    return result;  
}
//------------------------------------------

//匯出
module.exports = {setOrder,selectProcess,list,one,processlist,schedulelist,add,scheduledetail,remove,removecollection,schedulemove,deleteprocess,scheduledetail,select,collectiontoprocess};
