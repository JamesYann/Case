//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');
var request =require('request');

//增加引用函式
const attractions = require('./utility/attractions');
const collect = require('./utility/collect');
const process_userdefined=require('./utility/process'); //命為process_userdefined 因為process是程式保留字
const select_schedule=require('./utility/select_schedule');
const select_process=require('./utility/select_process');
const set_order=require('./utility/set_order');
const get_schedulename=require('./utility/get_schedulename');

//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1553087704',
    channelSecret: '0f407b60633cfd965a209e6e74fc1cf3',
    channelAccessToken: 'K0NhtbN9CXh4DYrGIjPe1WTl1KQElwwdFE7y7Zqj7ZKEvEnZZfpVVwDP3DBhBgfbZ8TpWvhN1ebk8ndcvC+xWEQ7OOdC+Z2WROFtPj5K4NwMEyGTnunZlaOm0e1f+V8M15OdOAUwdIVWS2ymj8XvyQdB04t89/1O/w1cDnyilFU='
});




//========================================
// 機器人接受回覆的處理
//========================================
bot.on('postback', function(event) { 
    const getdata = event.postback.data;
    const groupId = event.source.groupId;
    const userId = event.source.userId;
    const postback_identifier=getdata.substr(getdata.length-1,1);
    const real_getdata=getdata.substr(0,getdata.length-1); 
    const detailurl="https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&placeid="+real_getdata+"&language=zh-TW"; 
    console.log('******************'+getdata);
    if(postback_identifier=='P'){                  //如果是P就是加入行程
       select_schedule.selectSchedule(groupId).then(data=>{
           if(data==-9){
               console.log('執行錯誤');
           }else if(data==-1){
               console.log('無schedule');
               event.reply('目前無計畫表，請先新建資料表!');
           }else{
                var flex={
                    "type":"flex",
                    "altText":"關鍵字搜尋景點", 
                    "contents":{
                        "type": "bubble",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                            {
                                "type": "text",
                                "text": "請選擇欲加入之計畫表",
                                "weight": "bold",
                                "size": "xl"
                            }    
                            ]
                        },
                        "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "sm",
                            "contents": [
                            
                            ],
                            "flex": 0
                        }
                    }
                }
                for(i=0;i<10 && i<data.rows.length;i++){
                    var action=  {
                        "type": "button",
                        "style": "link",
                        "height": "sm",
                        "action": {
                            "type": "postback",
                            "label": "",
                            "data": ""
                        }
                    }
                    action.action.label='加入'+data.rows[i].schedule_name;
                    action.action.data=real_getdata+data.rows[i].schedule_id+'S';   //傳到POSTBACK讓事件以'S'識別要做選擇SCHEDULE加入景點
                    flex.contents.footer.contents.push(action);
                } 
                event.reply(flex);             
           }
       })

   
    }else if(postback_identifier=='C'){                 //如果是C就是加入收藏

        //placedetail google api url
        request(detailurl,function(error,response,body){
             if(!error&&response.statusCode==200){
                 var jsobject=JSON.parse(body);
                 var subobject=jsobject.result;
                 var name=subobject.name;
                 var lat=subobject.geometry.location.lat;
                 var lng=subobject.geometry.location.lng;
                 var photo_reference=subobject.photos[0].photo_reference;
                 
                 collect.addCollection(real_getdata, name, lat, lng, photo_reference, groupId, userId).then(data=>{
                    if(data == -9){                    
                       console.log('執行錯誤');
                       event.reply('已加入收藏');
                    }else{
                       console.log('已增加' + data + '筆記錄');
                       event.reply(name+' 收藏成功');
                    } 
                 })
             } 
        }); 
    }else if(postback_identifier=='N'){          //如果是N就顯示電話號碼
                                 
         //placedetail google api url
        request(detailurl,function(error,response,body){
            if(!error&&response.statusCode==200){ 
                var jsobject=JSON.parse(body);
                var subobject=jsobject.result;                       
                var isPhoneElement=subobject.hasOwnProperty("formatted_phone_number");
                var phone=subobject.name+":\n";               
                //判斷有無電話               
                if(isPhoneElement){
                    phone+=subobject.formatted_phone_number;
                }else{
                    phone+='無';
                }
                event.reply(phone);
            }      
         });
                         
    }else if(postback_identifier=='S'){
        var schname;
        get_schedulename.get_schedulename(real_getdata.substr(27,real_getdata.length-27)).then(data=>{
            if(data == -9){                    
                console.log('執行錯誤');
            }else{
                schname=data.rows[0].schedule_name;
            } 
        })
        const detailurlS="https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&placeid="+real_getdata.substr(0,27)+"&language=zh-TW"; 
        request(detailurlS,function(error,response,body){
             if(!error&&response.statusCode==200){
                 
                 var jsobject=JSON.parse(body);
                 var subobject=jsobject.result;
                 var name=subobject.name;
                 var lat=subobject.geometry.location.lat;
                 var lng=subobject.geometry.location.lng;
                 var photo_reference=subobject.photos[0].photo_reference;
                 
                 process_userdefined.addProcess(real_getdata.substr(0,27), name, lat, lng, photo_reference, real_getdata.substr(27,real_getdata.length-27)).then(data=>{
                    if(data == -9){                    
                       console.log('執行錯誤');
                       event.reply('計畫表已有此景點');
                    }else{
                       console.log('已增加' + data + '筆記錄');
                       event.reply(name+' 成功加入 '+schname);
                    } 
                 })
             } 
        });        
    }else if(postback_identifier=='O'){             //顯示所有營業時間
       request(detailurl,function(error,response,body){
           if(!error&&response.statusCode==200){
               var jsobject=JSON.parse(body);
               var subobject=jsobject.result;
               var name=subobject.name;
               var isOpenElement=subobject.hasOwnProperty("opening_hours");
               var opentime=name+'的營業時間:\n';
               if(isOpenElement){            //判斷有無營業時間
                   for(i=0;i<7;i++){
                      opentime+=subobject.opening_hours.weekday_text[i]+'\n';
                   }
               }else{
                   opentime+="無營業時間";
               }

               event.reply(opentime);
           }

       });
    }

    /*
    event.source.profile().then(function (profile) {
        const userName = profile.displayName;
		
        return event.reply([
            {
                "type": "text",
                "text": userId
            },
            {
                "type": "text",
                "text": userName
            }
        ]);		
    });
    */
});
//========================================


