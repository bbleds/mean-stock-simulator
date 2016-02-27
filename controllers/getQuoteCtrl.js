"use strict";
//dependencies
const request = require("request");

//module exports object
const exportsObject = {};

exportsObject.getQuoteBySymbol = (req, res) =>
{
	let url = `https://finance.yahoo.com/webservice/v1/symbols/${req.params.symbol}/quote?format=json`;
	request.get(url, (err, response, body )=>
	 {
		 let parsed = JSON.parse(body);
				parsed.list.resources.length === 0 ? res.json({"error": "symbol not found"}) :
     			res.json(parsed);
 	 });
};

module.exports = exportsObject;
