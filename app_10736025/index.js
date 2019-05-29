//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

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
    const att_id=getdata.substr(0,getdata.length-1);
    
    console.log('******************');
    if(postback_identifier=='P'){                  //如果是P就是加入行程
       process_userdefined.addProcess(att_id,groupId,userId).then(data => {  
        if(data == -9){                    
            console.log('執行錯誤');
            event.reply('加入失敗');
        }else{
            console.log('已增加' + data + '筆記錄');
            event.reply('加入成功');
        }  
       })     
    }else if(postback_identifier=='C'){            //如果是C就是加入行程
       collect.addCollection(att_id,groupId,userId).then(data => {  
        if(data == -9){                    
            console.log('執行錯誤');
            event.reply('收藏失敗');
        }else{
            console.log('已增加' + data + '筆記錄');
            event.reply('收藏成功');
        }  
       })        
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
	    
            //使用者傳來的學號
            const no = event.message.text;
          
            //呼叫API取得學生資料
            attractions.fetchattractions(no).then(data => {  
                if (data == -1){
                    event.reply('');
                }else if(data == -9){                    
                    event.reply('執行錯誤');
                }else{  
                  


                    var message={
                        "type": "template",
                        "altText": "查詢景點結果",
                        "template": {
                            "type": "carousel",
                            "columns": [
                                
                            ],
                            "imageAspectRatio": "rectangle",
                            "imageSize": "cover"
                        }
                    }

                    for(i=0;i<data.length;i++){
                        var content= {
                            "thumbnailImageUrl": "https://www.trimt-nsa.gov.tw/Web/FileDownload/Scenery/Big/20180716162134186272293.jpg",
                            "imageBackgroundColor": "#FFFFFF",
                            "title": 'data.attractionsname',
                            "text": 'data.att_id',
                            "defaultAction": {
                                "type": "uri",
                                "label": "詳細資料",
                                "uri": "https://zh.wikipedia.org/wiki/星夜"
                            },
                            "actions": [
                                /*{
                                    "type": "postback",
                                    "label": "收藏",
                                    "data": "C1"
                                },
                                {
                                    "type": "postback",
                                    "label": "加入行程",
                                    "data": "action=add&itemid=111"
                                },
                                {
                                    "type": "uri",
                                    "label": "詳細資料",
                                    "uri": "https://zh.wikipedia.org/wiki/星夜"
                                }*/
                            ]
                          };
                          content.title=data[i].attractionsname;
                          content.text='電話:'+data[i].tel+'\r\n'+'地址:'+data[i].address;
                          content.thumbnailImageUrl=data[i].picture;
 
                          
                          var content1={
                                    "type": "postback",
                                    "label": "收藏",
                                    "data": "C1"
                          };

                          var content2={
                                    "type": "postback",
                                    "label": "加入行程",
                                    "data": "C1"
                          };                   
                            
                          content1.data=data[i].att_id+'C';  //傳到POSTBACK讓事件以'C'識別要做加入collect
                          content2.data=data[i].att_id+'P';  //傳到POSTBACK讓事件以'P'識別要做加入Process
                          content.actions.push(content1);
                          content.actions.push(content2);
                          

               
                          

                        message.template.columns.push(content);
                    }
                    
                    
                    event.reply(message);         

                        
                }  
            })  
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