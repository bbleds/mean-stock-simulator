"use strict";
// gets user data from api
app.factory("userData", ["$http", ($http) =>
{
	const factoryExports = {};

  // query api
  factoryExports.getUserData = (cb) =>
  {
    $http.get("/api/userdata")
    .then((data)=>
    {
      console.log("received data");
      console.log(data);
			cb(data);
    });
  };


	return factoryExports;
}]);
