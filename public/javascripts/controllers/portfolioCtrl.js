"use strict";
app.controller("portfolioCtrl", ["$http", "buyStocksFactory", function($http, $buyStocksFactory)
{
	const self = this;

	//total each (stock * qty) for each stock and add result to totalPortfolioValue
	const updatePortfolioValue = () =>
	{
		//set total stock value to 0
		self.totalPortfolioValue = 0;

		self.stocksArray.map((item, index)=>{
				self.totalPortfolioValue += (item.dailyStockPrice * item.quantity);
			});
	};

	//get data from mongo for each stock and output the various components, executes immediately
	self.loadStocks = (() =>
	{
		//get stock data
		$http.get("/api/portfolio")
		.then((data)=>
		{
			//array holding all stocks owned by user
			self.stocksArray = data.data;

			//update totalPortfolioValue
			updatePortfolioValue();

		});
	})();

	//Set stock that was clicked on to be the current stock selected
	self.setClickedStock = (stock) =>
	{
		console.log(stock);
		self.stockSelected = stock;
	};

	//Update data in mongo when user sells stock
	self.modifyStocks = (qty, stockId, operation) =>
	{
		//update db
		$http.put(`/api/portfolio/${qty}/${stockId}/${operation}`)
		.then((response)=>
		{

		  //live update page when db successfully updated
			//go to item in array that was sold, and update quantity in array
			self.stocksArray.map((item,index) =>
			{
				//if item id matches stockId passed in, update the quantity key
				item["_id"] === stockId && operation === 'sell' ? (item.quantity-= qty, updatePortfolioValue()) : console.log(" no match");
				item["_id"] === stockId && operation === 'buy' ? (item.quantity = parseInt(item.quantity) + parseInt(qty), updatePortfolioValue()) : console.log(" no match");
			});

		});
	};

}]);
