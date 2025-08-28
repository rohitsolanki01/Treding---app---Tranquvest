 const express = require('express');
 const router = express.Router();
 const authenticateToken = require('../uthMiddleware');
 const {
   newOrder, getOrders, cancelOrder, getPortfolioSummary, getHoldings
 } = require("../controller/orderController");
const { getPositions, squareOffPosition } = require("../controller/positionCotroller");

 router.post("/neworder", authenticateToken, newOrder);
 router.get("/orders", authenticateToken, getOrders);
 router.put("/orders/:orderId/cancel", authenticateToken, cancelOrder);
 router.get("/portfolio", authenticateToken, getPortfolioSummary);
 router.get("/holdings", authenticateToken, getHoldings);
 router.get("/positions", authenticateToken, getPositions);
 router.put("/positions/:symbol/squareoff", authenticateToken, squareOffPosition);

 module.exports = router;
