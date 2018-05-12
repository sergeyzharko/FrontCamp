var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var HttpError = require("../errors").HttpError;
// var ReactDOMServer = require("react-dom/server");
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../../client/App';
import Html from '../../client/Html';
import Login from '../../client/Login';
import Registration from '../../client/Registration';
import Blogs from '../../client/Blogs';
import { ServerStyleSheet } from 'styled-components';
const path = require('path');
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('../models/User');
var Article = require('../models/Article');
var auth = require("../controllers/AuthController.js");

module.exports = function(app) {

    mongoose.connect('mongodb://127.0.0.1/blogs');

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() { console.log('Database has been connected!') });


    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser()); // сохранить данные в сессию
    passport.deserializeUser(User.deserializeUser()); // достать данные из сессии


    var mustAuthenticatedMw = function (req, res, next){
        console.log(req.isAuthenticated());
        req.isAuthenticated()
          ? next()
          : res.redirect('/login');
    };

    // app.all('/blogs', mustAuthenticatedMw);
    // app.all('/blogs/*', mustAuthenticatedMw);
    // app.all('/users', mustAuthenticatedMw);
    // app.all('/users/*', mustAuthenticatedMw);

    app.get('/', function(req, res, next) {

        const sheet = new ServerStyleSheet(); // <-- creating out stylesheet

        const body = renderToString(sheet.collectStyles(<App />)); // <-- collecting styles
        const styles = sheet.getStyleTags(); // <-- getting all the tags from the sheet
        const title = 'Server side Rendering with Styled Components';

        res.send(
            Html({
            body,
            styles, // <-- passing the styles to our Html template
            title
            })
        );


        // res.render('main.ejs', {
        // title: 'Hello'
        // });

    });
    
    app.get('/login',function(req,res){ 

        const sheet = new ServerStyleSheet(); // <-- creating out stylesheet

        const body = renderToString(sheet.collectStyles(<Login />)); // <-- collecting styles
        const styles = sheet.getStyleTags(); // <-- getting all the tags from the sheet
        const title = 'Server side Rendering with Styled Components';

        res.send(
            Html({
            body,
            styles, // <-- passing the styles to our Html template
            title
            })
        );

        // res.sendFile(path.join(__dirname+'/html/login.html'));
    });
    
    app.post('/login',
        function(req, res) {
            passport.authenticate('local')(req, res, function () {
              res.redirect('/blogs');
            });
          }
    );

    app.get('/blogs',
    // protect endpoint with bearer strategy
    
        function (req, res, next) {
            Article.find(function (err, blogs) {
                if (err) return console.error(err);
                // res.json(blogs);

                const sheet = new ServerStyleSheet(); // <-- creating out stylesheet

                const body = renderToString(sheet.collectStyles(<Blogs />)); // <-- collecting styles
                const styles = sheet.getStyleTags(); // <-- getting all the tags from the sheet
                const title = 'Blogs';
        
                res.send(
                    Html({
                    body,
                    styles, // <-- passing the styles to our Html template
                    title
                    })
                );


            })
        });

    app.get('/logout',
        function (req, res, next) {
            req.logout();
            res.redirect('/');
        }
    );

    app.get('/users',
    // protect endpoint with bearer strategy
    
        function (req, res, next) {
        User.find(function (err, users) {
            if (err) return console.error(err);
            res.json(users);
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

    app.get('/registration', function (req, res) {

        const sheet = new ServerStyleSheet(); // <-- creating out stylesheet

        const body = renderToString(sheet.collectStyles(<Registration />)); // <-- collecting styles
        const styles = sheet.getStyleTags(); // <-- getting all the tags from the sheet
        const title = 'Server side Rendering with Styled Components';

        res.send(
            Html({
            body,
            styles, // <-- passing the styles to our Html template
            title
            })
        );

        // res.sendFile(path.join(__dirname+'/html/login.html'));
    });
    
    app.post('/registration', function (req, res) {
        const user = req.body;

            var newUser = new User({
                username : user.username
            });
        
            User.register(newUser, user.password, function(err, user) {
                if (err) {
                    // handle the error
                }
                passport.authenticate("local")(req, res, function() {
                    res.redirect('/blogs');
                });
            });

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
    






}