// controller/positionController.js
const Position = require('../Models/PositionModel');

const num = (v, d = 0) => Number.isFinite(Number(v)) ? Number(v) : d;

const computeBreakEven = (netAvgPrice, fees = 0, taxes = 0, netQty = 0) => {
  const perUnit = netQty > 0 ? (num(fees) + num(taxes)) / netQty : 0;
  const attempt = num(netAvgPrice) + num(perUnit);
  return Number.isFinite(attempt) ? attempt : num(netAvgPrice);
};

async function updatePositions(userId, order) {
  const rawSymbol = order.symbol || '';
  const symbol = String(rawSymbol).toUpperCase(); // normalize
  const qty = num(order.qty);
  const price = num(order.price);
  const mode = String(order.mode || '').toLowerCase();
  const name = order.name || symbol;

  // Preserve product type from order; default to CNC if missing
  const productType = order.productType || 'CNC';
  const multiplier = num(order.contractMultiplier, 1);

  // Find existing open row for this user/symbol/product
  let pos = await Position.findOne({ userId, symbol, productType, positionStatus: 'OPEN' });

  if (!pos) {
    pos = new Position({
      userId, symbol, name,
      productType,
      instrumentType: order.instrumentType || 'EQ',
      side: mode === 'buy' ? 'LONG' : 'SHORT',
      buyQty: 0, sellQty: 0, netQty: 0,
      avgBuyPrice: 0, avgSellPrice: 0, netAvgPrice: 0,
      lastPrice: price,
      realizedPnl: 0, unrealizedPnl: 0, pnlPercent: 0,
      contractMultiplier: multiplier
    });
  } else {
    // ensure multiplier is set
    if (!num(pos.contractMultiplier)) pos.contractMultiplier = multiplier || 1;
  }

  // Apply the fill
  if (mode === 'buy') {
    // If currently SHORT (netQty < 0), a buy reduces/ closes the short => realize P&L on the buy leg
    if (pos.netQty < 0) {
      const coverQty = Math.min(qty, Math.abs(pos.netQty));
      const realized = (pos.netAvgPrice - price) * coverQty * num(pos.contractMultiplier, 1);
      pos.realizedPnl += realized;
    }
    // Update buy leg averages and quantities
    const newBuyQty = pos.buyQty + qty;
    pos.avgBuyPrice = (pos.avgBuyPrice * pos.buyQty + price * qty) / (newBuyQty || 1);
    pos.buyQty = newBuyQty;
    pos.netQty += qty;

    // If net becomes LONG, netAvg is the buy VWAP
    if (pos.netQty > 0) { pos.side = 'LONG'; pos.netAvgPrice = pos.avgBuyPrice; }
    if (pos.netQty === 0) pos.positionStatus = 'CLOSED';

  } else if (mode === 'sell') {
    // If currently LONG (netQty > 0), a sell reduces/ closes the long => realize P&L on the sell leg
    if (pos.netQty > 0) {
      const exitQty = Math.min(qty, pos.netQty);
      const realized = (price - pos.netAvgPrice) * exitQty * num(pos.contractMultiplier, 1);
      pos.realizedPnl += realized;
    }
    // Update sell leg averages and quantities
    const newSellQty = pos.sellQty + qty;
    pos.avgSellPrice = (pos.avgSellPrice * pos.sellQty + price * qty) / (newSellQty || 1);
    pos.sellQty = newSellQty;
    pos.netQty -= qty;

    // If net becomes SHORT, netAvg is the sell VWAP
    if (pos.netQty < 0) { pos.side = 'SHORT'; pos.netAvgPrice = pos.avgSellPrice; }
    if (pos.netQty === 0) pos.positionStatus = 'CLOSED';
  }

  // Update mark price and recompute unrealized for OPEN positions
  pos.lastPrice = price;

  if (pos.netQty !== 0) {
    const m = num(pos.contractMultiplier, 1);
    if (pos.side === 'LONG') {
      pos.unrealizedPnl = (pos.lastPrice - pos.netAvgPrice) * pos.netQty * m;
    } else {
      pos.unrealizedPnl = (pos.netAvgPrice - pos.lastPrice) * Math.abs(pos.netQty) * m;
    }
    const basis = Math.abs(num(pos.netAvgPrice) * num(pos.netQty) * m);
    pos.pnlPercent = basis > 0 ? (pos.unrealizedPnl / basis) * 100 : 0;
    pos.breakEvenPrice = computeBreakEven(pos.netAvgPrice, pos.fees, pos.taxes, Math.abs(pos.netQty));
    pos.positionStatus = 'OPEN';
  } else {
    pos.unrealizedPnl = 0;
    pos.pnlPercent = 0;
  }

  pos.lastUpdated = new Date();
  await pos.save();
  return pos;
}

async function getPositions(req, res) {
  try {
    const { status = 'OPEN' } = req.query;
    const filter = { userId: req.userId };
    if (status && status !== 'ALL') filter.positionStatus = status.toUpperCase();
    const positions = await Position.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, positions, count: positions.length });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch positions' });
  }
}

async function squareOffPosition(req, res) {
  try {
    const symbol = String(req.params.symbol || '').toUpperCase();
    const pos = await Position.findOne({ userId: req.userId, symbol, positionStatus: 'OPEN' });
    if (!pos || num(pos.netQty) === 0) {
      return res.status(400).json({ success: false, error: 'No open position to square off' });
    }
    // Realize current unrealized and close
    pos.realizedPnl += num(pos.unrealizedPnl);
    pos.unrealizedPnl = 0;
    pos.pnlPercent = 0;
    pos.netQty = 0;
    pos.positionStatus = 'CLOSED';
    pos.lastUpdated = new Date();
    await pos.save();
    res.json({ success: true, message: 'Position squared off', position: pos });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to square off position' });
  }
}

module.exports = { updatePositions, getPositions, squareOffPosition };
