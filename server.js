"use strict";

// ---------------- config
// dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
  console.log(req.body);
  res.send("Should now log in user");
});

// handle user registration
// get model
const UserModel = require('./models/user');
app.post('/register', (req, res) =>
{
  console.log(req.body);
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
