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

// when user buys stock, remove price of stock from user's available cash, if amount remaining is greater than 0, then complete transaction
const checkCashAmount = (req, res, total, objectGiven) =>
{
		singleUser.findById(req.session.passport.user, (err, foundUser) =>
		{
			if(err) throw err;
			const currentCash = foundUser;
			console.log("current Cash amount is ");
			console.log(foundUser.cash);
			// if users cash remaining will be greater than zero, save
			if(parseInt(foundUser.cash) - parseInt(total) >= 0){
				// update cash

				// add stock to user's stocks key
				saveStockToUser(req, res, objectGiven);

			// if no money is left
			} else {
					res.send({"status":"You dont have enough cash to complete the purchase!"});
			}

		});
};


// ------------ export methods
exportsObject.getStock = (req, res) =>
{
	// if stock does not exist in db, add it to stock items, but if it exists just add the object id to the user
	stockItem.find({"symbol": req.params.symbol.toUpperCase()}, (err, itemFound) =>
	{
		if (err) throw err;

		// if item exists in database
		if(itemFound.length === 1){

			const total = (parseInt(req.params.quantity) * parseInt(req.params.purchaseStockPrice));
			checkCashAmount(req, res, total, itemFound[0]);


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

					const total = (parseInt(req.params.quantity) * parseInt(req.params.purchaseStockPrice));
					checkCashAmount(req, res, total, objectGiven);

				});

		}


	});

};

module.exports = exportsObject;
