//----------------------------------------
// 載入必要的模組
//----------------------------------------
var linebot = require('linebot');
var express = require('express');

//增加引用函式
const addschedule = require('./utility/addschedule');
//const hotattraction= require('./utility/hotattraction');
const attractions = require('./utility/attractions');
const collect = require('./utility/collect');
const process_userdefined=require('./utility/process'); //命為process_userdefined 因為process是程式保留字

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
    }else if(postback_identifier=='C'){            //如果是C就是加入收藏
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
// 機器人接受回覆的處理
//========================================
bot.on('postback', function(event) { 
    
    const getdata = event.postback.data;
    const groupId = event.source.groupId;
    const userId = event.source.userId;
    const postback_identifier=getdata.substr(getdata.length-1,1);
    const att_id=getdata.substr(0,getdata.length-1);
    
    console.log('******************');

    if(postback_identifier=='P'){   
                       //如果是P就是加入行程
       process_userdefined.addProcess(att_id,groupId,userId).then(data => {  
        if(data == -9){                    
            console.log('執行錯誤');
            event.reply('加入失敗');
        }else{
            console.log('已增加' + data + '筆記錄');
            event.reply('加入成功');
        }  
       })

    }else if(postback_identifier=='C'){ 
                   //如果是C就是加入行程
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
    
});
//========================================


//========================================
// 機器人接受訊息的處理
//========================================

bot.on('message', function(event) {    
        
        event.source.profile().then(
            
            //呼叫API新增計畫表
        
            function (profile) {
               
                
                //取得使用者資料
                const userName = profile.displayName;
                const userId = profile.userId;
                const groupId=profile.groupId;

                
                const no = event.message.text; //使用者傳來的訊息
                const schedule=no.substr(0,3); //取得指令計畫表
                const schedule_name=no.substr(4,no.length-1); //取得計畫表名稱

                if (event.message.type==('text')){

                    console.log(schedule);
                    console.log(schedule_name);

                    if(schedule == '計畫表'){  //建立計畫表
                        
                        addschedule.addschedule(schedule_name,groupId).then(data => {  
                            
                            if(data == -9){
            
                                event.reply('執行錯誤');
            
                            }else {
                                event.reply([
                                    {
                                        "type": "text",
                                        "text": '新增計畫表成功'
                                    },
                                    {
                                        "type": "text",
                                        "text": '請到網頁確認是否有建立成功'
                                    },
                                    {
                                        "type": "sticker",
                                        "packageId": "1",   //packageId可輸入1~4
                                        "stickerId": "2"
                                    }
                                ]);	     
                               
                            
                            }
                        })    
                    }else if(no == '熱門'){  //尋找熱門景點     
                        
                        
                    }else if(no == '測試'){

                        for(i=0;i<data.length;i++){

                        
                            var content={

                                "type": "flex",
                                "altText": "Q1. Which is the API to create chatbot?",
                                "contents": {
                                "type": "bubble",
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "md",
                                    "contents": [
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                        {
                                            "type": "text",
                                            "text": "Q1",
                                            "align": "center",
                                            "size": "xxl",
                                            "weight": "bold"
                                        },
                                        {
                                            "type": "text",
                                            "text": "Which is the API to create chatbot?",
                                            "wrap": true,
                                            "weight": "bold",
                                            "margin": "lg"
                                        }
                                        ]
                                    },
                                    {
                                        "type": "separator"
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "margin": "lg",
                                        "contents": [
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "contents": [
                                            {
                                                "type": "text",
                                                "text": "1.",
                                                "flex": 1,
                                                "size": "lg",
                                                "weight": "bold",
                                                "color": "#666666"
                                            },
                                            {
                                                "type": "text",
                                                "text": "Login API",
                                                "wrap": true,
                                                "flex": 9
                                            }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "contents": [
                                            {
                                                "type": "text",
                                                "text": "2.",
                                                "flex": 1,
                                                "size": "lg",
                                                "weight": "bold",
                                                "color": "#666666"
                                            },
                                            {
                                                "type": "text",
                                                "text": "Messaging API",
                                                "wrap": true,
                                                "flex": 9
                                            }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "contents": [
                                            {
                                                "type": "text",
                                                "text": "3.",
                                                "flex": 1,
                                                "size": "lg",
                                                "weight": "bold",
                                                "color": "#666666"
                                            },
                                            {
                                                "type": "text",
                                                "text": "Graph API",
                                                "wrap": true,
                                                "flex": 9
                                            }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "layout": "baseline",
                                            "contents": [
                                            {
                                                "type": "text",
                                                "text": "4.",
                                                "flex": 1,
                                                "size": "lg",
                                                "weight": "bold",
                                                "color": "#666666"
                                            },
                                            {
                                                "type": "text",
                                                "text": "Cartoon API",
                                                "wrap": true,
                                                "flex": 9
                                            }
                                            ]
                                        }
                                        ]
                                    }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "spacing": "sm",
                                    "contents": [
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "height": "sm",
                                        "action": {
                                        "type": "message",
                                        "label": "1",
                                        "text": "Login API"
                                        }
                                    },
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "height": "sm",
                                        "action": {
                                        "type": "message",
                                        "label": "2",
                                        "text": "Messaging API"
                                        }
                                    },
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "height": "sm",
                                        "action": {
                                        "type": "message",
                                        "label": "3",
                                        "text": "Graph API"
                                        }
                                    },
                                    {
                                        "type": "button",
                                        "style": "primary",
                                        "height": "sm",
                                        "action": {
                                        "type": "message",
                                        "label": "4",
                                        "text": "Cartoon API"
                                        }
                                    }
                                    ]
                                }
                                }
                            }
                        }

                        //flex message
                        /*
                        content.altText=
                        
                        */
                        event.reply([])
                        
                    }else if(no == '選單'){  //泡泡選單(quick reply)
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
                                      "type": "message",
                                      "label": "附近景點",
                                      "text": "附近景點"
                                    }
                                  }
                              ]
                            }
                          }
                        ])
                    }else if(no == '看收藏'){  //開啟收藏網站 

                        event.reply({
                            "type": "template",
                            "altText": "收藏頁面",
                            "template": {
                              "type": "buttons",
                              "text": "收藏畫面",
                              "actions": [
                                {
                                  "type": "uri",
                                  "label": "開啟收藏",
                                  "uri": "https://node-express-browser.herokuapp.com/collect",
                                  "data": groupId
                                }
                              ]
                            }
                        });

                    }else if(no == '附近'){  //附近景點

                    }else if(no == '看行程'){  //開啟行程網站

                        event.reply({
                            "type": "template",
                            "altText": "行程頁面",
                            "template": {
                              "type": "buttons",
                              "text": "行程畫面",
                              "actions": [
                                {
                                  "type": "uri",
                                  "label": "開啟行程",
                                  "uri": "https://node-express-browser.herokuapp.com/process",
                                  "data": groupId
                                }
                              ]
                            }
                        });

                    }else{

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
                    
                }
            
            }
        );
});
//========================================ㄡ


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