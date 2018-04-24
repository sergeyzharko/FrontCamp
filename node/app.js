var express = require('express');
var http = require('http');
// var articles = require('./articles');
var bodyParser = require('body-parser');
var fs = require('fs');
var logger = require('./config/winston');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require("path");

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
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Middleware

// app.use(passport.initialize());
// app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user); // добавится в запрос, параметр user
    });
  }
));

app.get('/',function(req,res){ 
  res.sendFile(path.join(__dirname+'/html/index.html'));
});

app.get('/login',function(req,res){ 
  res.sendFile(path.join(__dirname+'/html/login.html'));
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/blogs',
                                   failureRedirect: '/login',
                                   session: false })
);

app.get('/blogs',
// protect endpoint with bearer strategy
  function (req, res, next) {

  app.get('/blogs', function (req, res) {
    Article.find(function (err, blogs) {
      if (err) return console.error(err);
      console.log(blogs);
    })
  })

  let num = req.query['id'];
  if (num) {
    // http://localhost:3000/blogs/?id=0
    
    // res.json(articles[num]);

    Article.find({ id: num }, function (err, blogs) {
      if (err) return console.error(err);
      res.json(blogs);
    })

  } else {
    logger.info('blogs');
    
    // res.json(articles);

    Article.find(function (err, blogs) {
      if (err) return console.error(err);
      res.json(blogs);
    })

  }
});

// app.use(function(req, res, next) {
//   if (req.url == '/blogs') {
//     console.log('blogs');
//     res.end(JSON.stringify(articles));
//   } else {
//     next();
//   }
// });

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

app.get('/view', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

app.post('/registration', function (req, res) {
  const user = req.body;
  var newUser = new User(user);
  newUser.save(function (err, user) {
    if (err) return console.error("Error writing: " + err);
    // next(new Error("Error writing: " + err)); // Express regards the current request as being an error
  });
  res.status(204).send();
  console.log('New user');

});

app.post('/blogs', function (req, res) {
  const blogs = req.body;

  // articles.push(blogs);
  // console.log(JSON.stringify(articles));
  // fs.truncate("./node/articles.json", 0, function() {
  //   fs.writeFile("./node/articles.json", JSON.stringify(articles), function (err) {
  //       if (err) {
  //           return console.log("Error writing file: " + err);
  //       }
  //       res.status(204).send();
  //       console.log('Done');
  //   });
  // });


  var article = new Article(blogs);
  article.save(function (err, article) {
    if (err) return console.error("Error writing: " + err);
    next(new Error("Error writing: " + err)); // Express regards the current request as being an error
  });
  res.status(204).send();
  console.log('Done');

});

app.put('/blogs', function (req, res) {
  const blogs = req.body;
  let num = req.query['id'];
  
  // articles[num] = blogs;
  // console.log(JSON.stringify(articles));
  // fs.truncate("./node/articles.json", 0, function() {
  //   fs.writeFile("./node/articles.json", JSON.stringify(articles), function (err) {
  //       if (err) {
  //           return console.log("Error writing file: " + err);
  //       }
  //       res.status(204).send();
  //       console.log('Done');
  //   });
  // });

  var article = new Article(blogs);
  var submission = {};
  submission.id = article.id;
  submission.title = article.title;
  submission.author = article.author;
  submission.body = article.body;
  submission.date = article.date;
  Article.findOneAndUpdate({ id: num }, submission, function (err, article) {
    if (err) return console.error(err);
  });

});

app.delete('/blogs', function (req, res) {
  let num = req.query['id'];

  // test.splice(test.indexOf(num), 1);
  // console.log(JSON.stringify(articles));
  // fs.truncate("./node/articles.json", 0, function() {
  //   fs.writeFile("./node/articles.json", JSON.stringify(articles), function (err) {
  //       if (err) {
  //           return console.log("Error writing file: " + err);
  //       }
  //       res.status(204).send();
  //       console.log('Done');
  //   });
  // });

  Article.findOneAndRemove({ id: num },
    function (err) {
      if (err) throw err;
      console.log('User deleted!');
    }
  )

});

app.use(function(req, res) {
  throw new Error("Page Not Found Sorry");
});

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors (err, req, res, next) {
  console.error(err.stack);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  next(err);
};

function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(err.status || 404);
    res.send({ error: 'Something failed!' })
  } else {
    next(err)
  }
};

function errorHandler (err, req, res, next) {
  res.status(err.status || 404);
  res.render('error', { title: 'Error', message: err.message });
};