//========================================
// 機器人接受訊息的處理
//========================================
bot.on('message', function(event) {    
    event.source.profile().then(
        function (profile) {
            //取得使用者資料
            const userName = profile.displayName;
            const userId = profile.userId;
            //使用者傳來的文字
            var no = event.message.text;

            //使用者傳的型態為location
            if (event.message.type=="location"){
                var lat=event.message.latitude;    //使用者傳的經緯度
                var lnt=event.message.longitude;
                const address=event.message.address;  //使用者傳的位置
                //call place nearby google api 並將api key 經緯度等參數塞進去
                const nearbyurl='https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&location='+lat+','+lnt+'&rankby=distance&keyword=attractions&language=zh-TW'
                request(nearbyurl,function(error,response,body){
                    if(!error && response.statusCode==200){
                        var jsobject=JSON.parse(body);  //將接收到的data轉為json物件
                        var message={
                         "type": "template",
                         "altText": "附近景點結果",
                         "template": {
                            "type": "carousel",
                            "columns": [
                                
                            ],
                            "imageAspectRatio": "rectangle",
                            "imageSize": "cover"
                         }
                        };
                        
                        for(i=0;i<10;i++){
                         var subobject=jsobject.results[i];   
                         var name=subobject.name;
                         var isRatingElement=subobject.hasOwnProperty("rating");
                         var vicinity=subobject.vicinity;
                         var place_id=subobject.place_id;
                         var isPhotoElement=subobject.hasOwnProperty("photos"); //資料有無photos元素
                         var att_lat=subobject.geometry.location.lat;
                         var att_lng=subobject.geometry.location.lng;
                         var isOpenElement=subobject.hasOwnProperty("opening_hours"); //資料有無opening_hours元素
                         var isOpen;
                         var photo_reference;
                         var rating;
                         

                         //判斷有無評分
                         if(isRatingElement){
                             rating=subobject.rating;
                         }else{
                             rating="無評";
                         }

                         //判斷有無照片
                         if(isPhotoElement){
                             photo_reference=subobject.photos[0].photo_reference;
                         }else{
                             photo_reference=null;
                         }
                    
                         
                         //判斷是否營業的條件式
                         if(isOpenElement==false){
                            isOpen='-';  //沒有就 傳"-"
                         }else if(isOpenElement==true){
                             var open_now=subobject.opening_hours.open_now;
                            
                             if(open_now==true){
                               isOpen='營業中';
                             }else if(open_now==null){
                               isOpen='-'   //有opening_hours元素 但其open_now元素為空值
                             }else if(open_now==false){
                               isOpen='休息中' ;
                             }
                         }
                         
                         //google map api url
                         const mapurl="https://www.google.com/maps/search/?api=1&query="+att_lat+","+att_lng+"&query_place_id="+place_id

                         var content= {
                            "thumbnailImageUrl": 'https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&photoreference='+photo_reference+'&maxwidth=1000&height=1000',
                            "imageBackgroundColor": "#FFFFFF",
                            "title": '',
                            "text": '',
                            "defaultAction": {
                                "type": "uri",
                                "label": "詳細資料",
                                "uri": ""
                            },
                            "actions": [

                            ]
                          };
                          var action_process={        
                                    "type": "postback",
                                    "label": "加入行程",
                                    "data": "action=add&itemid=111"
                                
                          };
                          var action_collect={
                                    "type": "postback",
                                    "label": "收藏",
                                    "data": ""
                                };
                          var action_phone={
                                    "type": "postback",
                                    "label": "電話",
                                    "data": ""
                                };
                              
                          action_process.data=place_id+'P';     //傳到POSTBACK讓事件以'P'識別要做http request加入行程                      
                          action_collect.data=place_id+'C';     //傳到POSTBACK讓事件以'C'識別要做http request加入收藏
                          action_phone.data=place_id+'N';      //傳到POSTBACK讓事件以'N'識別要做http request顯示電話
                          content.actions.push(action_process);
                          content.actions.push(action_collect);
                          content.actions.push(action_phone);
                          content.title=name;
                          content.text='營業狀態:'+isOpen+'\nGoogle評分為:'+rating+'分'+'\n'+'地址:'+vicinity;
                          content.defaultAction.uri=mapurl;
                          message.template.columns.push(content);

                        }

                        event.reply(message);
                    


                    }
                })

                
            }          

            //使用者傳的型態為text
            if(event.message.type=="text"){
             if(no=="附近景點"){
             	event.reply({
                 "type": "template",
                 "altText": "這是按鈕樣板",
                 "template": {
                 "type": "buttons",
                 "text": "請告訴我你目前在哪?",
                 "actions": [
                 {
                  "type": "uri",
                  "label": "傳送我的位置!",
                  "uri": "line://nv/location"
                 }
                 ]
                }
                });    
             }else if(no=="選單"){
                    event.reply([
                            {
                            "type": "text", 
                            "text": "選擇你需要的功能",
                            "quickReply": { 
                              "items": [
                                {
                                  "type": "action", //收藏
                                  "imageUrl": "https://node-express-browser.herokuapp.com/imgs/collect.png",
                                  "action": {
                                    "type": "message",
                                    "label": "收藏",
                                    "text": "看收藏"
                                  }
                                },
                                {
                                  "type": "action", //行程
                                  "imageUrl":"https://node-express-browser.herokuapp.com/imgs/process.png",
                                  "action": {
                                    "type": "message",
                                    "label": "行程",
                                    "text": "看行程"
                                  }
                                },
                                {
                                  "type": "action", //推薦路線
                                  "imageUrl":"https://node-express-browser.herokuapp.com/imgs/hot.png",
                                  "action": {
                                    "type": "message",
                                    "label": "推薦路線",
                                    "text": "推薦路線"
                                  }
                                },
                                {
                                    "type": "action", //附近景點
                                    "imageUrl":"https://node-express-browser.herokuapp.com/imgs/attraction.png",
                                    "action": {
                                      "type": "location",
                                      "label": "附近景點"
                                    }
                                  }
                              ]
                            }
                          }
                        ])
             }else if(no=='test路徑'){
                var schedule_id=16
                select_process.selectProcess(schedule_id).then(data=>{
                    if(data==-9){
                        console.log("執行錯誤");
                    }else if(data==-1){
                        console.log("此計畫表目前無景點");
                    }else{
                        var origin='21.903975, 120.854543'; //出發地經緯度
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
                                 //console.log(body);
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
                                    
                                    set_order.setOrder(i+1,schedule_id,place_array[next-1]).then(data=>{
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
                             }

                        })


                        


                    }
                })
             }else if(no=='flex'){
                console.log("flex*******************")
                
                var flex={
                    "type":"flex",
                    "altText":"關鍵字搜尋景點", 
                    "contents":{
                        "type": "bubble",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                            {
                                "type": "text",
                                "text": "請選擇欲加入之計畫表",
                                "weight": "bold",
                                "size": "xl"
                            }    
                            ]
                        },
                        "footer": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "sm",
                            "contents": [
                            
                            ],
                            "flex": 0
                        }
                    }
                }

                for(i=0;i<=9;i++){
                    var action=  {
                    "type": "button",
                    "style": "link",
                    "height": "sm",
                    "action": {
                    "type": "uri",
                    "label": "CALL",
                    "uri": "https://linecorp.com"
                    }
                   }
                   flex.contents.footer.contents.push(action);
                }
                flex.contents.footer.contents.push( {
                "type": "spacer",
                "size": "sm"
                });



                event.reply(flex);
             }else{
                const searchurl="https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&query="+no+"&region=tw&language=zh-TW"
                //url內有中文所以要編碼
                const encodeurl=encodeURI(searchurl);
                request(encodeurl,function(error,response,body){
                    if(!error && response.statusCode==200){
                        var jsobject=JSON.parse(body);  //將接收到的data轉為json物件
                        var flex={
                            "type":"flex",
                            "altText":"關鍵字搜尋景點", 
                            "contents":{
                                "type":"carousel",
                                "contents":[]
                            }
                        }
                        var loopnum;
                        if(jsobject.results.length<=10){
                            loopnum=jsobject.results.length
                        }else{
                            loopnum=10;
                        }
                        for(i=0;i<loopnum;i++){
                         var subobject=jsobject.results[i]; 
                         
                         var name=subobject.name;
                         var rating;
                         var formatted_address;
                         var isAddressElement=subobject.hasOwnProperty("formatted_address");//資料有無地址
                         var photo_reference;
                         var place_id=subobject.place_id;
                         var att_lat=subobject.geometry.location.lat;
                         var att_lng=subobject.geometry.location.lng;
                         var isOpenElement=subobject.hasOwnProperty("opening_hours"); //資料有無opening_hours元素
                         var isOpen;
                         var isPhotoElement=subobject.hasOwnProperty("photos");  //資料有無photos元素
                         var isRatingElement=subobject.hasOwnProperty("rating");  //資料有無rating元素
                         
                         //判斷有無地址
                         if(isAddressElement){
                             formatted_address=subobject.formatted_address;
                         }else{
                             formatted_address="-"
                         }
                         
                         //判斷是否有評分
                         if(isRatingElement){
                            rating=subobject.rating;
                         }else{
                             rating="無評分";
                         }
                         //判斷是否有照片
                         if(isPhotoElement){
                            photo_reference=subobject.photos[0].photo_reference;
                         }else{
                            photo_reference=null;
                         }
                         
                         //判斷是否營業的條件式
                         if(isOpenElement==false){
                            isOpen='-';  //沒有就 傳"-"
                         }else if(isOpenElement==true){
                             var open_now=subobject.opening_hours.open_now;
                            
                             if(open_now==true){
                               isOpen='營業中';
                             }else if(open_now==null){
                               isOpen='-'   //有opening_hours元素 但其open_now元素為空值
                             }else if(open_now==false){
                               isOpen='休息中' ;
                             }
                         }
                         
                        
                         //google map api url
                         const search_map="https://www.google.com/maps/search/?api=1&query="+att_lat+","+att_lng+"&query_place_id="+place_id

                         var content={
                            "type": "bubble",
                            "hero": {
                                "type": "image",
                                "url": 'https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&photoreference='+photo_reference+'&maxwidth=1000&height=1000',
                                "size": "full",
                                "aspectRatio": "20:13",
                                "aspectMode": "cover",
                                "action": {
                                "type": "uri",
                                "uri": ""
                                }
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                {
                                    "type": "text",
                                    "text": "",
                                    "weight": "bold",
                                    "size": "xl"
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "margin": "md",
                                    "contents": [

                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "vertical",
                                    "margin": "lg",
                                    "spacing": "sm",
                                    "contents": [

                                    ]
                                }
                                ]
                            },
                            "footer": {
                                "type": "box",
                                "layout": "vertical",
                                "spacing": "sm",
                                "contents": [

                                ],
                                "flex": 0
                            }
                        }

                          var address={
                                        "type": "box",
                                        "layout": "baseline",
                                        "spacing": "sm",
                                        "contents": [
                                        {
                                            "type": "text",
                                            "text": "地址",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 1
                                        },
                                        {
                                            "type": "text",
                                            "text": "testaddress",
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 5
                                        }
                                        ]
                         }
                         address.contents[1].text=''+formatted_address;
                         content.body.contents[2].contents.push(address);

                         var open=             {
                                        "type": "box",
                                        "layout": "baseline",
                                        "spacing": "sm",
                                        "contents": [
                                        {
                                            "type": "text",
                                            "text": "狀態",
                                            "color": "#aaaaaa",
                                            "size": "sm",
                                            "flex": 1
                                        },
                                        {
                                            "type": "text",
                                            "text": "testisopen",
                                            "wrap": true,
                                            "color": "#666666",
                                            "size": "sm",
                                            "flex": 5
                                        }
                                        ]
                             }
                          open.contents[1].text=isOpen;   
                          content.body.contents[2].contents.push(open);

                          
                          var goldstar={
                                        "type": "icon",
                                        "size": "sm",
                                        "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                                    }
                          var graystar={
                                        "type": "icon",
                                        "size": "sm",
                                        "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                                    } 
                          var halfstar={
                              "type":"icon",
                              "size":"sm",
                              "url":"https://node-express-browser.herokuapp.com/imgs/half-star.png"
                          }

                        
                          if(rating=="無評分"){
                              for(j=1;j<=5;j++){
                                content.body.contents[1].contents.push(graystar);
                              }
                              
                          }else{
                              for(p=1;p<=rating;p++){
                                 content.body.contents[1].contents.push(goldstar); 
                              }
                              if(rating*10-Math.floor(rating)*10>=5){
                                  content.body.contents[1].contents.push(halfstar);
                                  for(k=1;k<=(5-Math.floor(rating)-1);k++){
                                      content.body.contents[1].contents.push(graystar);
                                  }
                              }else{
                                for(k=1;k<=(5-Math.floor(rating));k++){
                                    content.body.contents[1].contents.push(graystar);
                                }

                              }
                            
                          }

                         
                          var ratingpoint= {
                                        "type": "text",
                                        "text": "",
                                        "size": "sm",
                                        "color": "#999999",
                                        "margin": "md",
                                        "flex": 0
                                    }
                           ratingpoint.text=rating.toString();
                           content.body.contents[1].contents.push(ratingpoint);       

                          
                          

                          var action_process={
                                    "type": "button",
                                    "style": "link",
                                    "height": "sm",
                                    "action": {
                                         "type": "postback",
                                         "label": "加入行程",
                                         "data": ""
                                    }
                            }
                          var action_collect={
                                    "type": "button",
                                    "style": "link",
                                    "height": "sm",
                                    "action": {
                                         "type": "postback",
                                         "label": "收藏",
                                         "data": ""
                                    }
                            }
                          var action_phone={
                                    "type": "button",
                                    "style": "link",
                                    "height": "sm",
                                    "action": {
                                         "type": "postback",
                                         "label": "電話",
                                         "data": ""
                                    }
                            }
                           var action_opentime={
                                    "type": "button",
                                    "style": "link",
                                    "height": "sm",
                                    "action": {
                                         "type": "postback",
                                         "label": "顯示營業時間",
                                         "data": ""
                                    }
                            }
                          
                          action_process.action.data=place_id+'P';    //傳到POSTBACK讓事件以'P'識別要做http request加入行程
                          action_collect.action.data=place_id+'C';    //傳到POSTBACK讓事件以'C'識別要做http request加入收藏
                          action_phone.action.data=place_id+'N';      //傳到POSTBACK讓事件以'N'識別要做http request顯示電話
                          action_opentime.action.data=place_id+'O';    //傳到POSTBACK讓事件以'O'識別要做http request顯示電話
                          content.footer.contents.push(action_process);
                          content.footer.contents.push(action_collect);
                          content.footer.contents.push(action_phone);
                          content.footer.contents.push(action_opentime);

                          content.hero.action.uri=search_map;
                          content.body.contents[0].text=name;
                          flex.contents.contents.push(content);

                        }

                        event.reply(flex);
                    
                       

                    }
                })
             }

            }   
        }
    );
});
//========================================


//----------------------------------------
// 建立一個網站應用程式app
// 如果連接根目錄, 交給機器人處理
//----------------------------------------
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);


//----------------------------------------
// 可直接取用檔案的資料夾
//----------------------------------------
app.use(express.static('public'));


//----------------------------------------
// 監聽3000埠號, 
// 或是監聽Heroku設定的埠號
//----------------------------------------
var server = app.listen(process.env.PORT || 3000, function() {
    const port = server.address().port;
    console.log("正在監聽埠號:", port);
});