var express = require('express');
var mongo = require('mongodb').MongoClient;
var url = require('url');
var request = require('request');
var app = express();

var api = "https://www.googleapis.com/customsearch/v1?key="+process.env.MONGOO+"&cx="+process.env.CX+"&searchType=image&q=";

app.get('/', function(req, res, callback){
    var URL = process.env.MONGOLAB;
    var data = null;
    var arr = [];
    var q = url.parse(req.url).query;
    var offset = (/\?(.*)/).exec(q);
    var query = (/(^.*)\?/).exec(q);
    var start = '&start=';
    var startNum = offset[1].substring(7,8)*10+1;
    
    mongo.connect(URL, function(err, db){
       if (err) return;
       var collection = db.collection('img');
    collection.insert({term: query, when: new Date()});
        db.close();
        
    });
    
    
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
            }
            
            callback();
        }
        
    });
    
    function callback(){
        
      res.send(arr);
    };
    
});

app.get('/latest', function(req, res){
    var URL = process.env.MONGOLAB;
    var arr = [];
    mongo.connect(URL, function(err, db){
       if (err) return;
       var collection = db.collection('img');
       collection.find().toArray(function(err, docs){
          if (err) return;
          for (var i = 0; i < docs.length; i++){
              arr.push({
                 term: docs[i].term[1], when: docs[i].when 
              });
          };
          res.send(arr);
          db.close();
       });
    });
});


app.listen(process.env.PORT);

