"use strict";

// this controller serves to save stocks to the db, and add stock ids to the logged in user's "stocks" key

//------------ dependencies
// modules
const request = require("request");
// models
const stockItem = require("../models/stockItem");
const singleUser = require("../models/user");

//------------- module exports object
const exportsObject = {};

//------------- private functions
 // 	save stock selected to the logged in user
	//if user already purchased this stock, send message that it already exists
const saveStockToUser = (req, res, objectGiven) =>
{
	singleUser.findById(req.session.passport.user, (err, foundUser) =>
	{
		let stockExists = false;

		if (err) throw err;
		// check and see if smybol of stock already exists in user's "stocks" key
		foundUser.stocks.map((item, index) =>
		{
			item.symbol === objectGiven.symbol ? stockExists = true : console.log("it is a new stock");
		});

		if(!stockExists)
		{
			//else  get current user object, and update stocks key
			singleUser.findByIdAndUpdate(req.session.passport.user, {$push: {"stocks": { "symbol" : objectGiven.symbol, "stockId" :objectGiven._id}}}, (err, result) =>
			{
				if (err) throw err;
				res.send({"status":"Purchased Stock Successfully"});
			});
		} else
		{
			res.send({"status":"You have already purchased this stock, check out your portfolio to buy more!"});
		}

	});
};


// ------------ export methods
exportsObject.getStock = (req, res) =>
{
	// if stock does not exist in db, add it to stock items, but if it exists just add the object id to the user
	stockItem.find({"symbol": req.params.symbol.toLowerCase()}, (err, itemFound) =>
	{
		if (err) throw err;
		console.log("Item found is >>>>>>>>>>>>>>>>>>>>");
		console.log(itemFound);
		console.log("item found .length is ");
		console.log(itemFound.length);

		// if item exists in database
		if(itemFound.length === 1){

			saveStockToUser(req, res, itemFound[0]);

		// if item is not in database
		} else {

			const company = req.params.company;
			const quantity = req.params.quantity;
			const purchaseStockPrice = req.params.purchaseStockPrice;
			const symbol = req.params.symbol.toUpperCase();

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

						saveStockToUser(req, res, objectGiven);

				});

		}


	});

};

module.exports = exportsObject;
