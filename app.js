var express = require('express');
var url = require('url');
var app = express();
var KEY = 'AIzaSyAIHW-z6-3TSlLybd0EJ273YwQxygNr2Ws'
var api = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAIHW-z6-3TSlLybd0EJ273YwQxygNr2Ws&cx=017923440884393087821:ospxbccpyeq&q=";

app.get('/', function(req, res){
    var q = url.parse(req.url).query;
    res.redirect(api+q);
});

app.listen(8080);

