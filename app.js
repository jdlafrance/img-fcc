var express = require('express');
var url = require('url');
var request = require('request');
var app = express();

var api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAIHW-z6-3TSlLybd0EJ273YwQxygNr2Ws&cx=017923440884393087821:ospxbccpyeq&searchType=image&q=";

app.get('/', function(req, res, callback){
    var data = null;
    var arr = [];
    var q = url.parse(req.url).query;
    var offset = (/\?(.*)/).exec(q);
    var query = (/(^.*)\?/).exec(q);
    var start = '&start=';
    var startNum = offset[1].substring(7,8)*10+1;
    console.log(query);
    console.log(startNum);
    
    
    request({uri:api+query[1]+start+startNum, json: true}, function(err, res, body){
        if (!err && res.statusCode == 200){
            data = body.items;
            for (var i = 0; i < data.length; i++){
                arr.push({
                    url: data[i].link,
                    snippet: data[i].snippet,
                    thumbnail: data[i].image.thumbnailLink,
                    context: data[i].image.contextLink,
                });
            };
            
            callback();
        };
        
    });
    
    function callback(){
        
      res.send(arr);
    };
    
});

app.listen(8080);

