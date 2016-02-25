"use strict";
//dependencies
const request = require("request");
const stockItem = require("../models/stockItem");

//module exports object
const exportsObject = {};

exportsObject.getAllStock = (req, res) =>
{
	//query db for all stocks items
	stockItem.find({}, (err,stock)=>
	{
		if (err) throw err;
		// time on stocks converted to minutes
		const timeOnStocks = Math.floor((stock[0].timestamp/1000)/60);
		// current time converted to minutes
		const currentTime = Math.floor((new Date().getTime()/1000)/60);

		//if price data is older than 15 mins, update price data for each item in db and then finish with function below
		if((timeOnStocks+15) < currentTime){
			console.log("it has been 15 mins you should query for new data");

			//loop through each stock and update price for each
			console.log(stock);
			stock.map((item, index) =>
			{
				let url = `http:/\/dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=${item.symbol}`;

				request.get(url, (err, response, body )=>
				{
					//parse data from api and store current price from api in variable
					const data = JSON.parse(body);
					let updatedPrice = data.LastPrice;

					console.log("last LastPrice is "+ updatedPrice);

					//update db with updated price
					console.log("data is");
					console.log(data);

					stockItem.findByIdAndUpdate(item._id, { "dailyStockPrice": updatedPrice }, (err) =>
					{
						if (err) throw err;
					});
				});
			});

		//if price is not older, just do what is below
		} else {
			console.log("it has not been 15 mins, simply output data");
		}

		//respond with all stocks if no error
		res.json(stock);
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
	console.log("bruhhhhhhhh");

};

module.exports = exportsObject;
