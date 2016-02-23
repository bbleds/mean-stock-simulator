"use strict";

// dependencies
const express = require('express');

// envrionent variables
const PORT = process.env.PORT || 3000;

// set up app
const app = express();


app.get('/', (req, res) =>
{
  res.send('Connected');
});


// spin up app
app.listen(PORT, () =>
{
  console.log(`App listening on port ${PORT}`);
});
