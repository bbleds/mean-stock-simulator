"use strict";
const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");

router.get('/api/userdata', (req, res) =>
{
  //query db and send back logged in user information to client
  UserModel.findOne({"_id": req.session.passport.user}, (err, userFound) =>
  {
    if (err) throw err;
      res.json({userId: req.session.passport.user, username: userFound.username});
  });
});

module.exports = router;
