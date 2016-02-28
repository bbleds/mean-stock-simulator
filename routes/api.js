"use strict";
const express = require("express");
const router = express.Router();
const UserModel = require("../models/user");
const portfolioCtrl = require("../controllers/portfolioCtrl");
const getQuoteCtrl = require("../controllers/getQuoteCtrl");
const getStockCtrl = require("../controllers/getStockCtrl");

// gets information relative to logged in user
router.get('/api/userdata', (req, res) =>
{
  //query db and send back logged in user information to client
  UserModel.findOne({"_id": req.session.passport.user}, (err, userFound) =>
  {
    if (err) throw err;
      res.json({userId: req.session.passport.user, username: userFound.username, cashAvailable: userFound.cash});
  });
});

// ---------- Portfolio routes
//queries db and sends back data as json to /api/portfolio route
router.get("/api/portfolio", portfolioCtrl.getAllStock);
//updates db with new quantity after stocks are sold
router.put("/api/portfolio/:qty/:stockId/:operation", portfolioCtrl.updateQuantity);
//refresh db with updated prices
router.put("/api/portfolio/:qty/:stockId/:operation", portfolioCtrl.updateStockPrice);


// --------  Get Quote Route
router.get("/api/quotes/:symbol", getQuoteCtrl.getQuoteBySymbol);

// ---------- Save Quote Route
router.post("/api/getStock/:company/:quantity/:purchaseStockPrice/:symbol", getStockCtrl.getStock);

// ---------- Cash interaction Routes
router.get("/api/cash", (req, res) =>
{
  res.send({"hello": "world"})
});

module.exports = router;
