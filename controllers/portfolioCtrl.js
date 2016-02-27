"use strict";
//-------------- dependencies
// modules
const request = require("request");
const _ = require("lodash");
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
				// if itme id matches stock item id push into filteredresobject
				if(item.stockId.toString() === stockItem._id.toString()){
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
		const hasBeenRefreshed = false;

		// time on stocks converted to minutes
		const timeOnStocks = Math.floor((stock[0].timestamp/1000)/60);
		// current time converted to minutes
		const currentTime = Math.floor((new Date().getTime()/1000)/60);

		//if price data is older than 15 mins, update price data for each item in db and then finish with function below
		if(true)
		{
			console.log("it has been 15 mins you should query for new data");

			//loop through each stock and update price for each
			stock.map((item, index) =>
			{
				console.log("before request");
				let url = `https://finance.yahoo.com/webservice/v1/symbols/${item.symbol}/quote?format=json`;

				request.get(url, (err, response, body )=>
				{
					if(err) throw err;


					//parse data from api and store current price from api in variable
					const data = JSON.parse(body);


					//update db with updated price
					console.log("data is");
					console.log(data.list.resources[0].resource.fields);
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

exportsObject.updateQuantity = (req, res) =>
{
	console.log(req.params);
	//if selling stock subtract qty, if buy increase qty

	//variables to query db
		//the conditions to be matched to select stock to update
		const conditions = {"_id": req.params.stockId};
		//the operation to be executed on the matched stock, in this case it is a subtraction operation (increment by negative quantity passed in) or addition operation
		let update;
		req.params.operation === "buy" ? update = {$inc: {"quantity" : +req.params.qty}} : update = {$inc: {"quantity" : -req.params.qty}};
		//only target one item in db
		const options = {"multi": false};

	//update db for sold stocks
	stockItem.update(conditions, update, options, (err, numStocksChanged) => {
		if(err) throw err;

		//send success message to client if data was updated
		res.send({"status":"success", "stocksChanged": numStocksChanged});

	});
};

exportsObject.updateStockPrice = (req, res) =>
{

};

module.exports = exportsObject;
