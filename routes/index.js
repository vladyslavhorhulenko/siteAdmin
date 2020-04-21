const express = require('express');
const app = express();


function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');
    };

function ensureAdmin(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.isAdmin){
      return next();
    }
    else{
      res.redirect('/');
    }
  }
  res.redirect('/');
}

module.exports = function(passport){

var findAllTopics = require('../db/dbFunctions').findAllTopics;
app.route('/')
      .get(async(req, res) => {
        var topics;
        await findAllTopics(async function(err, data){
          if(err) return console.log(err);
          if(!data) {
            return console.log('Missing `done()` argument');
          }
          topics = data;
          });
        if(topics == null){
          res.redirect('/');
        }
        if(req.isAuthenticated()){
            res.render(process.cwd() + '/views/pug/index.pug', 
            {topics: topics, message: 'Ви увійшли як ', user: req.user.username, auth: true, isAdmin: req.user.isAdmin});
          }
        else{
          res.render(process.cwd() + '/views/pug/index.pug', 
          {topics: topics, message: 'Будь ласка, авторизуйтесь якщо ви вже маєте акаунт, або зареєструйтесь.',
          notAuth: true});
        }
        
      });
    
    app.route('/login')
      .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}), 
        function(req, res){
          res.redirect('/profile');
        } 
      )
      .get(function(req, res){
        res.render(process.cwd() + '/views/pug/login.pug', {flash: req.flash('message')});
    });
  
    app.route('/signup')
      .post(passport.authenticate('signup', {failureRedirect: '/signup', failureFlash: true}),
        function(req, res){
          res.redirect('/profile');
      }    
    )
    .get(function(req, res){
      res.render(process.cwd() + '/views/pug/signup.pug', {flash: req.flash('message')});
    });
    
    app.route('/profile')
      .get(ensureAuthenticated, function(req, res){
        res.render(process.cwd() + '/views/pug/profile.pug', 
                   {username: req.user.username, 
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    flash: req.flash('message')});
      });
  
    /*app.route('/update')
      .get(ensureAuthenticated, function(req, res){
        res.render(process.cwd() + '/views/pug/update.pug',
                    {username: req.user.username, 
                    firstName: req.user.firstName,
                    lastName: req.user.lastName});
      })
      .post(passport.authenticate('update', {failureRedirect: '/', failureFlash: true}),
           function(req, res){
              res.redirect('/profile');
    });*/
  
    var createTopic = require('../db/dbFunctions').createTopic;
    app.route('/addtopic')
      .get(ensureAdmin, function(req, res){
        res.render(process.cwd() + '/views/pug/addtopic.pug');
    })
    .post(function(req, res, next){
      var date = new Date();
      var month = date.getUTCMonth() + 1;
      createTopic({
        title: req.body.title,
        text: req.body.text,
        author: req.user.firstName + ' ' + req.user.lastName,
        date: new Date()
      }, function(err, data){
          if(err) return next(err);
          if(!data) {
            console.log('Missing `done()` argument');
            return next({message: 'Missing callback argument'});
          }
      });
      res.redirect('/');
    });
  
    var findTopicById = require('../db/dbFunctions').findTopicById;
    app.route('/topic/:id')
      .get(async function(req, res){
        var topic;
        await findTopicById(req.params.id, async function(err, data){
          if(err) return console.log(err);
          if(!data) {
            return console.log('Missing `done()` argument');
          }
          topic = data[0];
          
        });
        if(topic == null){
          res.redirect('/topic/:id');
        }
        //console.log(topic);
        res.render(process.cwd() + '/views/pug/topic.pug', {topic: topic});
    });
  
    app.route('/logout')
      .get(function(req, res){
        req.logout();
        res.redirect('/');
    });
  
  return app;
}