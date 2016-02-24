"use strict";
// gets user data from api
app.factory("userData", ["$http", ($http) =>
{
	const factoryExports = {};

  // query api
  factoryExports.getUserData = () =>
  {
    $http.get("/api/userdata")
    .then((data)=>
    {
      console.log("received data");
      console.log(data);
    });
  };


	return factoryExports;
}]);
