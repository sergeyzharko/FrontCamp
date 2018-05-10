var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var HttpError = require("../errors").HttpError;
// var ReactDOMServer = require("react-dom/server");
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../client/App';
import Html from '../client/Html';

module.exports = function(app, Article) {

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

    app.get('/', function(req, res, next) {

        const body = renderToString(<App />);
        const title = 'Server side Rendering with Styled Components';

        res.send(
            Html({
            body,
            title
            })
        );


        // res.render('main.ejs', {
        // title: 'Hello'
        // });

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
        Article.find(function (err, blogs) {
            if (err) return console.error(err);
            res.json(blogs);
        })
    });
    
    
    app.get('/blogs/:id',
    // protect endpoint with bearer strategy
        function (req, res, next) {

        if (isNaN(req.params.id)) return next(new HttpError(404, 'Is not a number'));
    
        // let num = req.query['id'];
        // http://localhost:3000/blogs/?id=0
    
        // http://localhost:3000/blogs/0
            Article.find({ id: req.params.id }, function (err, blog) {
                if (err) return next(err);
                if (blog == '[]') {
                    next(new HttpError(404, "User not found"));
                }
                console.log(blog);
                res.json(blog);
            })
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

}