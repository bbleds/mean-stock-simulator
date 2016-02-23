"use strict";
// -------------- dependencies
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	email: String,
  password: String
});

UserSchema.methods.confirmAuth = function (password, cb) {
  // bcrypt.compare(password, this.password, cb);

  if( password === this.password){
    console.log("match");
    cb();
  }

};

const user = mongoose.model("Users", UserSchema);


module.exports = user;
