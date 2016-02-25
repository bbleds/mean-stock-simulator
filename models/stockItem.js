"use strict";
const mongoose = require("mongoose");

const stockItemSchema = mongoose.model("stockItem", mongoose.Schema({
	company: String,
	quantity: Number,
	dailyStockPrice: Number,
	symbol: String,
	originalStockPrice: Number,
	timestamp: { type: Number, default: Date.now }
}));


module.exports = stockItemSchema;
