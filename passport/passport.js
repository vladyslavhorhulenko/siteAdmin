var User = require('../models/user');
const LocalStrategy = require('passport-local');

module.exports = function(passport){
  passport.serializeUser(function(user, done){
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
     User.findById(id, function(err, user){
      console.log('deserializing user:',user);
      done(err, user);
     });
    });
    
  passport.use('local', new LocalStrategy({
            passReqToCallback : true
        }, function(req, username, password, done) {
        User.findOne({ username: username }, function (err, user) {
        console.log('User '+ username +' attempted to log in.');
        if (err) { return done(err); }
        if (!user) { return done(null, false, req.flash('message', 'User Not found.')); }
        if (password !== user.password) { return done(null, false, req.flash('message', 'Invalid password.')); }
        return done(null, user);
      });
    }));
  
  passport.use('signup', new LocalStrategy({
      passReqToCallback: true
  }, function(req, username, password, done){
      if(/^[a-zA-z]{1}[a-zA-Z1-9]{3,20}$/.test(username) === false){
        return done(null, false, req.flash('message', 'Incorrect login'));
      }
       User.findOne({username: username}, function(err, user){
         if(err) {
           console.log(err);
           return done(err, req.flash('message', 'Server error'));
         }
         if(user) {
           console.log(user.username + ' has been already exist');
           return done(null, false, req.flash('message', 'User already exists'));
         }
         else{
           var newUser = new User({
             username: username, 
             password: password,
             firstName: req.body.firstName,
             lastName: req.body.lastName,
             email: req.body.email
           });
           newUser.save(function(err, data){
             if(err){
               console.log(err);
               return done(null, false, req.flash('message', 'Error creating a new user'));
             }
             console.log(newUser.username + ' creating successful');
             return done(null, newUser);
           });
         }
       }); 
    }));
  
  /*passport.use('update', new LocalStrategy({
    passReqToCallback: true
  }, function(req, username, password, done){
      User.findOneAndUpdate({username: username}, 
          {$set: {firstName: req.body.firstName, lastName: req.body.lastName}}, {new: true},
                           function(err, updateUser){
        if(err){
          console.log('Error updating user ' + username);
          done(null, false, req.flash('message', 'Помилка під час редагування профілю'));
        }
        else{
          done(null, updateUser);
        }
      });
  }));*/
}