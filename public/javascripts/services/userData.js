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
			factoryExports.userData = data;
			cb(data);
    });
  };

	factoryExports.userData = "";


	return factoryExports;
}]);
