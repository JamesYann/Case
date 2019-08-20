//載入request模組
var request =require('request');


//http request module for return phone number
module.exports={phoneFunc(link){
   request(link,function(error,response,body){
        if(!error&&response.statusCode==200){
            callback(err,body);
        }
   })
}};


