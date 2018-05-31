var express = require('express');
var http = require('http');
var path = require("path");

var app = express();
app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.use(express.static(path.join('/static'))); // выдача статического файла

app.use(function(req, res) {
    throw new Error("Page Not Found Sorry");
});