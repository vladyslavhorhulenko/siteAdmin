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
    
  passport.use(new LocalStrategy({
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
}