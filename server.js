"use strict";

// ---------------- config
// dependencies
const express = require('express');
const mongoose = require('mongoose');

// envrionent variables
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/stockSimulator';

// init app
const app = express();

// ---------------  middleware
// set render engine to jade
app.set("view engine", 'jade');


// --------------- routes
app.get('/', (req, res) =>
{
  res.render('index');
});


// connect to mongo and spin up app
mongoose.connect(MONGODB_URL, (err) =>
{
  if (err) throw err;
  app.listen(PORT, () =>
  {
    console.log(`App listening on port ${PORT}`);
  });
});
