"use strict";

// ---------------- config
// dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// models
const UserModel = require('./models/user');

// envrionent variables
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/stockSimulator';

// init app
const app = express();

// set render engine to jade
app.set("view engine", 'jade');

// ---------------  middleware
app.use(bodyParser.urlencoded({extended: false}));

// --------------- routes
app.get('/', (req, res) =>
{
  res.render('index');
});

// handle user login
app.post('/login', (req, res) =>
{
  const user = UserModel.findOne({"email":req.body.email}, (err, singleUser) =>
  {
    console.log(singleUser);
    req.body.password === singleUser.password ? res.send("congrats you match") : res.send("ooooo sorry, thats wrong");

  });
});

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
