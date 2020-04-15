'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const app = express();


app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true,
}));

mongoose.connect('mongodb+srv://vlad:465596mn@test-72zlo.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true },
                 function(err, db){
  if(err) 
    console.log(err);
  else{
    console.log('Successful');
  
    app.use(passport.initialize());
    app.use(passport.session());
    
    app.use(flash());
    
    var myPassport = require('./passport/passport.js');
    myPassport(passport);
    
    var routes = require('./routes/index.js')(passport);
    
    app.use('/', routes);

    app.use(function(req, res, next){
      res.status(404).type('text').send('Not found');
    });

    var port = 3000;
    app.listen(port, () => {
      console.log("Listening on port " + port);
    });
}});

module.exports = app;
   


