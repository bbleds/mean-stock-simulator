"use strict";
app.controller("quotesCtrl", ["$http", "$state",  function($http, $state)
{
	const self = this;
	self.quoteFound = false;

	//gets quote for a stock
	self.getQuote = (sym) =>
	{
		//get quote from api
		$http.get(`/api/quotes/${sym}`)
		.then((data)=>
		{
			data.status === 200 ? (self.stockInfo = data, self.quoteFound = true) : console.log("not found");
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
