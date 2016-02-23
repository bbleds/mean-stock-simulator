"use strict";
// -------------- dependencies
const mongoose = require("mongoose");

const user = mongoose.model("Users", mongoose.Schema({
	email: String,
  password: String
}));


module.exports = user;
