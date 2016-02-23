"use strict";

// ---------------- config
// dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// models
const UserModel = require('./models/user');

// passport
require('./local');

// envrionent variables
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/stockSimulator';

// init app
const app = express();

// set render engine to jade
app.set("view engine", 'jade');

// ---------------  middleware
// body parser config
app.use(bodyParser.urlencoded({extended: false}));

// passport config
// passport.use(new LocalStrategy(function(email,password,done)
// {
//   UserModel.findOne({"email": email}, function(err, singleUser)
//   {
//    if (err) { return done(err); }
//
//    if (!singleUser) {
//      return done(null, false, { message: 'Incorrect username.' });
//    }
//    if (!singleUser.validPassword(password)) {
//      return done(null, false, { message: 'Incorrect password.' });
//    }
//     return done(null, singleUser);
//
//   });
// }));

// --------------- routes
app.get('/', (req, res) =>
{
  res.render('index');
});

app.get('/loggedin', (req, res) =>
{
  res.render('loggedin');
});

// handle user login
app.post('/login',
  passport.authenticate('local',
  { successRedirect: '/',
    failureRedirect: '/loggedin'
  }));

// handle user registration
app.post('/register', (req, res) =>
{
  const user = new UserModel({
    email: req.body.email,
    password: req.body.password
  });

  user.save((err, userObject) =>
  {
    if (err) return err;
      res.send("Should now log in user");
  });

});


//-----------------  connect to mongo and spin up app
mongoose.connect(MONGODB_URL, (err) =>
{
  if (err) throw err;
  app.listen(PORT, () =>
  {
    console.log(`App listening on port ${PORT}`);
  });
});
