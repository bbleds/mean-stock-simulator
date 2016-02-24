"use strict";

const app = angular.module("stockApp", ["ui.router"]);

//configure app with ui-router
app.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
	//configure routes, controllers are bound within html partials
	$stateProvider
		.state('index', {
			url: '/',
			templateUrl: 'www/html-partials/index.html'
		})
		.state('quotes', {
			url: '/quotes',
			templateUrl: 'www/html-partials/quotes.html'
		})
		.state('portfolio', {
			url: '/portfolio',
			templateUrl: 'www/html-partials/portfolio.html'
		});
	//if we load in erroneous route, go  back to base/catch-all route
	$urlRouterProvider.otherwise('/');
});


app.controller("mainCtrl", ["$http", "userData", function($http, $userData)
{
	$userData.getUserData();
}]);
