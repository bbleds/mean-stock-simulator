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

				 let stockExists = false;

					// 	save stock selected to the logged in user
						//if stock already exists, send message that it already exists
							singleUser.findById(req.session.passport.user, (err, foundUser) =>
							{
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

 		 });

};

module.exports = exportsObject;
