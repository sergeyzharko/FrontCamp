var express = require('express');
var http = require('http');
// var articles = require('./articles');
var bodyParser = require('body-parser');
var fs = require('fs');
var logger = require('./config/winston');
var mongoose = require('mongoose');
var path = require("path");
var errors = require("./errors");
var errorhandler = require('errorhandler');
var config = require("./config");



mongoose.connect('mongodb://127.0.0.1/blogs');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log('Database has been connected!') });

var Schema = mongoose.Schema;

var blogSchema = new Schema({
  id: Number,
	title: String,
	author: String,
	body: { type: String, required: [true, 'Where is the body?']},
	date: { type: Date, default: Date.now }
});

var Article = db.model('Article', blogSchema); // коллекция articles

var userSchema = new Schema({
  username: String,
  password: String
});

var User = db.model('User', userSchema);

// let articles = [{ id: 1, name: 'Article', body: 'Hello' }];

var app = express();
app.set('port', 3000);
app.set('views', './node/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Middleware

// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/',function(req,res){ 
  // res.sendFile(path.join(__dirname+'/html/index.html'));
// });

require('./routes')(app, Article);

app.use(express.static(path.join(__dirname, 'html'))); // выдача статического файла

app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404)
    err = new errors.HttpError(err);
  }

  if (err instanceof errors.HttpError) {
    res.render("error", {"error": err});
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