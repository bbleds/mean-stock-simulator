"use strict";
// -------------- dependencies
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const BCRYPT_DIFFICULTY = 10;

const UserSchema = mongoose.Schema({
	email: String,
  password: String,
	username: String,
	stocks: []
});

UserSchema.methods.confirmAuth = function (password, cb) {
  console.log(`running passport middleware`);
  bcrypt.compare(password, this.password, cb);
};

UserSchema.pre('save', function (next) {
  bcrypt.hash(this.password, BCRYPT_DIFFICULTY, (err, hash) => {
    if (err) throw err;

    this.password = hash;
    next();
  });
});

const user = mongoose.model("Users", UserSchema);


module.exports = user;
