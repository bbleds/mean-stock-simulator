"use strict";

// ---------------- config
// dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const User = require('./models/user');
const path = require("path");
const sassMiddleware = require("node-sass-middleware");

// models
const UserModel = require('./models/user');

// routes
const mainRoutes = require("./routes/cumulative");
const apiRoutes = require("./routes/api");

// envrionent variables
const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/stockSimulator';
const SESSION_SECRET = process.env.SESSION_SECRET || "secret";

// init app
const app = express();

// set render engine to jade
app.set("view engine", 'jade');

// ---------------  middleware
// body parser config
app.use(bodyParser.urlencoded({extended: false}));
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
//configure session with redis
app.use(session({
  secret: SESSION_SECRET,
  store: new RedisStore()
}));

//use sass compiler via express
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    //this is whitespace indent rather than curly braces
    indentedSyntax: true,
    debug: true,
    outputStyle: 'compressed'
}));

//use public directory for static files
app.use(express.static(path.join(__dirname, '/public')));

// manual middleware
  //check if user is logged in, and if so, set up local variables unique to user then load content
app.use((req, res, next) => {
  console.log("req is  ");
  console.log(req.session.passport);
  if(req.session.passport){
    console.log("Yas passport is here");
    res.locals.userId = req.session.passport.user;
      // if no res.locals.username, set it
      // SET IT SESSION AND NOT LOCALS?
      console.log("req.session is ");
      console.log(req.session);
    console.log(res.locals);
  } else {
    console.log("passport not here");
  }
  // if user logs in add req.session.loggedInUser = whatever, you can validate against this the rest of the time
    // passport adds req.user on login, and we can access it and modify whatever
    // good idea to stick with the req.session.passport
    // cookie identifies the session, and cookies are unique to session
  req.loggedInUser = req.session.passport;
  next();
});

// --------------- routes
app.use(mainRoutes);
app.use(apiRoutes);
//-----------------  connect to mongo and spin up app
mongoose.connect(MONGODB_URL, (err) =>
{
  if (err) throw err;
  app.listen(PORT, () =>
  {
    console.log(`App listening on port ${PORT}`);
  });
});
