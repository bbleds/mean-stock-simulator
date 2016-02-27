"use strict";
app.controller("quotesCtrl", ["$http", "$state",  function($http, $state)
{
	const self = this;
	self.quoteFound = false;
	self.quoteError = false;

	//gets quote for a stock
	self.getQuote = (sym) =>
	{
		//get quote from api
		$http.get(`/api/quotes/${sym}`)
		.then((data)=>
		{
			console.log("data is ");
			console.log(data);
			data.data.error ? self.quoteError = true : (self.stockInfo = data, self.quoteFound = true, self.quoteError = false);
		});
	};

	//saves/buys stock to mongodb and returns message if successful
	self.getStock = (company, quantity, purchasePrice, symbol) =>
	{
		//get quote from api
		$http.post(`/api/getStock/${company}/${quantity}/${purchasePrice}/${symbol}`)
		.then((data)=>
		{
			//display success message to user
			self.getStockSuccess	= data;

		});
	};

}]);
