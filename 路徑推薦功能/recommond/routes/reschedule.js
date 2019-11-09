var express = require('express');
var router = express.Router();
var request=require('request');


//增加引用函式
//var moment = require('moment');
const product = require('./utility/product');


//接收POST請求
router.post('', function(req, res, next) {
    var schedule_id = String(req.body.schedule_id); 
    var lat = String(req.body.latitude); 
    var lng = String(req.body.longitude);  
  
 
    console.log("js"+schedule_id);
   
    product.selectProcess(schedule_id).then(data=>{

        if(data==null){
            console.log("執行錯誤");
            res.render('error');  //導向錯誤頁面
        }else if(data==-1){
            console.log("此計畫表目前無景點");
            res.render('notFound');  //導向找不到頁面 
        }else{
            // var origin='21.903975, 120.854543'; //出發地經緯度
            var origin =lat +', '+ lng;//出發地經緯度
            var destination=origin+'|';
            var place_array=new Array(data.rows.length);

            
            for(i=0;i<data.rows.length;i++){
                if(i!=(data.rows.length-1)){
                    destination=destination+data.rows[i].place_name+'|';
                    place_array[i]=data.rows[i].place_name;
                }else{
                    destination=destination+data.rows[i].place_name;
                    place_array[i]=data.rows[i].place_name;
                }   
            }

            console.log(place_array);
            
            const distance_matrix_url=encodeURI('https://maps.googleapis.com/maps/api/distancematrix/json?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&origins='+destination+'&destinations='+destination+'&region=tw&language=zh-TW');

            request(distance_matrix_url,function(error,response,body){
                                      
                if(!error&&response.statusCode==200){
                    console.log(body+"test2");
                    var jsobject=JSON.parse(body);
                    

                //建立二維陣列
                    var distance_matrix=new Array();
                    for(i=0;i<=data.rows.length;i++){
                        distance_matrix[i]=new Array();
                        var subobject= jsobject.rows[i];
                        for(j=0;j<=data.rows.length;j++){
                            distance_matrix[i][j]=subobject.elements[j].duration.value;
                        }
                    }
            
                    //找陣列中非零最小值
                    Array.prototype.min=function(){
                        var min=this[0];
                        if(min==0){
                            min=Infinity;
                        }
                        this.forEach(function(ele,index,arr){
                            if(ele<min&&ele!=0){
                                min=ele;
                            }
                        })
                        return min;
                    }


                    console.log(distance_matrix);
                    var index_array=new Array();
                    var index;
                    var next;
                    for(i=0;i<distance_matrix.length-1;i++){
                        if(i==0){
                            index=0;
                        }else{
                            index=next;
                        }
                        next=distance_matrix[index].indexOf(distance_matrix[index].min());
                        
                        product.setOrder(i+1,schedule_id,place_array[next-1]).then(data=>{
                            if(data==-9){
                                console.log("執行錯誤");
                            }else{
                                console.log("update成功");
                            }
                        })
                        console.log("第"+(i+1)+"個要去的景點:"+place_array[next-1]);
                        
                        //將已選擇過的景點的該列該行元素皆設為無限大
                        for(j=0;j<distance_matrix.length;j++){  
                            distance_matrix[index][j]=Infinity;
                            distance_matrix[j][index]=Infinity;
                        }
                                                                                        
                    }
                    console.log('hihi');
                }

            })

        

            console.log('reschedulesuccess');
            res.render('schedule_query', {items:data});

        }
    })
});
 


module.exports = router ;