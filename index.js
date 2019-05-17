//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const attractions = require('./utility/attractions');
const collect = require('./utility/collect');

//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1647290894',
    channelSecret: '7585f07ee67ce3c9ca156ecb1677dcf3',
    channelAccessToken: 'mZ/M5CZSHCyy1ogif29onWyvJuqhJaUuRX+eWAF4RW2T73sMMjFxMCQZ8cOvyCnskawvLbZbE3sAWNdIykAPKoHXbaSbBrYJH9LyaXnbgam9U8qX7u38VE50qD7m1jVrDsH/4QEEPFf8paPuHC+thgdB04t89/1O/w1cDnyilFU='
});

//========================================
// 機器人接受回覆的處理
//========================================

bot.on('postback', function(event) { 
    const att_id = event.postback.data;
    const userId = event.source.userId;
    const groupid= event.source.groupid;


    //console.log('******************');
    collect.addCollection('3', att_id, groupid).then(data => {  
        if(data == -9){                    
            console.log('執行錯誤');
        }else{
            console.log('已新增收藏');
        }  
    })

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
                    event.reply('輸入關鍵字過長或找不到，請重新輸入');
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
                                {
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
                                }
                            ]
                          };
                           content.title=data[i].attractionsname;
                           content.text=data[i].tel;
                           //content.actions.data=data[i].attractionsname
                           //content.thumbnailImageUrl=data[i].picture;

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