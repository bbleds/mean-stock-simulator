"use strict";
// this controllers servers to save stocks to the db, and add stock ids to the logged in user's "stocks" key

//dependencies
const request = require("request");
const stockItem = require("../models/stockItem");
const singleUser = require("../models/user");

//module exports object
const exportsObject = {};

exportsObject.getStock = (req, res) =>
{
	const company = req.params.company;
	const quantity = req.params.quantity;
	const purchaseStockPrice = req.params.purchaseStockPrice;
	const symbol = req.params.symbol;

	// new instance of stock object
	const stockToBuy = new stockItem(
	{
		"company": company,
		"quantity": quantity,
		"originalStockPrice": purchaseStockPrice,
		"symbol": symbol,
		"dailyStockPrice" : purchaseStockPrice
	});

	// save stock to db and send res
	stockToBuy.save(function (err, objectGiven) {
   			 if (err) return console.error(err);
				 console.log("Object given is");
				 	console.log(objectGiven._id);
					// 	save stock selected to the logged in user
						// get current user object, and update stocks key
						  console.log("User's key is >>>>>>>>>>>>>>>>");
							console.log(req.session.passport.user);
							singleUser.findByIdAndUpdate(req.session.passport.user, {$push: {"stocks": objectGiven._id}}, (err, result) =>
							{
								if (err) throw err;
								res.send({"status":"Purchased Stock Successfully"});
							});

 		 });

};

module.exports = exportsObject;
