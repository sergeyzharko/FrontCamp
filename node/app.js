var express = require('express');
var http = require('http');
var articles = require('./articles');
var bodyParser = require('body-parser');
var fs = require('fs');
var logger = require('./config/winston');

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

app.get('/blogs', function (req, res, next) {
  let num = req.query['id'];
  if (num) {
    // http://localhost:3000/blogs/?id=0
    console.log(num);
    // res.end(JSON.stringify(articles[num]));
    res.json(articles[num]);
  } else {
    logger.info('blogs');
    // res.end(JSON.stringify(articles));
    res.json(articles);
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
})

app.post('/blogs', function (req, res) {
  const blogs = req.body;
  
  // articles.push(JSON.parse(blogs));
  articles.push(blogs);
  console.log(JSON.stringify(articles));
  fs.truncate("./node/articles.json", 0, function() {
    fs.writeFile("./node/articles.json", JSON.stringify(articles), function (err) {
        if (err) {
            return console.log("Error writing file: " + err);
        }
        res.status(204).send();
        console.log('Done');
    });
  });
});

app.put('/blogs', function (req, res) {
  const blogs = req.body;
  let num = req.query['id'];
  
  articles[num] = blogs;
  console.log(JSON.stringify(articles));
  fs.truncate("./node/articles.json", 0, function() {
    fs.writeFile("./node/articles.json", JSON.stringify(articles), function (err) {
        if (err) {
            return console.log("Error writing file: " + err);
        }
        res.status(204).send();
        console.log('Done');
    });
  });
});

app.delete('/blogs', function (req, res) {
  let num = req.query['id'];
  test.splice(test.indexOf(num), 1);
  console.log(JSON.stringify(articles));
  fs.truncate("./node/articles.json", 0, function() {
    fs.writeFile("./node/articles.json", JSON.stringify(articles), function (err) {
        if (err) {
            return console.log("Error writing file: " + err);
        }
        res.status(204).send();
        console.log('Done');
    });
  });
});

app.use(function(req, res) {
  throw new Error("Page Not Found Sorry");
});



app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //  res.writeHead(404, {'Content-Type': 'text/html'});
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  //res.status(404).send("Page Not Found Sorry");
  res.status(err.status || 404);
  res.render('error', { title: 'Error', message: err.message });
});