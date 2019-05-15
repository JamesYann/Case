//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const attractions = require('./utility/attractions');

//----------------------------------------
// 填入自己在Line Developers的channel值
//----------------------------------------
var bot = linebot({
    channelId: '1553084193',
    channelSecret: 'd7e331625754a77d83c52244205cd183',
    channelAccessToken: 'uLPpZhk0QCLOj0PDGSaj3jDyHgjwhF4aUDWaKlncFSSrupNiKu4d8etQO96nHqHsU0LtSkcZN7OemxrckmFc04jepHrOFNyi1bNkcVBCNVWkaajmMrVFVHGGJeZwp7DMK/Nqdg/4f2fAA2LBilWSJQdB04t89/1O/w1cDnyilFU='
});

//========================================
// 機器人接受回覆的處理
//========================================
bot.on('postback', function(event) { 
    const att_id = event.postback.data;
    const data = event.postback.data;
    const userId = event.source.userId;

    //增加引用函式
    const attractions = require('./utility/attractions');
    console.log('******************');
    attractions.addCollection('3', att_id, 'G1').then(data => {  
        if(data == -9){                    
            console.log('執行錯誤');
        }else{
            console.log('已增加' + data + '筆記錄');
        }  
    })

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
	    
            //使用者傳來的景點編號
            const no = event.message.text;
          
            //呼叫API取得景點資料
            attractions.fetchattractions(no).then(data => {  
                if (data == -1){
                    event.reply('找不到資料');
                }else if(data == -9){                    
                    event.reply('執行錯誤');
                }else{
                    event.reply({
                        "type": "template",
                        "altText": "這是一個輪播樣板",
                        "template": {
                            "type": "carousel",
                            "columns": [
                                {
                                  "thumbnailImageUrl": "https://yvonne-app-1.herokuapp.com/imgs/p01.jpg",
                                  "imageBackgroundColor": "#FFFFFF",
                                  "title": data.attractionsname,
                                  "text": data.address,
                                  "defaultAction": {
                                      "type": "uri",
                                      "label": "詳細資料",
                                      "uri": "https://zh.wikipedia.org/wiki/星夜"
                                  },
                                  "actions": [
                                      {
                                          "type": "postback",
                                          "label": "收藏",
                                          "data": data.att_id

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
                                },
                                {
                                  "thumbnailImageUrl": "https://yvonne-app-1.herokuapp.com/imgs/p02.jpg",
                                  "imageBackgroundColor": "#000000",
                                  "title": data.attractionsname,
                                  "text": data.tel,
                                  "defaultAction": {
                                      "type": "uri",
                                      "label": "詳細資料",
                                      "uri": "https://zh.wikipedia.org/wiki/向日葵_(梵高)"
                                  },
                                  "actions": [
                                    {
                                        "type": "postback",
                                        "label": "收藏",
                                        "data": "action=buy&itemid=222"
                                    },
                                    {
                                        "type": "postback",
                                        "label": "加入行程",
                                        "data": "action=add&itemid=222"
                                    },
                                      {
                                          "type": "uri",
                                          "label": "詳細資料",
                                          "uri": "https://zh.wikipedia.org/wiki/向日葵_(梵高)"
                                      }
                                  ]
                                }
                            ],
                            "imageAspectRatio": "rectangle",
                            "imageSize": "cover"
                        }
                    });  
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
