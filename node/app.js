var express = require('express');
var http = require('http');
var articles = require('./articles');

// let articles = [{ id: 1, name: 'Article', body: 'Hello' }];

var app = express();
app.set('port', 3000);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Middleware

app.use(function(req, res, next) {
  if (req.url == '/blogs') {
    res.end(JSON.stringify(articles));
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if (req.url == '/forbidden') {
    next(new Error("wops, denied"));
  } else {
    next();
  }
});

app.use(function(req, res, next) {
  if (req.url == '/test') {
    res.end("Test");
  } else {
    next();
  }
});

app.use(function(req, res) {
//  res.writeHead(404, {'Content-Type': 'text/html'});
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');  
  res.status(404).send("Page Not Found Sorry");
});