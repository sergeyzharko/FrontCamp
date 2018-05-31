import express from 'express';
var http = require('http');
var fs = require('fs');
var logger = require('./config/winston');
var path = require("path");
var errors = require("./errors");
var errorhandler = require('errorhandler');
// var config = require("./config");
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
app.set('port', process.env.PORT || 3000);
// app.set('views', './node/views');
// app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  }));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



require('./routes')(app);

// app.get('/favicon.ico',
//         function(req, res) {
//             res.sendFile(__dirname + '/dist/static/favicon.ico')
//           }
//     );

app.use(express.static(path.join(__dirname + 'static'))); // выдача статического файла
console.log(__dirname);
console.log(path.join(__dirname + 'dist/static'));

app.use(function(req, res) {
    throw new Error("Page Not Found Sorry");
});

app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404)
    err = new errors.HttpError(err);
  }

  if (err instanceof errors.HttpError) {
    // res.render("error", {"error": err});
    logger.error(err);
    err = new errors.HttpError(500);
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      errorhandler()(err, req, res, next);
    } else {
      logger.error(err);
      err = new errors.HttpError(500);
      res.sendHttpError(err);
    }
  }
});

app.use(errors.logErrors);
app.use(errors.clientErrorHandler);
app.use(errors.errorHandler);
app.use(errors.HttpError);