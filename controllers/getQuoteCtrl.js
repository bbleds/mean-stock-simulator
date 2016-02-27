"use strict";
//dependencies
const request = require("request");

//module exports object
const exportsObject = {};

exportsObject.getQuoteBySymbol = (req, res) =>
{
	let url = `http:/\/dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${req.params.symbol}`;
	// let url = `https://finance.yahoo.com/webservice/v1/symbols/${req.params.symbol}/quote?format=json`;
	request.get(url, (err, response, body )=>
	 {
		 	console.log();
	 			let parsed = JSON.parse(body);
     			res.json(parsed);
 	 });
};

module.exports = exportsObject;
