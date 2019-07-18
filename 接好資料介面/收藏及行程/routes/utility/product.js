'use strict';

//引用操作資料庫的物件
const sql = require('./asyncDB');

//------------------------------------------
//執行資料庫動作的函式-傳回所有產品資料
//------------------------------------------
var list = async function(){
    var result=[];
	
    await sql('SELECT * FROM collection INNER JOIN attractions ON collection.att_id = attractions.att_id')
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


//匯出
module.exports = {list,one,processlist};
