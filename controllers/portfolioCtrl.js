"use strict";
//-------------- dependencies
// modules
const request = require("request");
const _ = require("lodash");

			// mongo tests
			var MongoClient = require('mongodb').MongoClient;
			var ObjectId = require('mongodb').ObjectID;
			var url = 'mongodb://localhost:27017/stockSimulator';

// mongoose models
const stockItem = require("../models/stockItem");
const singleUser = require("../models/user");

//--------------- module exports object
const exportsObject = {};

// -------------- private functions
//respond with all stocks that match userid if no error
const filterStocksByUserId = (req, res, stock) =>
{
	// array that server will send to client as client-selected stocks
	const filteredStockArray = [];

	singleUser.findById(req.session.passport.user, (err, userfound) =>
	{
		if (err) throw err;

		// filter stocks by the ids found on the user's stocks
		userfound.stocks.map((item, index) =>
		{
			_.filter(stock, (stockItem) =>
			{
				// if item id matches stock item id push into filteredresobject
				if(item.stockId.toString() === stockItem._id.toString()){
					// set the quanitity of the stock to be the quanitity specified in the user's stocks key
					stockItem.quantity = item.quantity;
					// push filtered stock into array to be given to client
					filteredStockArray.push(stockItem);
				}
			});
		});
			res.json(filteredStockArray);
	});
};



// -------------- export methods
exportsObject.getAllStock = (req, res) =>
{
	//query db for all stocks items
	stockItem.find({}, (err, stock)=>
	{
		if (err) throw err;

		// time on stocks converted to minutes
		const timeOnStocks = Math.floor((stock[0].timestamp/1000)/60);
		// current time converted to minutes
		const currentTime = Math.floor((new Date().getTime()/1000)/60);

		//if price data is older than 15 mins, update price data for each item in db and then finish with function below
		if((timeOnStocks+15) < currentTime)
		{
			console.log("it has been 15 mins you should query for new data");

			//loop through each stock and update price for each
			stock.map((item, index) =>
			{

				let url = `https://finance.yahoo.com/webservice/v1/symbols/${item.symbol}/quote?format=json`;
				request.get(url, (err, response, body )=>
				{
					if(err) throw err;


					//parse data from api and store current price from api in variable
					const data = JSON.parse(body);


					//update db with updated price
					let updatedPrice = data.list.resources[0].resource.fields.price;

					console.log("last LastPrice is "+ updatedPrice);
					let newTimestamp = new Date().getTime();

					// update price and timestamp
					stockItem.findByIdAndUpdate(item._id, { "dailyStockPrice": updatedPrice, "timestamp": newTimestamp }, (err) =>
					{
						if (err) throw err;
					});
				});
			});

			//respond with all stocks that match userid if no error
			filterStocksByUserId(req, res, stock);

		//if price is not older, just do what is below
		} else {
			console.log("it has not been 15 mins, simply output data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			//respond with all stocks that match userid if no error
			filterStocksByUserId(req, res, stock);
		}
	});

};

// updates quantity and cash for user
exportsObject.updateQuantity = (req, res) =>
{
	console.log(req.params);
	//if selling stock subtract qty, if buy increase qty

	//variables to query db
		//the conditions to be matched to select stock to update
		// const conditions = {"_id": req.params.stockId};
		//the operation to be executed on the matched stock, in this case it is a subtraction operation (increment by negative quantity passed in) or addition operation
		let update;
		// req.params.operation === "buy" ? update = {$inc: {"quantity" : +req.params.qty}} : update = {$inc: {"quantity" : -req.params.qty}};
		// if operation is buy, update cash and quantity amounts
		if(req.params.operation === "buy")
		{
			console.log("butt>>>>>>>>>>>>>>>>>>>>");
			console.log( typeof req.params.qty);
			update = {$inc: {"stocks.$.quantity" : +req.params.qty}};

		//else if operation is sell, update cash and quantity amounts
		}
		else
		{
			update = {$inc: {"stocks.$.quantity" : -req.params.qty}};
		}

		//only target one item in db
		const options = {"multi": false};

	//update db for sold stocks
	// db.users.update({_id: ObjectId("56d25ca3b65e6845e5a737f1"),"stocks.stockId":ObjectId("56d2573022494da0e34e5407")}, {$inc: {"stocks.$.quantity" : +3}})
	// singleUser.update({
	// 	"_id": `ObjectId(${req.session.passport.user})`,
	// 	"stocks.stockId": `ObjectId(${req.params.stockId})`
	// },
	// console.log("update is");
	// console.log(update);
	// singleUser.update(conditions, update, options, (err, numStocksChanged) =>
	// {
	// 	if(err) throw err;
	//
	// 	console.log("you changed some stuff>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
	// 	console.log(numStocksChanged);
	//
	// 	//send success message to client if data was updated
	// 		res.send({"status":"success", "stocksChanged": numStocksChanged});
	// });



	// neeeeeeeeeeeeeeeeeeeeeeeeew mongo
	MongoClient.connect(url, function(err, db) {
		if(err) throw err;
			db.collection('users').update(
				{ _id: ObjectId("56d25ca3b65e6845e5a737f1"),"stocks.stockId":ObjectId("56d2573022494da0e34e5407")},
				update,
				function(err, results)
				{
					console.log("finished");
					console.log(results);
				});


});





};

module.exports = exportsObject;
