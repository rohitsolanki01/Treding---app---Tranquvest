const Order = require('../Models/Order');
const Holdings = require('../Models/HoldingModel');

module.exports.newOrder = async (req, res) => {
  try {
    const { name, symbol, qty, price, mode } = req.body;
    if (!name || !symbol || !qty || !price || !mode) {
      return res.status(400).json({ success: false, error: 'Missing required fields: name, symbol, qty, price, mode' });
    }
    if (!req.userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const calculatedQty = parseInt(qty);
    const calculatedPrice = parseFloat(price);
    const calculatedTotalValue = calculatedQty * calculatedPrice;

    // ✅ Prevent oversell
    if (mode.toLowerCase() === 'sell') {
      const holding = await Holdings.findOne({ userId: req.userId, symbol: symbol.toUpperCase() });
      if (!holding || holding.totalQty < calculatedQty) {
        return res.status(400).json({
          success: false,
          error: `Insufficient holdings. You have ${holding?.totalQty || 0} shares of ${symbol}`
        });
      }
    }

    const orderData = {
      userId: req.userId,
      name,
      symbol: symbol.toUpperCase(),
      qty: calculatedQty,
      price: calculatedPrice,
      mode: mode.toLowerCase(),
      totalValue: calculatedTotalValue,
      status: 'executed'
    };

    const newOrder = new Order(orderData);
    if (!newOrder.totalValue) {
      newOrder.totalValue = newOrder.qty * newOrder.price;
    }
    await newOrder.save();
    console.log('✅ Order saved successfully:', newOrder._id);

    // ✅ CRITICAL: persist portfolio state right after order execution
    await updateHoldings(req.userId, newOrder);

    return res.status(201).json({
      success: true,
      message: `${mode.charAt(0).toUpperCase() + mode.slice(1)} order executed successfully`,
      order: newOrder
    });
  } catch (error) {
    console.error('❌ CRITICAL ORDER ERROR:', error);
    return res.status(500).json({ success: false, error: 'Failed to create order', details: error.message });
  }
};


// ✅ ENHANCED: Portfolio management function
const updateHoldings = async (userId, order) => {
    try {
        const { symbol, qty, price, mode } = order;
        
        let holding = await Holdings.findOne({ userId, symbol });
        
        if (mode === 'buy') {
            if (holding) {
                // ✅ Update existing holding - average price calculation
                const newTotalQty = holding.totalQty + qty;
                const newTotalInvested = holding.totalInvested + (qty * price);
                const newAvgPrice = newTotalInvested / newTotalQty;
                
                holding.totalQty = newTotalQty;
                holding.avgPrice = newAvgPrice;
                holding.totalInvested = newTotalInvested;
                holding.currentPrice = price; // Update current price
                holding.marketValue = newTotalQty * price;
                holding.pnl = holding.marketValue - holding.totalInvested;
                holding.pnlPercent = (holding.pnl / holding.totalInvested) * 100;
                
            } else {
                // ✅ Create new holding
                holding = new Holdings({
                    userId,
                    symbol,
                    name: order.name,
                    totalQty: qty,
                    avgPrice: price,
                    totalInvested: qty * price,
                    currentPrice: price,
                    marketValue: qty * price,
                    pnl: 0,
                    pnlPercent: 0
                });
            }
            
        } else if (mode === 'sell' && holding) {
            // ✅ Reduce holding on sell
            holding.totalQty -= qty;
            
            if (holding.totalQty <= 0) {
                // ✅ Remove holding if completely sold
                await Holdings.findByIdAndDelete(holding._id);
                return;
            } else {
                // ✅ Update remaining holding
                holding.totalInvested = holding.totalQty * holding.avgPrice;
                holding.currentPrice = price;
                holding.marketValue = holding.totalQty * price;
                holding.pnl = holding.marketValue - holding.totalInvested;
                holding.pnlPercent = holding.totalInvested > 0 ? (holding.pnl / holding.totalInvested) * 100 : 0;
            }
        }
        
        await holding.save();
        console.log(`✅ Holdings updated for ${symbol}: ${holding.totalQty} shares`);
        
    } catch (error) {
        console.error('❌ Holdings update error:', error);
    }
};

// ✅ ENHANCED: Get portfolio summary
module.exports.getPortfolioSummary = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Get all orders
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        
        // Get current holdings
        const holdings = await Holdings.find({ userId });
        
        // Calculate portfolio metrics
        const buyOrders = orders.filter(o => o.mode === 'buy' && o.status === 'executed');
        const sellOrders = orders.filter(o => o.mode === 'sell' && o.status === 'executed');
        
        const totalInvested = buyOrders.reduce((sum, order) => sum + order.totalValue, 0);
        const totalRealized = sellOrders.reduce((sum, order) => sum + order.totalValue, 0);
        const currentHoldingsValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
        const totalPnL = holdings.reduce((sum, holding) => sum + holding.pnl, 0);
        
        const portfolio = {
            totalOrders: orders.length,
            buyOrders: buyOrders.length,
            sellOrders: sellOrders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            executedOrders: orders.filter(o => o.status === 'executed').length,
            totalInvested,
            totalRealized,
            currentHoldingsValue,
            totalPnL,
            totalPnLPercent: totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0,
            netPosition: currentHoldingsValue + totalRealized - totalInvested,
            holdings: holdings,
            recentOrders: orders.slice(0, 10)
        };
        
        res.json({
            success: true,
            portfolio
        });
        
    } catch (error) {
        console.error('❌ Portfolio summary error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get portfolio summary'
        });
    }
};

// ✅ ENHANCED: Get holdings
// ✅ Enhanced getHoldings function
module.exports.getHoldings = async (req, res) => {
    try {
        console.log('🏠 Holdings API called for user:', req.userId);
        
        // Check if Holdings model exists
        if (!req.userId) {
            console.log('❌ No userId found in request');
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const holdings = await Holdings.find({ userId: req.userId });
        console.log('📊 Holdings found in DB:', holdings.length);
        
        holdings.forEach((holding, index) => {
            console.log(`  ${index + 1}. ${holding.symbol}: ${holding.totalQty} shares`);
        });

        res.json({
            success: true,
            holdings: holdings,
            count: holdings.length
        });
        
    } catch (error) {
        console.error('❌ Get holdings error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get holdings',
            details: error.message
        });
    }
};

// Keep existing getOrders and cancelOrder methods...
module.exports.getOrders = async (req, res) => {
    try {
        const { status, mode, limit = 50 } = req.query;
        const filter = { userId: req.userId };
        
        if (status) filter.status = status;
        if (mode) filter.mode = mode;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({
            success: true,
            orders: orders,
            count: orders.length
        });

    } catch (error) {
        console.error('❌ Fetch orders error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch orders' 
        });
    }
};

module.exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOneAndUpdate(
            { _id: orderId, userId: req.userId },
            { status: 'cancelled' },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            order: order
        });

    } catch (error) {
        console.error('❌ Cancel order error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to cancel order' 
        });
    }
};
