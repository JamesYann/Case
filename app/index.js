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
    
    console.log('******************'+getdata);
    if(postback_identifier=='P'){                  //如果是P就是加入行程
       process_userdefined.addProcess(real_getdata,groupId,userId).then(data => {  
        if(data == -9){                    
            console.log('執行錯誤');
            event.reply('加入失敗');
        }else{
            console.log('已增加' + data + '筆記錄');
            event.reply('加入成功');
        }  
       })     
    }else if(postback_identifier=='C'){                 //如果是C就是加入收藏

        //placedetail google api url
        const detailurl="https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&placeid="+real_getdata+"&language=zh-TW"; 
        request(detailurl,function(error,response,body){
             if(!error&&response.statusCode==200){
                 var jsobject=JSON.parse(body);
                 var subobject=jsobject.result;
                 var name=subobject.name;
                 var lat=subobject.geometry.location.lat;
                 var lng=subobject.geometry.location.lng;
                 var photo_reference=subobject.photos[0].photo_reference;
                 console.log(name+lat+","+lng+photo_reference);
                 collect.addCollection(real_getdata, name, lat, lng, photo_reference, groupId, userId).then(data=>{
                    if(data == -9){                    
                       console.log('執行錯誤');
                       event.reply('收藏失敗');
                    }else{
                       console.log('已增加' + data + '筆記錄');
                       event.reply('收藏成功');
                    } 
                 })
             } 
        }); 
    }else if(postback_identifier=='N'){          //如果是N就顯示電話號碼
                                 
         //placedetail google api url
        const detailurl="https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&placeid="+real_getdata+"&language=zh-TW"; 
        request(detailurl,function(error,response,body){
            if(!error&&response.statusCode==200){ 
                var jsobject2=JSON.parse(body);
                var subobject2=jsobject2.result;                       
                var isPhoneElement=subobject2.hasOwnProperty("formatted_phone_number");
                var phone;               
                //判斷有無電話               
                if(isPhoneElement){
                    phone=subobject2.formatted_phone_number;
                }else{
                    phone='無';
                }
                event.reply(phone);
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
                         var rating=subobject.rating;
                         var vicinity=subobject.vicinity;
                         var place_id=subobject.place_id;
                         var photo_reference=subobject.photos[0].photo_reference;
                         var att_lat=subobject.geometry.location.lat;
                         var att_lng=subobject.geometry.location.lng;
                         var isOpenElement=subobject.hasOwnProperty("opening_hours"); //資料有無opening_hours元素
                         var isOpen;
                         
                         
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
                            "thumbnailImageUrl": 'https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&photoreference='+photo_reference+'&maxwidth=3000&height=3000',
                            "imageBackgroundColor": "#FFFFFF",
                            "title": '',
                            "text": '',
                            "defaultAction": {
                                "type": "uri",
                                "label": "詳細資料",
                                "uri": ""
                            },
                            "actions": [
                                {
                                    "type": "postback",
                                    "label": "加入行程",
                                    "data": "action=add&itemid=111"
                                }
                            ]
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
                          action_collect.data=place_id+'C';     //傳到POSTBACK讓事件以'C'識別要做http request加入收藏
                          action_phone.data=place_id+'N';      //傳到POSTBACK讓事件以'N'識別要做http request顯示電話
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
                                  "type": "action", //熱門景點
                                  "imageUrl":"https://node-express-browser.herokuapp.com/imgs/hot.png",
                                  "action": {
                                    "type": "message",
                                    "label": "熱門景點",
                                    "text": "熱門景點"
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
             }else{
                const searchurl="https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&query="+no+"&region=tw&language=zh-TW"
                //url內有中文所以要編碼
                const encodeurl=encodeURI(searchurl);
                request(encodeurl,function(error,response,body){
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
                         var formatted_address=subobject.formatted_address;
                         var photo_reference;
                         var place_id=subobject.place_id;
                         var att_lat=subobject.geometry.location.lat;
                         var att_lng=subobject.geometry.location.lng;
                         var isOpenElement=subobject.hasOwnProperty("opening_hours"); //資料有無opening_hours元素
                         var isOpen;
                         var isPhotoElement=subobject.hasOwnProperty("photos");  //資料有無photos元素
                         var isRatingElement=subobject.hasOwnProperty("rating");  //資料有無rating元素
                         
                         //判斷是否有評分
                         if(isRatingElement){
                            rating=subobject.rating;
                         }else{
                             rating="無評";
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

                         var content= {
                            "thumbnailImageUrl": 'https://maps.googleapis.com/maps/api/place/photo?key=AIzaSyA2dazAHnsooxnM6akxlJcp_vq1klEDScE&photoreference='+photo_reference+'&maxwidth=3000&height=3000',
                            "imageBackgroundColor": "#FFFFFF",
                            "title": '',
                            "text": '',
                            "defaultAction": {
                                "type": "uri",
                                "label": "詳細資料",
                                "uri": ""
                            },
                            "actions": [
                                {
                                    "type": "postback",
                                    "label": "收藏",
                                    "data": "C1"
                                },
                                {
                                    "type": "postback",
                                    "label": "加入行程",
                                    "data": "action=add&itemid=111"
                                }
                            ]
                          };
                          var action_phone={
                                    "type": "postback",
                                    "label": "電話",
                                    "data": ""
                                };
                          action_phone.data=place_id+'N';      //傳到POSTBACK讓事件以'N'識別要做http request顯示電話
                          content.actions.push(action_phone);
                          content.title=name;
                          content.text='營業狀態:'+isOpen+'\nGoogle評分為:'+rating+'分'+'\n'+'地址:'+formatted_address;
                          content.defaultAction.uri=search_map;
                          message.template.columns.push(content);

                        }

                        event.reply(message);
                    
                       

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