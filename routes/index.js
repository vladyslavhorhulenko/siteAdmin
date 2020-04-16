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
        if(req.isAuthenticated()){
          res.render(process.cwd() + '/views/pug/index.pug', 
          {message: 'Ви увійшли як ', user: req.user.username, auth: true});
        }
        else{
          res.render(process.cwd() + '/views/pug/index.pug', 
          {message: 'Будь ласка, авторизуйтесь якщо ви вже маєте акаунт, або зареєструйтесь.',
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
    
    app.route('/logout')
      .get(function(req, res){
        req.logout();
        res.redirect('/');
    });
  
  return app;
}