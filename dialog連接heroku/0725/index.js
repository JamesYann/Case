"use strict";

const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const app = express()

app.post('/dialogflow', express.json(), (req, res) => {
    //------------------------------------
    // 處理請求/回覆的Dialogflow代理人
    //------------------------------------  
    const agent = new WebhookClient({request: req, response: res})


    //------------------------------------
    // 處理歡迎意圖
    //------------------------------------     
    function welcome(){
        agent.add('歡迎你!!!');
    }

    //------------------------------------
    // 設定對話中各個意圖的函式對照
    //------------------------------------
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    agent.handleRequest(intentMap);
})


//----------------------------------------
// 監聽3000埠號, 
// 或是監聽Heroku設定的埠號
//----------------------------------------
var server = app.listen(process.env.PORT || 3000, function() {
    const port = server.address().port;
    console.log("正在監聽埠號:", port);
});