const express = require('express');
const app = express();


function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');
    };

module.exports = function(passport){

app.route('/')
      .get((req, res) => {
        res.render(process.cwd() + '/views/pug/index.pug', 
          {title: 'Hello', message: 'Please login', showLogin: true, flash: req.flash('message')});
      });
    
    app.route('/login')
      .post(passport.authenticate('local', { failureRedirect: '/', failureFlash: true}), 
        function(req, res){
          res.redirect('/profile');
        } 
      );
    
    app.route('/profile')
      .get(ensureAuthenticated, function(req, res){
        res.render(process.cwd() + '/views/pug/profile.pug', {username: req.user.username});
    });
    
    app.route('/logout')
      .get(function(req, res){
        req.logout();
        res.redirect('/');
    });
  
  return app;
}